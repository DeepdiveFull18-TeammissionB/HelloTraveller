"use client";
import React, { ChangeEvent, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import OrderContext from '../context/OrderContext';
import {
    Card,
    Text,
    Button,
    TextInput,
    Checkbox
} from '@vapor-ui/core';
import { showAlert } from './AlertPortal';
import { useRouter } from 'next/navigation';
interface ProductsProps {
    name: string;
    imagePath: string;
    description?: string;
    width?: string;
    // Type component에서 전달하는 추가 props (lint 에러 방지용)
    checked?: boolean;
    currentCount?: number;
    totalPeople?: number;
    updateItemCount?: (itemName: string, newItemCount: string | number, isReplace?: boolean) => void;
}

const allOptions = ['현지 가이드 동행', '교통비 포함', '전용 보트 서비스', '중식 및 생수 제공', '입장료 전부 포함', '여행자 보험'];

/**
 * 여행 상품 컴포넌트
 * 이미지 기반의 카드 타입 UI와 상세 정보를 볼 수 있는 프리미엄 모달을 제공합니다.
 */
const Products: React.FC<ProductsProps> = ({ name, imagePath, description, width = '240px' }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [personCount, setPersonCount] = useState<string>("1");
    const [selectedOptions, setSelectedOptions] = useState<string[]>(allOptions);
    const [startDate, setStartDate] = useState<string>("2026-01-10");
    const [endDate, setEndDate] = useState<string>("2026-01-15");

    const contextValue = useContext(OrderContext);
    if (!contextValue) return null; // Context가 없을 경우 안전장치
    const [, updateItemCount] = contextValue;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value;
        // 숫자만 입력 가능하게 필터링
        const onlyNumber = currentValue.replace(/[^0-9]/g, '');
        setPersonCount(onlyNumber);
    };
    const handleOptionChange = (option: string) => {
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option) // 이미 있으면 제거
                : [...prev, option]                      // 없으면 추가
        );
    };

    return (
        <>
            {/* 상품 카드 */}
            <div
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
            >
                <Card.Root
                    style={{
                        width: width,
                        flexShrink: 0,
                        padding: '0',
                        overflow: 'hidden',
                        borderRadius: '20px',
                        border: '1px solid #f0f0f0',
                        boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.1)' : '0 8px 15px rgba(0,0,0,0.04)',
                        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                        backgroundColor: 'white',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            style={{
                                width: '100%',
                                height: '160px',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}
                            src={`http://localhost:4000/${imagePath}`}
                            alt={`${name} product`}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 10px',
                            borderRadius: '30px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#4F46E5',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            Best
                        </div>
                    </div>

                    <Card.Body style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>
                                <Text typography="heading6" style={{ fontWeight: 800, color: '#1a1a1a', display: 'block' }}>{name} 투어</Text>
                                <Text typography="body3" style={{ color: '#666', marginTop: '2px', display: 'block', fontSize: '11px', lineHeight: 1.4 }}>{description || '멋진 추억을 만들어줄 투어.'}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                <div>
                                    <Text typography="heading5" color="primary" style={{ fontWeight: 800, color: '#4F46E5' }}>1,000₩</Text>
                                </div>
                                <Button size="sm" variant="fill" colorPalette="primary" style={{ borderRadius: '10px', padding: '0 12px' }}>
                                    예약
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card.Root>
            </div>

            {/* 상세 모달 (Portal) */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        animation: 'fadeIn 0.3s ease'
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        style={{
                            width: '800px',
                            maxWidth: '95vw',
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            maxHeight: '90vh',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            animation: 'modalOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 이미지 & 상단 버튼 */}
                        <div style={{ position: 'relative', height: '450px', flexShrink: 0 }}>
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                src={`http://localhost:4000/${imagePath}`}
                                alt={`${name} tour`}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '24px',
                                right: '24px',
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '50%',
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        color: '#1a1a1a',
                                        backdropFilter: 'blur(8px)',
                                        transition: 'all 0.2s',
                                        padding: 0
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ width: '20px', height: '20px' }}
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* 모달 콘텐츠 */}
                        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5', background: '#EEF2FF', padding: '4px 12px', borderRadius: '20px' }}>추천 투어</span>
                                    <span style={{ color: '#999', fontSize: '14px' }}>★ 4.9 (120+ 리뷰)</span>
                                </div>
                                <Text typography="heading2" style={{ fontWeight: 800, fontSize: '36px', marginBottom: '12px' }}>{name} 투어 컬렉션</Text>
                                <Text typography="body1" style={{ color: '#666', lineHeight: 1.6 }}>{description || '이 지역에서 가장 사랑받는 투어 상품입니다. 현지 가이드와 함께 특별한 추억을 만들어보세요. 다양한 맛집 탐방과 명소 구경이 포함되어 있습니다.'}</Text>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                                <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: 700 }}>📅 여행 일정</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            style={{
                                                // Vapor UI의 TextInput과 최대한 비슷하게 보이도록 스타일 조정
                                                borderRadius: '12px',
                                                width: '100%',
                                                fontSize: '16px',
                                                padding: '12px',
                                                border: '1px solid #e0e0e0',
                                                backgroundColor: 'white',
                                                outline: 'none',
                                                color: '#1a1a1a',
                                                fontFamily: 'inherit' // 폰트 일관성 유지
                                            }}
                                        />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            style={{
                                                // Vapor UI의 TextInput과 최대한 비슷하게 보이도록 스타일 조정
                                                borderRadius: '12px',
                                                width: '100%',
                                                fontSize: '16px',
                                                padding: '12px',
                                                border: '1px solid #e0e0e0',
                                                backgroundColor: 'white',
                                                outline: 'none',
                                                color: '#1a1a1a',
                                                fontFamily: 'inherit' // 폰트 일관성 유지
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: 700 }}>👥 인원 선택</label>
                                    <TextInput

                                        value={String(personCount)}
                                        min="1"
                                        placeholder="인원 수를 입력하세요"
                                        onChange={handleChange as any}
                                        style={{
                                            borderRadius: '12px',
                                            width: '100%',
                                            fontSize: '16px',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>✨ 포함 사항</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {['현지 가이드 동행', '교통비 포함', '전용 보트 서비스', '중식 및 생수 제공', '입장료 전부 포함', '여행자 보험'].map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#fff', border: '1px solid #f0f0f0', padding: '4px 8px', borderRadius: '8px' }}>
                                            <Checkbox.Root
                                                checked={selectedOptions.includes(opt)}
                                                onCheckedChange={() => handleOptionChange(opt)}
                                                id={`opt-${name}-${i}`}
                                                style={{ width: '22px', height: '22px', borderRadius: '6px' }}
                                            >
                                                <Checkbox.IndicatorPrimitive style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                    color: 'white'
                                                }}>
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        style={{ width: '80%', height: '80%' }}
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </Checkbox.IndicatorPrimitive>
                                            </Checkbox.Root>
                                            <label htmlFor={`opt-${name}-${i}`} style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#444' }}>{opt}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 하단 결제 바 */}
                        <div style={{
                            padding: '32px 40px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid #f0f0f0',
                            background: '#fff',
                            flexShrink: 0
                        }}>
                            <div>
                                <Text typography="body3" style={{ color: '#999', display: 'block' }}>최종 결제 금액</Text>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <Text
                                        typography="heading1"
                                        style={{ color: '#4F46E5', fontWeight: 900, fontSize: '40px' }}
                                    >
                                        1,000
                                    </Text>
                                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#4F46E5' }}>₩</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    const countNum = parseInt(personCount) || 1;
                                    // 1. 투어 상품 추가
                                    updateItemCount(
                                        name,
                                        countNum,
                                        "products",
                                        {
                                            imagePath: `http://localhost:4000/${imagePath}`,
                                            startDate: startDate,
                                            endDate: endDate,
                                            selectedOptions: selectedOptions
                                        },
                                        true
                                    );

                                    // 2. 선택된 '포함 사항'들도 추가 옵션으로 연동 (인원수 동일하게)
                                    selectedOptions.forEach(opt => {
                                        updateItemCount(opt, countNum, "options", { imagePath: "" }, true);
                                    });

                                    setIsOpen(false);

                                    showAlert({
                                        title: '장바구니 담기 완료',
                                        message: `\n[${name}] 상품이 장바구니에 안전하게 담겼습니다.\n지금 확인하시겠습니까?`,
                                        type: 'success',
                                        confirmLabel: '장바구니로 가기',
                                        cancelLabel: '여행상품 계속보기',
                                        onConfirm: () => {
                                            router.push('/payment');
                                        }
                                    });
                                }}
                                style={{
                                    backgroundColor: '#4F46E5',
                                    color: 'white',
                                    padding: '0 40px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '18px',
                                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                장바구니에 담기
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalOpen {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </>
    );
};

export default Products;
