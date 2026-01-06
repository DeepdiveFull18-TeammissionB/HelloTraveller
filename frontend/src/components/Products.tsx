"use client";
import React, { ChangeEvent, useState } from 'react';
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
    updateItemCount: (itemName: string, newItemCount: string) => void;
}

const Products: React.FC<ProductsProps> = ({ name, imagePath, updateItemCount }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value;
        updateItemCount(name, currentValue);
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
                <Card.Root
                    style={{
                        width: '240px',
                        padding: '0',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        border: '1px solid #f0f0f0'
                    }}
                >
                    <img
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                        src={`http://localhost:4000/${imagePath}`}
                        alt={`${name} product`}
                    />

                    <Card.Body style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Text typography="heading5" style={{ fontWeight: 700 }}>{name} 투어</Text>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text typography="body2" color="primary" style={{ fontWeight: 700 }}>1,000원</Text>
                                <Button size="sm" variant="ghost">상세보기</Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card.Root>
            </div>

            {/* 커스텀 모달 */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        style={{
                            width: '700px',
                            maxWidth: '95vw',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 이미지 */}
                        <div style={{ position: 'relative' }}>
                            <img
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                src={`http://localhost:4000/${imagePath}`}
                                alt={`${name} tour`}
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    fontSize: '24px',
                                    color: '#666',
                                    fontWeight: 'bold',
                                    lineHeight: 1,
                                    padding: 0
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {/* 헤더 */}
                        <div style={{ padding: '1.5rem 2rem' }}>
                            <Text typography="heading3" style={{ fontWeight: 800 }}>{name} 투어</Text>
                        </div>

                        {/* 바디 */}
                        <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>여행 날짜</label>
                                    <div style={{ position: 'relative' }}>
                                        <TextInput
                                            defaultValue="2026.01.07"
                                            readOnly
                                            style={{
                                                borderRadius: '12px',
                                                width: '100%',
                                                fontSize: '16px',
                                                padding: '12px',
                                                paddingRight: '45px'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '20px',
                                            pointerEvents: 'none'
                                        }}>📅</div>
                                    </div>
                                </div>
                                <div style={{ width: '150px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>인원</label>
                                    <TextInput
                                        defaultValue="0"
                                        placeholder="인원 수"
                                        onChange={handleChange as any}
                                        style={{ borderRadius: '12px', width: '100%', fontSize: '16px', padding: '12px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>포함 사항</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {['기본 투어 포함', '가이드 설명 제공', '생수 및 간식 제공'].map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <Checkbox.Root checked={true} id={`opt-${name}-${i}`}>
                                                <Checkbox.IndicatorPrimitive />
                                            </Checkbox.Root>
                                            <label htmlFor={`opt-${name}-${i}`} style={{ fontSize: '15px', cursor: 'pointer' }}>{opt}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 푸터 */}
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
                            <Text
                                typography="heading1"
                                style={{ color: '#ff4d4f', fontWeight: 900, fontSize: '36px' }}
                            >
                                1,000₩
                            </Text>

                            <Button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    backgroundColor: '#1d1d1d',
                                    color: 'white',
                                    padding: '0 2.5rem',
                                    height: '52px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '16px'
                                }}
                            >
                                장바구니
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;
