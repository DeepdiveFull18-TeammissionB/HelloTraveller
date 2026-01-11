"use client";
import React from 'react';
import { Card, Text } from '@vapor-ui/core';

interface CartItem {
    name: string;
    imagePath?: string;
    startDate?: string;
    endDate?: string;
    count: number;
    selectedOptions?: string[];
    onCountChange?: (name: string, count: number) => void;
}
interface CartListProps {
    items: CartItem[];
    style?: React.CSSProperties;
    onItemClick?: (item: any) => void;
    selectedItemName?: string;
    onCountChange?: (name: string, count: number) => void;
}

/**
 * 이미지 1의 왼쪽 장바구니 리스트 영역 컴포넌트
 */
const CartList: React.FC<CartListProps> = ({ 
    items, 
    style, 
    onItemClick, 
    selectedItemName,
    onCountChange 
}) => {
    return (
        <Card.Root style={{ ...cartContainerStyle, ...style }}>
            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Text typography="heading3" style={{ fontWeight: 800 }}>장바구니</Text>
                <Text typography="body2" color="text-secondary">선택된 상품 목록</Text>
            </div>

            <div style={headerRowStyle}>
                <Text typography="body3" style={{ flex: 2, fontWeight: 700 }}>투어 정보</Text>
                <Text typography="body3" style={{ flex: 1, fontWeight: 700, textAlign: 'center' }}>선택 옵션</Text>
                <Text typography="body3" style={{ flex: 1, fontWeight: 700, textAlign: 'right' }}>인원수</Text>
            </div>

            <div style={listWrapperStyle}>
                {items.map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => onItemClick && onItemClick(item)}
                        style={{
                            ...itemRowStyle,
                            backgroundColor: selectedItemName === item.name ? '#f0f4ff' : 'transparent',
                            cursor: 'pointer',
                            padding: '20px',
                            borderRadius: '12px',
                            border: selectedItemName === item.name ? '1px solid #4F46E5' : '1px solid transparent'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '16px', flex: 2, alignItems: 'center' }}>
                                {item.imagePath && (
                                    <img 
                                        src={item.imagePath} 
                                        alt={item.name}
                                        style={imageStyle}
                                    />
                                )}
                                <div style={itemInfoAreaStyle}>
                                    <Text typography="heading5" style={{ fontWeight: 700, marginBottom: '2px', display: 'block' }}>
                                        {item.name}
                                    </Text>
                                    <Text typography="body3" color="text-secondary">
                                        📅 {item.startDate} ~ {item.endDate}
                                    </Text>
                                </div>
                            </div>  
                        <div style={{ flex: 1, padding: '0 10px' }}>
                                {item.selectedOptions && item.selectedOptions.length > 0 ? (
                                    <div style={optionListStyle}>
                                        {item.selectedOptions.map((opt, i) => (
                                            <Text key={i} typography="body3" color="text-secondary" style={{ fontSize: '12px' }}>
                                                • {opt}
                                            </Text>
                                        ))}
                                    </div>
                                ) : (
                                    <Text typography="body3" color="text-tertiary" style={{ textAlign: 'center', display: 'block' }}>-</Text>
                                )}
                            </div>

                            {/* 3. 인원수 Input 영역 */}
                            <div style={itemCountAreaStyle} onClick={(e) => e.stopPropagation()}>
                                <input 
                                    type="number"
                                    min="1"
                                    value={item.count}
                                    onChange={(e) => onCountChange && onCountChange(item.name, parseInt(e.target.value) || 1)}
                                    style={quantityInputStyle}
                                />
                                <Text typography="body3" style={{ marginLeft: '4px' }}>명</Text>
                            </div>
                    </div>
                ))}
            </div>
        </Card.Root>
    );
};

const cartContainerStyle: React.CSSProperties = {
    padding: '32px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #eee',
    width: '100%',
    minHeight: '600px'
};

const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0 20px 12px 20px',
    borderBottom: '2px solid #f0f0f0',
    marginBottom: '16px'
};

const imageStyle: React.CSSProperties = {
    width: '70px',
    height: '70px',
    borderRadius: '10px',
    objectFit: 'cover',
    backgroundColor: '#f5f5f5'
};

const listWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const itemRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    transition: 'all 0.2s ease'
};

const itemInfoAreaStyle: React.CSSProperties = {
    flex: 1
};

const optionListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
};

const itemCountAreaStyle: React.CSSProperties = {
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
};

const quantityInputStyle: React.CSSProperties = {
    width: '50px',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600
};

export default CartList;
