"use client";
import React from 'react';
import {
    Checkbox,
    Text,
    Card
} from '@vapor-ui/core';

interface OptionsProps {
    name: string;
    description?: string;
    price?: number;
    checked?: boolean;
    currentCount: number;
    totalPeople: number;
    updateItemCount: (itemName: string, newItemCount: number | string, isReplace?: boolean) => void;
}

/**
 * 여행 부가 옵션 컴포넌트
 * 선택 시 체크박스와 함께 프리미엄한 카드 UI를 제공합니다.
 */
const Options: React.FC<OptionsProps> = ({ name, description, price, checked = false, currentCount, totalPeople, updateItemCount }) => {
    // 옵션별 아이콘 매핑 (이름 기준)
    const getIcon = (optionName: string) => {
        const lowerName = optionName.toLowerCase();
        if (lowerName.includes('insurance')) return '✨';
        if (lowerName.includes('dinner')) return '🍽️';
        if (lowerName.includes('firstclass')) return '✈️';
        return '✨';
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (checked) {
            updateItemCount(name, 0, true);
        } else {
            updateItemCount(name, Math.max(1, totalPeople), true);
        }
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateItemCount(name, 1, false);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentCount > 1) {
            updateItemCount(name, -1, false);
        } else {
            updateItemCount(name, 0, true);
        }
    };

    return (
        <Card.Root
            style={{
                width: '280px', // 크기 축소 (320 -> 280)
                borderRadius: '20px',
                border: checked ? '1.5px solid #4F46E5' : '1px solid #f0f0f0', // 보더 굵기 조절
                padding: '20px', // 패딩 축소
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                background: checked ? '#F8F9FF' : 'white',
                boxShadow: checked ? '0 10px 25px rgba(79, 70, 229, 0.1)' : '0 4px 15px rgba(0,0,0,0.03)',
                transform: checked ? 'translateY(-2px)' : 'none'
            }}
            onClick={handleToggle}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                        fontSize: '28px', // 아이콘 크기 축소
                        background: checked ? '#4F46E5' : '#f8f9ff',
                        width: '48px', // 배경 크기 축소 
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        color: checked ? 'white' : 'inherit',
                        boxShadow: checked ? '0 6px 12px rgba(79, 70, 229, 0.2)' : 'none'
                    }}>
                        {getIcon(name)}
                    </div>
                    <Checkbox.Root
                        id={`${name}-option`}
                        checked={checked}
                        onCheckedChange={() => { }}
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
                </div>

                <div style={{ minHeight: '60px' }}>
                    <Text typography="body1" style={{ fontWeight: 700, display: 'block', marginBottom: '4px', color: checked ? '#1e1b4b' : '#1a1a1a' }}>
                        {name}
                    </Text>
                    <Text typography="body3" style={{ display: 'block', lineHeight: '1.5', color: checked ? '#4338ca' : '#666', fontSize: '12px' }}>
                        {description || '특별한 옵션입니다.'}
                    </Text>
                </div>

                <div style={{
                    marginTop: '4px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <Text typography="body1" style={{ fontWeight: 800, color: '#4F46E5', display: 'block' }}>
                            {((price || 500) * (checked ? currentCount : 1)).toLocaleString()}₩
                        </Text>
                        <Text typography="body3" style={{ fontSize: '10px', color: '#999' }}>
                            {currentCount > 1 && checked ? `${(price || 500).toLocaleString()}₩ × ${currentCount}명` : `인당 ${(price || 500).toLocaleString()}₩`}
                        </Text>
                    </div>

                    {checked && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                border: '1px solid #E0E7FF'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleDecrement}
                                style={{
                                    border: 'none',
                                    background: '#f8f9ff',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // 중앙 정렬 수정
                                    fontSize: '16px',
                                    color: '#4F46E5',
                                    fontWeight: 700,
                                    lineHeight: 1, // 높이 정합성
                                    padding: 0
                                }}
                            >
                                -
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '16px', textAlign: 'center', color: '#1a1a1a' }}>{currentCount}</span>
                            <button
                                onClick={handleIncrement}
                                style={{
                                    border: 'none',
                                    background: '#f8f9ff',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // 중앙 정렬 수정
                                    fontSize: '16px',
                                    color: '#4F46E5',
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    padding: 0
                                }}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Card.Root>
    );
};

export default Options;
