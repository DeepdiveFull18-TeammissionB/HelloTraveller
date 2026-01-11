"use client";
import React, { useEffect, useState } from 'react';
import OrderComplete from "../../components/OrderComplete";
import { cartService } from "../../services/cartService";
import { useRouter } from 'next/navigation';

export default function OrderPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]); 
    const [dDay, setDDay] = useState<number>(0);
       
    useEffect(() => {
            // 1. 주문 목록 가져오기
            const savedOrders = cartService.getOrders();
            setOrders(savedOrders);

            // 2. D-Day 계산 로직 실행
            const calculatedDDay = calculateNearestDDay(savedOrders);
            setDDay(calculatedDDay);
        }, []);

    // 가장 가까운 여행일까지의 D-Day 계산
    const calculateNearestDDay = (orderList: any[]): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allStartDates = orderList.flatMap(order => 
            order.items.map((item: any) => new Date(item.startDate))
        );

        // 오늘 이후의 날짜만 필터링
        const futureDates = allStartDates.filter(date => date >= today);

        if (futureDates.length === 0) return 0;

        const nearestDate = new Date(Math.min(...futureDates.map(d => d.getTime())));

        const diffTime = nearestDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const formattedTickets = orders.map((order) => ({
        orderNumber: order.orderId,
        amount: order.totalAmount,
    }));

    return (
        <OrderComplete
            dDay={dDay}
            tickets={formattedTickets}
            onBack={() => router.back()}
        />
    );
}