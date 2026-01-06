"use client";
import React, { createContext, useMemo, useState, useEffect, ReactNode } from "react";

export type OrderType = "products" | "options";

interface Totals {
    products: number;
    options: number;
    total: number;
}

interface OrderCounts {
    products: Map<string, number>;
    options: Map<string, number>;
}

export interface OrderData extends OrderCounts {
    totals: Totals;
}

type UpdateItemCount = (itemName: string, newItemCount: string | number, orderType: OrderType) => void;

// Context value type: [orderData, updateItemCount]
export type OrderContextValue = [OrderData, UpdateItemCount];

const OrderContext = createContext<OrderContextValue | undefined>(undefined);
export default OrderContext;

interface OrderContextProviderProps {
    children: ReactNode;
}

export function OrderContextProvider(props: OrderContextProviderProps) {
    const [orderCounts, setOrderCounts] = useState<OrderCounts>({
        products: new Map(),
        options: new Map()
    });

    const [totals, setTotals] = useState<Totals>({
        products: 0,
        options: 0,
        total: 0
    });

    const pricePerItem: Record<OrderType, number> = {
        products: 1000,
        options: 500,
    };

    function calculateSubtotal(orderType: OrderType, currentOrderCounts: OrderCounts): number {
        let countSum = 0;
        const itemsMap = currentOrderCounts[orderType];
        for (const count of itemsMap.values()) {
            countSum += count;
        }
        return countSum * pricePerItem[orderType];
    }

    useEffect(() => {
        const productsTotal = calculateSubtotal("products", orderCounts);
        const optionsTotal = calculateSubtotal("options", orderCounts);
        const total = productsTotal + optionsTotal;
        setTotals({
            products: productsTotal,
            options: optionsTotal,
            total: total,
        });
    }, [orderCounts]);

    const value = useMemo<OrderContextValue>(() => {
        function updateItemCount(itemName: string, newItemCount: string | number, orderType: OrderType) {
            const newOrderCounts = { ...orderCounts };
            const orderCountsMap = newOrderCounts[orderType];
            orderCountsMap.set(itemName, typeof newItemCount === 'string' ? parseInt(newItemCount) : newItemCount);
            setOrderCounts(newOrderCounts);
        }
        return [{ ...orderCounts, totals }, updateItemCount];
    }, [orderCounts, totals]);

    return <OrderContext.Provider value={value}>
        {props.children}
    </OrderContext.Provider>;
}
