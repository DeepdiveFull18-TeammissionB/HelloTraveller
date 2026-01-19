'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/services/apiClient';

type ApiError = {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
};

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [status, setStatus] = useState(code ? '구글 로그인 중...' : '인증 코드가 없습니다.');

    useEffect(() => {
        if (!code) return;

        const loginWithGoogle = async () => {
            try {
                const redirectUri = `${window.location.origin}/auth/google/callback`;
                const res = await apiClient.post('/api/v1/auth/google', {
                    code,
                    redirectUri
                });

                if (res.data.resultCode === 'SUCCESS') {
                    // 로그인 성공 정보 저장
                    const { email, name, grade } = res.data.data;
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('grade', grade);
                    sessionStorage.setItem('isLoggedIn', 'true');

                    router.push('/');
                    router.refresh();
                } else {
                    setStatus('로그인 실패: ' + res.data.message);
                }
            } catch (err: unknown) {
                console.error(err);
                let errorMessage = '로그인 처리 중 오류 발생';
                if (err && typeof err === 'object') {
                    const apiError = err as ApiError;
                    if (apiError.response?.data?.message) {
                        errorMessage = `로그인 처리 중 오류 발생: ${apiError.response.data.message}`;
                    } else if (apiError.message) {
                        errorMessage = `로그인 처리 중 오류 발생: ${apiError.message}`;
                    }
                }
                setStatus(errorMessage);
            }
        };

        loginWithGoogle();
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

export default function GoogleCallbackPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <GoogleCallbackContent />
        </React.Suspense>
    );
}
