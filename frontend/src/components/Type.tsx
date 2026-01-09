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
    hideHeader?: boolean;
}

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Type: React.FC<TypeProps> = ({ orderType, hideHeader = false }) => {
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
        <SwiperSlide key={item.name} style={{ width: 'auto' }}>
            <ItemComponent
                name={item.name}
                imagePath={item.imagePath}
                updateItemCount={(itemName: string, newItemCount: string | number) =>
                    updateItemCount(itemName, newItemCount, orderType)
                }
            />
        </SwiperSlide>
    ));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!hideHeader && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Text typography="heading4" style={{ fontWeight: 700 }}>
                        {orderType === 'products' ? '투어 상품 선택' : '여행 옵션 선택'}
                    </Text>
                    <Text typography="body3" color="text-secondary">
                        선택한 항목 합계: {orderData.totals[orderType].toLocaleString()}원
                    </Text>
                </div>
            )}

            <div style={{ position: 'relative', width: '100%' }}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView="auto"
                    slidesPerGroup={1}
                    loop={true}
                    centeredSlides={false}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    style={{
                        width: '100%',
                        padding: '0 10px 3.5rem 10px',
                    }}
                >
                    {optionItems}
                </Swiper>
                <div
                    className="swiper-button-prev-custom"
                    style={{
                        position: 'absolute',
                        left: '-60px',
                        top: '40%',
                        fontSize: '40px',
                        cursor: 'pointer',
                        zIndex: 10,
                        color: '#000',
                        fontWeight: 'bold'
                    }}
                >
                    ‹
                </div>
                <div
                    className="swiper-button-next-custom"
                    style={{
                        position: 'absolute',
                        right: '-60px',
                        top: '40%',
                        fontSize: '40px',
                        cursor: 'pointer',
                        zIndex: 10,
                        color: '#000',
                        fontWeight: 'bold'
                    }}
                >
                    ›
                </div>
            </div>
        </div>
    );
};

export default Type;
