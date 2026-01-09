"use client";
import React from 'react';
import {
    Checkbox,
    Text,
    Card
} from '@vapor-ui/core';

interface OptionsProps {
    name: string;
    description?: string; // 추가된 필드
    updateItemCount: (itemName: string, newItemCount: number) => void;
}

/**
 * 여행 부가 옵션 컴포넌트
 * 선택 시 체크박스와 함께 프리미엄한 카드 UI를 제공합니다.
 */
const Options: React.FC<OptionsProps> = ({ name, description, updateItemCount }) => {
    // 옵션별 아이콘 매핑 (이름 기준)
    const getIcon = (optionName: string) => {
        switch (optionName.toLowerCase()) {
            case 'insurance': return '🛡️';
            case 'dinner': return '🍽️';
            case 'firstclass': return '✈️';
            default: return '✨';
        }
    };

    return (
        <Card.Root
            style={{
                width: '300px',
                borderRadius: '20px',
                border: '1px solid #eee',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                        fontSize: '40px',
                        background: '#f8f9ff',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px'
                    }}>
                        {getIcon(name)}
                    </div>
                    <Checkbox.Root
                        id={`${name}-option`}
                        onCheckedChange={(checked: boolean) => {
                            updateItemCount(name, checked ? 1 : 0);
                        }}
                        style={{ width: '24px', height: '24px' }}
                    >
                        <Checkbox.IndicatorPrimitive />
                    </Checkbox.Root>
                </div>

                <div>
                    <label htmlFor={`${name}-option`} style={{ cursor: 'pointer' }}>
                        <Text typography="heading5" style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                            {name}
                        </Text>
                        <Text typography="body3" color="text-secondary" style={{ display: 'block', lineHeight: '1.5', minHeight: '40px' }}>
                            {description || '더욱 특별한 여행을 위한 추가 옵션입니다.'}
                        </Text>
                    </label>
                </div>

                <div style={{
                    marginTop: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text typography="body2" style={{ fontWeight: 600, color: '#4F46E5' }}>
                        +500원
                    </Text>
                    <Text typography="body3" style={{ fontSize: '11px', color: '#999' }}>
                        Per Person
                    </Text>
                </div>
            </div>
        </Card.Root>
    );
};

export default Options;
