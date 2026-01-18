'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/services/apiClient';

type ApiError = {
    response?: {
        data?: {
            message?: string;
            resultCode?: string;
        };
        status?: number;
    };
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Backend API Call
            // Response format: { resultCode: "SUCCESS", message: "...", data: { sessionId: "..." } }
            const res = await apiClient.post('/api/v1/Auth/login', {
                email,
                password
            });

            if (res.data.resultCode === 'SUCCESS') {
                alert('로그인되었습니다.');
                // 세션은 쿠키로 자동 설정됨
                router.push('/'); // 메인 페이지로 이동
                router.refresh();
            } else {
                setError(res.data.message || '로그인에 실패했습니다.');
            }
        } catch (err: unknown) {
            console.error(err);
            const error = err as ApiError;
            if (error.response && error.response.data) {
                setError(error.response.data.message || '서버 오류가 발생했습니다.');
            } else {
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSocialLogin = (platform: string) => {
        if (platform === 'Kakao') {
            const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
            const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;

            if (!KAKAO_REST_API_KEY) {
                alert('카카오 API 키가 설정되지 않았습니다. (.env.local 확인)');
                return;
            }

            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
            window.location.href = kakaoAuthUrl;
        } else if (platform === 'Google') {
            const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

            if (!GOOGLE_CLIENT_ID) {
                alert('구글 Client ID가 설정되지 않았습니다. (.env.local 확인)');
                return;
            }

            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile`;
            window.location.href = googleAuthUrl;
        } else {
            alert(`${platform} 로그인은 아직 준비 중입니다.`);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>로그인</h1>

                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={styles.loginButton}>로그인</button>
                </form>

                <div style={styles.socialContainer}>
                    <p style={styles.socialText}>또는 소셜 계정으로 로그인</p>
                    <div style={styles.socialButtons}>
                        <button onClick={() => handleSocialLogin('Kakao')} style={{ ...styles.socialBtn, backgroundColor: '#FEE500', color: '#000' }}>카카오</button>
                        <button onClick={() => handleSocialLogin('Google')} style={{ ...styles.socialBtn, backgroundColor: '#fff', border: '1px solid #ddd' }}>Google</button>
                    </div>
                </div>

                <div style={styles.divider}></div>

                <div style={styles.footer}>
                    <Link href="/signup" style={styles.link}>회원가입</Link>
                    <span style={styles.sep}>|</span>
                    <Link href="/orders/guest" style={styles.link}>비회원 주문조회</Link>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    title: {
        marginBottom: '24px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    input: {
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    loginButton: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '8px',
    },
    socialContainer: {
        marginTop: '24px',
    },
    socialText: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '12px',
    },
    socialButtons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    socialBtn: {
        flex: 1,
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    divider: {
        height: '1px',
        backgroundColor: '#eee',
        margin: '24px 0',
    },
    footer: {
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    link: {
        color: '#333',
        textDecoration: 'underline',
    },
    sep: {
        color: '#ccc',
    },
};
