"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Text, Button } from '@vapor-ui/core';
import { showAlert } from '@/components/common/AlertPortal';

interface OrderData {
    orderNo: string;
    productName: string;
    totalAmount: number;
    status: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    personCount: number;
}

export default function OrderResultPage() {
    const router = useRouter();
    const [order, setOrder] = useState<OrderData | null>(null);

    useEffect(() => {
        // sessionStorage에서 데이터 로드
        const data = sessionStorage.getItem('guestOrderResult');
        if (!data) {
            showAlert({
                title: '접근 오류',
                message: '유효하지 않은 접근입니다.\n다시 조회해주세요.',
                type: 'error',
                onConfirm: () => router.push('/orders/guest')
            });
            return;
        }
        setTimeout(() => {
            setOrder(JSON.parse(data));
        }, 0);
    }, [router]);

    if (!order) return <div style={{ minHeight: '80vh' }}></div>;

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            padding: '40px 24px'
        }}>
            <Card.Root style={{
                width: '100%',
                maxWidth: '700px',
                background: 'white',
                borderRadius: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                padding: '56px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                {/* 헤더 */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '32px' }}>
                    <Text typography="heading3" style={{ fontWeight: 800, color: '#4F46E5', marginBottom: '16px', display: 'block' }}>
                        주문 조회 결과
                    </Text>
                    <Text typography="heading1" style={{ fontWeight: 900, color: '#1a1a1a', display: 'block', fontSize: '32px' }}>
                        {order.productName}
                    </Text>
                    <Text typography="body1" style={{ color: '#666', marginTop: '16px', display: 'block', fontSize: '18px' }}>
                        주문번호: <span style={{ fontWeight: 700, color: '#333' }}>{order.orderNo}</span>
                    </Text>
                </div>

                {/* 상세 정보 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <InfoItem label="예약자 이름" value={order.guestName} />
                    <InfoItem label="이메일" value={order.guestEmail} />
                    <InfoItem label="여행 시작일" value={order.startDate} />
                    <InfoItem label="여행 종료일" value={order.endDate} />
                    <InfoItem label="인원 수" value={`${order.personCount}명`} />
                    <InfoItem label="주문 일자" value={new Date(order.createdAt).toLocaleString('ko-KR')} />
                </div>

                {/* 결제 금액 */}
                <div style={{
                    background: '#EEF2FF',
                    padding: '32px',
                    borderRadius: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px'
                }}>
                    <Text typography="heading4" style={{ fontWeight: 700, color: '#333' }}>총 결제 금액</Text>
                    <Text typography="heading2" style={{ fontWeight: 900, color: '#4F46E5' }}>
                        {order.totalAmount.toLocaleString()}원
                    </Text>
                </div>

                {/* 버튼 */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <Button
                        colorPalette="secondary"
                        variant="outline"
                        size="xl"
                        style={{ flex: 1, height: '72px', borderRadius: '20px', fontSize: '20px', fontWeight: 700 }}
                        onClick={() => router.push('/')}
                    >
                        홈으로
                    </Button>
                    <Button
                        colorPalette="primary"
                        size="xl"
                        style={{ flex: 1, height: '72px', borderRadius: '20px', fontSize: '20px', fontWeight: 700 }}
                        onClick={() => router.push('/search')}

                    >
                        다른 상품 보기
                    </Button>
                </div>
            </Card.Root>
        </div>
    );
}

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '20px' }}>
        <Text typography="body2" style={{ color: '#666', marginBottom: '8px', display: 'block', fontSize: '16px' }}>{label}</Text>
        <Text typography="heading5" style={{ color: '#1a1a1a', fontWeight: 700, display: 'block', fontSize: '20px' }}>{value}</Text>
    </div>
);
