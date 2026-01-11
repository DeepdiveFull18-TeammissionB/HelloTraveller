"use client";
import React, { useEffect, useState } from 'react';
import OrderComplete from "../../components/OrderComplete";
import { cartService } from "../../services/cartService";
import { useRouter } from 'next/navigation';

export default function OrderPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);    

    useEffect(() => {
        const savedOrders = cartService.getOrders();
        setOrders(savedOrders);
    }, []);

    const formattedTickets = orders.map((order) => ({
        orderNumber: order.orderId,
        amount: order.totalAmount,
    }));

    return (
        <OrderComplete
            dDay={1}
            tickets={formattedTickets}
            onBack={() => router.back()}
        />
    );
}