"use client";
import React, { ChangeEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Card,
    Text,
    Button,
    TextInput,
    Checkbox
} from '@vapor-ui/core';

interface ProductsProps {
    name: string;
    imagePath: string;
    description?: string;
    updateItemCount: (itemName: string, newItemCount: string) => void;
    width?: string;
}

/**
 * 여행 상품 컴포넌트
 * 이미지 기반의 카드 타입 UI와 상세 정보를 볼 수 있는 프리미엄 모달을 제공합니다.
 */
const Products: React.FC<ProductsProps> = ({ name, imagePath, description, updateItemCount, width = '280px' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value;
        updateItemCount(name, currentValue);
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
                        borderRadius: '24px',
                        border: '1px solid #f0f0f0',
                        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.12)' : '0 10px 20px rgba(0,0,0,0.05)',
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        backgroundColor: 'white',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}
                            src={`http://localhost:4000/${imagePath}`}
                            alt={`${name} product`}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            padding: '6px 12px',
                            borderRadius: '30px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#4F46E5',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            Best Choice
                        </div>
                    </div>

                    <Card.Body style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <Text typography="heading5" style={{ fontWeight: 800, color: '#1a1a1a', display: 'block' }}>{name} 투어</Text>
                                <Text typography="body3" style={{ color: '#666', marginTop: '4px', display: 'block' }}>{description || '멋진 추억을 만들어줄 여행 상품입니다.'}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div>
                                    <Text typography="body3" style={{ color: '#999', fontSize: '11px', textDecoration: 'line-through', display: 'block' }}>1,500원</Text>
                                    <Text typography="heading4" color="primary" style={{ fontWeight: 800, color: '#4F46E5' }}>1,000₩</Text>
                                </div>
                                <Button size="md" variant="fill" colorPalette="primary" style={{ borderRadius: '12px', padding: '0 16px' }}>
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
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        fontSize: '28px',
                                        color: '#1a1a1a',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    ×
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
                                    <TextInput
                                        defaultValue="2026.01.10"
                                        readOnly
                                        style={{
                                            borderRadius: '12px',
                                            width: '100%',
                                            fontSize: '16px',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0'
                                        }}
                                    />
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: 700 }}>👥 인원 선택</label>
                                    <TextInput
                                        defaultValue="0"
                                        min="0"
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
                                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #f0f0f0', padding: '12px 16px', borderRadius: '12px' }}>
                                            <Checkbox.Root checked={true} id={`opt-${name}-${i}`} style={{ width: '20px', height: '20px' }}>
                                                <Checkbox.IndicatorPrimitive />
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
                                onClick={() => setIsOpen(false)}
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
