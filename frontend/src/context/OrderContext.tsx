"use client";
import React, { createContext, useMemo, useState, useEffect, ReactNode } from "react";
import { cartService } from "../services/cartService";
import { OrderData, OrderCounts, Totals, OrderType, ItemDetail, OrderItem } from "../types/order";

// Local types removed as they are now imported from ../types/order




type UpdateItemCount = (
    itemName: string,
    newItemCount: string | number,
    orderType: OrderType,
    metadata?: {
        imagePath: string;
        startDate?: string;
        endDate?: string;
        selectedOptions?: string[]
    },
    isReplace?: boolean,
) => void;


// Context value type: [orderData, updateItemCount, resetOrderCounts]
export type OrderContextValue = [OrderData, UpdateItemCount, () => void];

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
        total: 0,
        totalCount: 0
    });


    const pricePerItem: Record<OrderType, number> = {
        products: 1000,
        options: 500,
    };

    useEffect(() => {
        const savedData = cartService.getCartItems();
        setOrderCounts(savedData);
    }, []);

    function calculateSubtotal(orderType: OrderType, currentOrderCounts: OrderCounts): number {
        let countSum = 0;
        const itemsMap = currentOrderCounts[orderType];
        for (const item of itemsMap.values()) {
            countSum += item.count;
        }
        return countSum * pricePerItem[orderType];
    }

    // 수량 합계(totalCount)를 구하는 함수
    function calculateTotalProductCount(currentOrderCounts: OrderCounts): number {
        let countSum = 0;
        // options는 제외하고 products만 순회
        for (const item of currentOrderCounts.products.values()) {
            countSum += item.count;
        }
        return countSum;
    }

    useEffect(() => {
        const productsTotalMoney = calculateSubtotal("products", orderCounts);
        const optionsTotalMoney = calculateSubtotal("options", orderCounts);
        const totalProductCount = calculateTotalProductCount(orderCounts);
        setTotals({
            products: productsTotalMoney,
            options: optionsTotalMoney,
            total: productsTotalMoney + optionsTotalMoney,
            totalCount: totalProductCount, // 결과 저장
        });

        cartService.saveCart(orderCounts);
    }, [orderCounts]);

    const value = useMemo<OrderContextValue>(() => {

        // Array로 미리 변환하는 함수
        const mapToArray = (map: Map<string, ItemDetail>): OrderItem[] => {
            return Array.from(map.entries())
                .filter(([_, item]) => item.count > 0)
                .map(([name, item]) => ({
                    name,
                    ...item
                }));
        };

        function updateItemCount(
            itemName: string,
            newItemCount: string | number,
            orderType: OrderType,
            metadata?: {
                imagePath: string;
                startDate?: string;
                endDate?: string;
                selectedOptions?: string[]
            },
            isReplace: boolean = false
        ) {
            const addCount = typeof newItemCount === 'string' ? parseInt(newItemCount) || 0 : newItemCount;

            setOrderCounts(prev => {
                const nextProducts = new Map(prev.products);
                const nextOptions = new Map(prev.options);

                if (orderType === "products") {
                    const existingItem = nextProducts.get(itemName);
                    const newCount = isReplace ? addCount : (existingItem?.count || 0) + addCount;

                    nextProducts.set(itemName, {
                        count: newCount,
                        imagePath: metadata?.imagePath || existingItem?.imagePath || "",
                        startDate: metadata?.startDate || existingItem?.startDate,
                        endDate: metadata?.endDate || existingItem?.endDate,
                        selectedOptions: metadata?.selectedOptions || existingItem?.selectedOptions || [],
                    });

                    // 상품 인원수가 바뀌면 선택된 모든 옵션의 수량도 '전체 투어 인원수'에 맞게 연동
                    let totalPeople = 0;
                    nextProducts.forEach(p => totalPeople += p.count);

                    nextOptions.forEach((opt, key) => {
                        if (opt.count > 0) {
                            nextOptions.set(key, { ...opt, count: totalPeople });
                        }
                    });
                } else {
                    const existingItem = nextOptions.get(itemName);
                    nextOptions.set(itemName, {
                        count: isReplace ? addCount : (existingItem?.count || 0) + addCount,
                        imagePath: metadata?.imagePath || existingItem?.imagePath || "",
                        startDate: metadata?.startDate || existingItem?.startDate,
                        endDate: metadata?.endDate || existingItem?.endDate,
                        selectedOptions: metadata?.selectedOptions || existingItem?.selectedOptions || [],
                    });
                }

                return { products: nextProducts, options: nextOptions };
            });
        }

        const resetCart = () => {
            cartService.clearCart(); // 1. 로컬스토리지 비우기
            setOrderCounts({ products: new Map(), options: new Map() }); // 2. 화면(상태) 비우기
        };

        //최종 데이터 구조
        const orderData: OrderData = {
            ...orderCounts,
            totals,
            productItems: mapToArray(orderCounts.products),
            optionItems: mapToArray(orderCounts.options),
        };

        return [orderData, updateItemCount, resetCart];
    }, [orderCounts, totals]);

    return <OrderContext.Provider value={value}>
        {props.children}
    </OrderContext.Provider>;
}
