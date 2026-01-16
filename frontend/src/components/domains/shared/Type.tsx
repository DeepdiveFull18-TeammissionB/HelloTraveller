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
    description?: string;
    price: number;
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

const CITIES = [
    { name: 'Seoul', lat: 37.5665, lon: 126.9780, label: '서울 (Seoul)' },
    { name: 'Barcelona', lat: 41.3851, lon: 2.1734, label: '바르셀로나 (Barcelona)' },
    { name: 'Paris', lat: 48.8566, lon: 2.3522, label: '파리 (Paris)' },
    { name: 'London', lat: 51.5074, lon: -0.1278, label: '런던 (London)' },
    { name: 'New York', lat: 40.7128, lon: -74.0060, label: '뉴욕 (New York)' },
    { name: 'Bangkok', lat: 13.7563, lon: 100.5018, label: '방콕 (Bangkok)' },
    { name: 'Osaka', lat: 34.6937, lon: 135.5023, label: '오사카 (Osaka)' },
    { name: 'Rome', lat: 41.9028, lon: 12.4964, label: '로마 (Rome)' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, label: '도쿄 (Tokyo)' },
];

interface TourItem {
    name: string;
    imagePath: string;
    description: string;
    price: number;
    matchedOptions?: string[];
}

const Type: React.FC<TypeProps> = ({ orderType, hideHeader = false }) => {
    const [items, setItems] = useState<TourItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCity, setCurrentCity] = useState(CITIES[0]); // Default to Seoul
    const contextValue = useContext(OrderContext);

    // Context가 null인 경우를 대비한 안전 장치
    if (!contextValue) {
        throw new Error('Type component must be used within an OrderContextProvider');
    }
    const [orderData, updateItemCount] = contextValue;

    const fetchData = async () => {
        setLoading(true);
        try {
            let data: TourItem[] = [];
            let params: Record<string, string> = {};
            let endpoint = '';

            if (orderType === 'products') {
                // Randomly select a city
                const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
                setCurrentCity(randomCity); // Update currentCity state
                params = { lat: String(randomCity.lat), lon: String(randomCity.lon) };
                endpoint = '/api/tours'; // Original endpoint
            } else {
                endpoint = '/options'; // Original endpoint
            }

            // API 호출
            const response = await apiClient.get(endpoint, { params });
            data = response.data;

            // 데이터 매핑
            let mappedItems: TourItem[] = [];
            if (orderType === 'products') {
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                const randomTen = shuffled.slice(0, 10);
                mappedItems = randomTen.map((item: TourItem) => ({
                    name: item.name,
                    imagePath: item.imagePath,
                    description: item.description || "현지에서 즐기는 특별한 투어 경험입니다.",
                    price: item.price || 1000,
                    matchedOptions: item.matchedOptions || []
                }));
            } else {
                // 부가 옵션은 필터링 없이 모두 표시
                mappedItems = data.map((item: TourItem) => ({
                    name: item.name,
                    imagePath: item.imagePath || "", // Options might have images, keep original logic
                    description: item.description || "추가 선택이 가능한 옵션입니다.",
                    price: item.price || 500,
                    matchedOptions: [] // Options typically don't have matchedOptions
                }));
            }

            setItems(mappedItems);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 비동기 틱으로 미뤄 린트의 cascading render 경고를 회피하고 정석적인 마운트 로직 적용
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [orderType]);

    const ItemComponent = orderType === "products" ? Products : Options;

    // 스켈레톤 UI 구성
    const SkeletonItem = () => (
        <div style={{
            width: '280px',
            height: '380px',
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            animation: 'pulse 1.5s infinite ease-in-out',
            flexShrink: 0
        }} />
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <style jsx global>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>

            {!hideHeader && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Text typography="heading4" style={{ fontWeight: 700 }}>
                        {orderType === 'products' ? `인기 투어 상품 (in ${currentCity.name})` : '여행 옵션 선택'}
                    </Text>
                    <Text typography="body3" color="text-secondary">
                        장바구니 합계: {orderData.totals[orderType].toLocaleString()}원
                    </Text>
                </div>
            )}

            <div style={{ position: 'relative', width: '100%' }}>
                {loading ? (
                    <div style={{ display: 'flex', gap: '24px', overflow: 'hidden', padding: '20px 10px' }}>
                        {[1, 2, 3, 4].map((i) => <SkeletonItem key={i} />)}
                    </div>
                ) : (
                    <>
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
                            {items.map((item, index) => {
                                const currentItem = orderData[orderType].get(item.name);
                                return (
                                    <SwiperSlide key={`${item.name}-${index}`} style={{ width: 'auto' }}>
                                        <ItemComponent
                                            name={item.name}
                                            imagePath={item.imagePath}
                                            description={item.description}
                                            price={item.price}
                                            matchedOptions={item.matchedOptions} // 스마트 매칭 옵션 전달
                                            checked={(currentItem?.count || 0) > 0}
                                            currentCount={currentItem?.count || 0}
                                            totalPeople={orderData.totals.totalCount}
                                            updateItemCount={(itemName: string, count: number | string, isReplace?: boolean) =>
                                                updateItemCount(itemName, count, orderType, {
                                                    imagePath: item.imagePath,
                                                    price: item.price
                                                }, isReplace)
                                            }
                                        />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        {/* 내비게이션 버튼 (기존 스타일 유지) */}
                        <div className="swiper-button-prev-custom" style={navBtnStyle(true)}>‹</div>
                        <div className="swiper-button-next-custom" style={navBtnStyle(false)}>›</div>
                    </>
                )}
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
