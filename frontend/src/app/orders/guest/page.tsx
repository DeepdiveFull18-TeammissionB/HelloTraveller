"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Button, TextInput, Card } from '@vapor-ui/core';
import { showAlert } from '@/components/common/AlertPortal';
import apiClient from '@/services/apiClient';

type ApiError = {
    response?: {
        data?: {
            message?: string;
        };
    };
};

export default function GuestOrderLookupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');

    const handleLookup = async () => {
        // 1. 유효성 검사
        if (!name.trim()) {
            showAlert({ title: '입력 확인', message: '예약자 이름을 입력해주세요.', type: 'warning' });
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            showAlert({ title: '입력 확인', message: '올바른 이메일 주소를 입력해주세요.', type: 'warning' });
            return;
        }
        if (!orderId.trim()) {
            showAlert({ title: '입력 확인', message: '주문 번호를 입력해주세요.', type: 'warning' });
            return;
        }

        // 2. 백엔드 조회 요청
        try {
            const res = await apiClient.post('/api/v1/orders/guest', {
                name,
                email,
                orderNo: orderId // Backend expects 'orderNo'
            });

            if (res.data.resultCode === 'SUCCESS') {
                // 성공 시 결과 페이지로 데이터 전달 (SessionStorage 사용)
                sessionStorage.setItem('guestOrderResult', JSON.stringify(res.data.data));
                router.push('/orders/result');
            } else {
                showAlert({ title: '조회 실패', message: res.data.message || '일치하는 주문을 찾을 수 없습니다.', type: 'error' });
            }
        } catch (error: unknown) {
            console.error('Order Lookup Error:', error);
            const err = error as ApiError;
            const errorMsg = err.response?.data?.message || '주문 조회 중 오류가 발생했습니다.';
            showAlert({ title: '조회 실패', message: errorMsg, type: 'error' });
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            padding: '24px'
        }}>
            <Card.Root style={{
                width: '100%',
                maxWidth: '640px',
                background: 'white',
                borderRadius: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                padding: '56px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                {/* 헤더 영역 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    gap: '16px'
                }}>
                    <Text typography="heading1" style={{ fontWeight: 800, color: '#1a1a1a', display: 'block' }}>
                        비회원 주문 조회
                    </Text>
                    <Text typography="body1" style={{ color: '#666', display: 'block', fontSize: '18px' }}>
                        예약 시 입력한 정보를 입력해주세요.
                    </Text>
                </div>

                {/* 입력 폼 영역 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '20px', fontWeight: 700, color: '#333' }}>
                            이름 (Name)
                        </label>
                        <TextInput
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예약자 성함을 입력해주세요"
                            style={{ width: '100%', height: '64px', borderRadius: '16px', paddingLeft: '20px', fontSize: '18px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '20px', fontWeight: 700, color: '#333' }}>
                            이메일 (Email)
                        </label>
                        <TextInput
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@travel.com"
                            style={{ width: '100%', height: '64px', borderRadius: '16px', paddingLeft: '20px', fontSize: '18px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '20px', fontWeight: 700, color: '#333' }}>
                            주문 번호 (Order ID)
                        </label>
                        <TextInput
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="주문 번호를 입력해주세요"
                            style={{ width: '100%', height: '64px', borderRadius: '16px', paddingLeft: '20px', fontSize: '18px' }}
                        />
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div style={{ marginTop: '24px' }}>
                    <Button
                        colorPalette="primary"
                        size="xl"
                        style={{ width: '100%', height: '72px', borderRadius: '20px', fontSize: '22px', fontWeight: 800 }}
                        onClick={handleLookup}
                    >
                        주문 내역 조회하기
                    </Button>
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Text typography="body2" style={{ color: '#999', cursor: 'pointer', fontSize: '16px' }} onClick={() => router.push('/login')}>
                            로그인하고 조회하기 &rarr;
                        </Text>
                    </div>
                </div>
            </Card.Root>
        </div>
    );
}
