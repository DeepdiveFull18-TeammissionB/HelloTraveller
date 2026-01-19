'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function SignUpPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // Backend API Call
            // POST /api/v1/members/signup
            const res = await apiClient.post('/api/v1/members/signup', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone
            });

            if (res.data.resultCode === 'SUCCESS') {
                alert('회원가입이 완료되었습니다! 로그인해주세요.');
                router.push('/login');
            } else {
                setError(res.data.message || '회원가입에 실패했습니다.');
            }
        } catch (err: unknown) {
            console.error(err);
            const error = err as ApiError;
            if (error.response && error.response.data) {
                setError(error.response.data.message || '서버 오류가 발생했습니다.');
            } else {
                setError('요청 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>회원가입</h1>

                <form onSubmit={handleSignUp} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="사용자 이름"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="8자 이상, 영문/숫자/특수문자 포함"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="비밀번호 재입력"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="010-0000-0000"
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={styles.submitButton}>가입하기</button>
                    <button type="button" onClick={() => router.back()} style={styles.cancelButton}>취소</button>
                </form>
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
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    title: {
        marginBottom: '24px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    submitButton: {
        padding: '14px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    cancelButton: {
        padding: '14px',
        backgroundColor: '#f8f9fa',
        color: '#333',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        textAlign: 'center',
    }
};
