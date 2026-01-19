'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/services/apiClient';



function KakaoCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [status, setStatus] = useState('카카오 로그인 중...');

    useEffect(() => {
        if (!code) {
            setStatus('인증 코드가 없습니다.');
            return;
        }

        const loginWithKakao = async () => {
            try {
                // Backend에 code와 현재 사용된 redirectUri 전달
                const redirectUri = `${window.location.origin}/auth/kakao/callback`;
                const res = await apiClient.post('/api/v1/auth/kakao', {
                    code,
                    redirectUri
                });

                if (res.data.resultCode === 'SUCCESS') {
                    // 로그인 성공 정보 저장
                    const { email, name, grade } = res.data.data; // 백엔드 응답 구조 확인됨
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('grade', grade);
                    sessionStorage.setItem('isLoggedIn', 'true');

                    // 메인으로 이동
                    router.push('/');
                    router.refresh(); // 헤더 업데이트를 위해 리프레시
                } else {
                    setStatus('로그인 실패: ' + res.data.message);
                }
            } catch (err: unknown) {
                console.error(err);
                setStatus('로그인 처리 중 오류 발생');
            }
        };

        loginWithKakao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <h2>{status}</h2>
            <div style={{ marginTop: '20px' }}>잠시만 기다려주세요...</div>
        </div>
    );
}

export default function KakaoCallbackPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <KakaoCallbackContent />
        </React.Suspense>
    );
}
