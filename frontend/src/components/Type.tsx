"use client";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Text
} from '@vapor-ui/core';
import Products from './Products';
import Options from './Options';
import OrderContext, { OrderType } from '../context/OrderContext';

interface Item {
    name: string;
    imagePath: string;
}

interface TypeProps {
    orderType: OrderType;
}

const Type: React.FC<TypeProps> = ({ orderType }) => {
    const [items, setItems] = useState<Item[]>([]);
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('Type component must be used within an OrderContextProvider');
    }

    const [orderData, updateItemCount] = context;

    useEffect(() => {
        loadItems(orderType);
    }, [orderType]);

    const loadItems = async (type: OrderType) => {
        try {
            const response = await axios.get(`http://localhost:4000/${type}`);
            setItems(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const ItemComponent = orderType === "products" ? Products : Options;

    const optionItems = items.map((item) => (
        <ItemComponent
            key={item.name}
            name={item.name}
            imagePath={item.imagePath}
            updateItemCount={(itemName: string, newItemCount: string | number) =>
                updateItemCount(itemName, newItemCount, orderType)
            }
        />
    ));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Text typography="heading4" style={{ fontWeight: 700 }}>
                    {orderType === 'products' ? '투어 상품 선택' : '여행 옵션 선택'}
                </Text>
                <Text typography="body3" color="text-secondary">
                    선택한 항목 합계: {orderData.totals[orderType].toLocaleString()}원
                </Text>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: orderType === "products" ? 'repeat(2, 1fr)' : '1fr',
                    gap: '1rem'
                }}
            >
                {optionItems}
            </div>
        </div>
    );
};

export default Type;
