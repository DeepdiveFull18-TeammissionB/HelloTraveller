"use client";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Text
} from '@vapor-ui/core';
import Products from './Products';
import Options from './Options';
import OrderContext from '../../../context/OrderContext';
import { OrderType } from '../../../types/order';

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
import apiClient from '../../../services/apiClient';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Type: React.FC<TypeProps> = ({ orderType, hideHeader = false }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('Type component must be used within an OrderContextProvider');
    }

    const [orderData, updateItemCount] = context;

    useEffect(() => {
        fetchTourData();
    }, []);

    const fetchTourData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/tours', {
                params: { lat: 37.5665, lon: 126.9780 }
            });

            const allData = response.data;
            const shuffled = [...allData].sort(() => Math.random() - 0.5);
            const randomTen = shuffled.slice(0, 10);

            const mappedItems = randomTen.map((item: any) => {

                return {
                    name: item.name,
                    imagePath: item.imagePath,
                    description: item.description || item.shortDescription || item.desc || "현지에서 즐기는 특별한 투어 경험입니다.",
                    price: item.price || 0
                };
            });

            setItems(mappedItems);
        } catch (error) {
            console.error("데이터 로드 에러:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const ItemComponent = orderType === "products" ? Products : Options;

    if (loading) return <div style={{ padding: '2rem' }}>추천 투어 리스트를 불러오는 중...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!hideHeader && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Text typography="heading4" style={{ fontWeight: 700 }}>
                        {orderType === 'products' ? '인기 투어 상품' : '여행 옵션 선택'}
                    </Text>
                    <Text typography="body3" color="text-secondary">
                        장바구니 합계: {orderData.totals[orderType].toLocaleString()}원
                    </Text>
                </div>
            )}

            <div style={{ position: 'relative', width: '100%' }}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView="auto"
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    pagination={{ clickable: true }}
                    style={{ width: '100%', padding: '20px 10px 3.5rem 10px' }}
                >
                    {items.map((item) => {
                        const currentItem = orderData[orderType].get(item.name);
                        return (
                            <SwiperSlide key={item.name} style={{ width: 'auto' }}>
                                <ItemComponent
                                    name={item.name}
                                    imagePath={item.imagePath}
                                    description={item.description}
                                    checked={(currentItem?.count || 0) > 0}
                                    currentCount={currentItem?.count || 0}
                                    totalPeople={orderData.totals.totalCount}
                                    updateItemCount={(itemName: string, count: any, isReplace?: boolean) =>
                                        updateItemCount(itemName, count, orderType, undefined, isReplace)
                                    }
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                
                {/* 내비게이션 버튼 (기존 스타일 유지) */}
                <div className="swiper-button-prev-custom" style={navBtnStyle(true)}>‹</div>
                <div className="swiper-button-next-custom" style={navBtnStyle(false)}>›</div>
            </div>
        </div>
    );
};

const navBtnStyle = (isLeft: boolean): React.CSSProperties => ({
    position: 'absolute',
    [isLeft ? 'left' : 'right']: '-60px',
    top: '40%',
    fontSize: '40px',
    cursor: 'pointer',
    zIndex: 10,
    color: '#000',
    fontWeight: 'bold'
});

export default Type;
