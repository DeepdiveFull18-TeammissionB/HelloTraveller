"use client";
import React, { createContext, useMemo, useState, useEffect, ReactNode } from "react";
import { cartService, OrderCounts, ItemDetail } from "../services/cartService";


export type OrderType = "products" | "options";

interface Totals {
    products: number;   // 상품 총 금액
    options: number;    // 옵션 총 금액
    total: number;      // 전체 합계 금액
    totalCount: number; // 상품 총 수량
}

export interface OrderItem extends ItemDetail {
    name: string;
}

export interface OrderData extends OrderCounts {
    totals: Totals;
    productItems: OrderItem[]; // 추가: 배열 형태의 상품 리스트
    optionItems: OrderItem[];  // 추가: 배열 형태의 옵션 리스트
}




type UpdateItemCount = (
    itemName: string, 
    newItemCount: string | number, 
    orderType: OrderType,
    metadata?: { 
        imagePath: string; 
        startDate?: string; 
        endDate?: string; 
        selectedOptions?: string[]
    }
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
            }
        ) {
            const addCount = typeof newItemCount === 'string' ? parseInt(newItemCount) || 0 : newItemCount;

            setOrderCounts(prev => {
                const newMap = new Map(prev[orderType]);
                const existingItem = newMap.get(itemName);
                
                // 기존 데이터가 있으면 유지하고 수량만 합산, 없으면 새로 받은 메타데이터 사용
                newMap.set(itemName, {
                    count: (existingItem?.count || 0) + addCount,
                    imagePath: metadata?.imagePath || existingItem?.imagePath || "",
                    startDate: metadata?.startDate || existingItem?.startDate,
                    endDate: metadata?.endDate || existingItem?.endDate,
                    selectedOptions: metadata?.selectedOptions || existingItem?.selectedOptions,
                });

                return { ...prev, [orderType]: newMap };
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
