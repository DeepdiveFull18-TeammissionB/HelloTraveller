"use client";
import React from 'react';
import { Card, Text, Button } from '@vapor-ui/core'; // Assuming these exist based on other files
import Link from 'next/link';

const PaymentSuccess: React.FC = () => {
    return (
        <div style={containerStyle}>
            <Card.Root style={cardStyle}>
                <div style={contentStyle}>
                    <div style={iconWrapperStyle}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#4CAF50"/>
                            <path d="M7 13L10 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <Text typography="heading3" style={{ fontWeight: 800, marginTop: '24px' }}>결제가 완료되었습니다!</Text>
                    <Text typography="body1" color="text-secondary" style={{ marginTop: '12px', textAlign: 'center' }}>
                        주문하신 여행 상품 예약이 확정되었습니다.<br />
                        예약 내역은 마이페이지에서 확인하실 수 있습니다.
                    </Text>

                    <div style={buttonGroupStyle}>
                        <Link href="/" style={{ textDecoration: 'none', width: '100%' }}>
                            <Button size="lg" variant="outline" style={{ width: '100%' }}>
                                홈으로 돌아가기
                            </Button>
                        </Link>
                        <Link href="/orders" style={{ textDecoration: 'none', width: '100%' }}>
                            <Button size="lg" colorPalette="primary" style={{ width: '100%' }}>
                                예약 내역 확인
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card.Root>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '600px',
    width: '100%'
};

const cardStyle: React.CSSProperties = {
    padding: '60px 40px',
    borderRadius: '24px',
    background: '#fff',
    border: '1px solid #eee',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
};

const iconWrapperStyle: React.CSSProperties = {
    marginBottom: '10px'
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginTop: '40px'
};

export default PaymentSuccess;
