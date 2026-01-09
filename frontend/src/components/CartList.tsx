"use client";
import React from 'react';
import { Card, Text } from '@vapor-ui/core';

interface CartItem {
    name: string;
    date: string;
    options: string[];
    count: number;
}

interface CartListProps {
    items: CartItem[];
}

/**
 * 이미지 1의 왼쪽 장바구니 리스트 영역 컴포넌트
 */
const CartList: React.FC<CartListProps> = ({ items }) => {
    return (
        <Card.Root style={cartContainerStyle}>
            <div style={{ marginBottom: '32px' }}>
                <Text typography="heading3" style={{ fontWeight: 800 }}>장바구니</Text>
                <Text typography="body2" color="text-secondary">선택된 상품 목록</Text>
            </div>

            <div style={listWrapperStyle}>
                {items.map((item, idx) => (
                    <div key={idx} style={itemRowStyle}>
                        <div style={itemInfoAreaStyle}>
                            <Text typography="heading5" style={{ fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                                {item.name}
                            </Text>
                            <Text typography="body3" color="text-secondary" style={{ display: 'block', marginBottom: '8px' }}>
                                {item.date}
                            </Text>
                            <div style={optionListStyle}>
                                {item.options.map((opt, i) => (
                                    <Text key={i} typography="body3" style={{ display: 'block', color: '#666' }}>
                                        {opt}
                                    </Text>
                                ))}
                            </div>
                        </div>
                        <div style={itemCountAreaStyle}>
                            <Text typography="heading4" style={{ fontWeight: 700 }}>{item.count}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </Card.Root>
    );
};

const cartContainerStyle: React.CSSProperties = {
    padding: '40px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #eee',
    width: '100%',
    minHeight: '600px'
};

const listWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const itemRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 0',
    borderBottom: '1px solid #f0f0f0'
};

const itemInfoAreaStyle: React.CSSProperties = {
    flex: 1
};

const optionListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
};

const itemCountAreaStyle: React.CSSProperties = {
    width: '60px',
    textAlign: 'right'
};

export default CartList;
