"use client";
import React from 'react';
import { Button, Text, Card } from '@vapor-ui/core';

interface OrderTicket {
    orderNumber: string;
    amount: number;
}

interface OrderCompleteProps {
    dDay?: number;
    tickets: OrderTicket[];
    onViewOrders?: () => void;
}

/**
 * 이미지 2의 주문 완료 섹션 컴포넌트
 */
const OrderComplete: React.FC<OrderCompleteProps> = ({
    dDay = 1,
    tickets = [],
    onViewOrders
}) => {
    return (
        <div style={containerStyle}>
            {/* 상단 메시지 */}
            <header style={headerStyle}>
                <Text typography="heading2" style={{ fontWeight: 800, marginBottom: '16px', display: 'block' }}>
                    주문이 완료되었습니다!
                </Text>
                <Text typography="body1" color="text-secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    여행 시작까지
                </Text>
                <div style={dDayAreaStyle}>
                    <Text typography="heading1" style={dDayTextStyle}>D - {dDay}</Text>
                </div>
                <Text typography="body1" color="text-secondary" style={{ display: 'block', marginTop: '16px' }}>
                    즐거운 여행 되세요!
                </Text>
            </header>

            <div style={dividerStyle} />

            {/* 주문 티켓 리스트 */}
            <div style={ticketListStyle}>
                {tickets.map((ticket, idx) => (
                    <Card.Root key={idx} style={ticketCardStyle}>
                        <Text typography="body2" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                            주문번호: {ticket.orderNumber}
                        </Text>
                        <Text typography="body1" style={{ fontWeight: 700 }}>
                            결제 금액: {(ticket.amount || 0).toLocaleString()}₩
                        </Text>
                    </Card.Root>
                ))}
            </div>

            {/* 내 예약 보기 버튼 */}
            <div style={footerStyle}>
                <Button
                    onClick={onViewOrders}
                    style={backButtonStyle}
                >
                    내 예약 보기
                </Button>
            </div>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    padding: '60px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    background: '#fff'
};

const headerStyle: React.CSSProperties = {
    marginBottom: '40px'
};

const dDayAreaStyle: React.CSSProperties = {
    marginTop: '10px'
};

const dDayTextStyle: React.CSSProperties = {
    fontSize: '72px',
    fontWeight: 900,
    color: '#FF6F61', // 이미지의 코랄/레드톤 반영
    letterSpacing: '-2px'
};

const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: '#eee',
    margin: '40px 0'
};

const ticketListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '40px'
};

const ticketCardStyle: React.CSSProperties = {
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    background: '#fff',
    textAlign: 'center'
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center'
};

const backButtonStyle: React.CSSProperties = {
    background: '#1a1a1a',
    color: '#fff',
    padding: '0 40px',
    height: '52px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '16px'
};

export default OrderComplete;
