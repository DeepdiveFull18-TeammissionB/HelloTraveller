"use client";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Text
} from '@vapor-ui/core';
import Products from './Products';
import Options from './Options';
import OrderContext from '../context/OrderContext';
import { OrderType } from '../types/order';

interface Item {
    name: string;
    imagePath: string;
    description?: string; // 추가
}

interface TypeProps {
    orderType: OrderType;
    hideHeader?: boolean;
}

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import apiClient from '../services/apiClient';
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
            const response = await apiClient.get(`/${type}`);
            setItems(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const ItemComponent = orderType === "products" ? Products : Options;

    const optionItems = items.map((item) => {
        // 현재 선택된 항목인지 확인 (products 또는 options 맵에서 조회)
        const currentItem = orderData[orderType].get(item.name);
        const isChecked = (currentItem?.count || 0) > 0;

        return (
            <SwiperSlide key={item.name} style={{ width: 'auto' }}>
                <ItemComponent
                    name={item.name}
                    imagePath={item.imagePath}
                    description={item.description}
                    checked={isChecked} // 현재 선택 상태 전달
                    currentCount={currentItem?.count || 0}
                    totalPeople={orderData.totals.totalCount} // 전체 인원수 전달
                    updateItemCount={(itemName: string, newItemCount: string | number, isReplace?: boolean) =>
                        updateItemCount(itemName, newItemCount, orderType, undefined, isReplace)
                    }
                />
            </SwiperSlide>
        );
    });

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
                        padding: '20px 10px 3.5rem 10px',
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
