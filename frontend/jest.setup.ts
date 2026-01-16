import React from 'react';
import '@testing-library/jest-dom';

// 1. Axios 모의 객체 설정
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() },
        },
    })),
    get: jest.fn(),
    post: jest.fn(),
}));

// 2. Next.js Navigation 모의 객체 설정
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/',
}));

// 3. Swiper 컴포넌트 모의 객체 설정 (타입 명시)
interface MockProps {
    children?: React.ReactNode;
}

jest.mock('swiper/react', () => ({
    Swiper: ({ children }: MockProps) =>
        React.createElement('div', { 'data-testid': 'swiper-mock' }, children),
    SwiperSlide: ({ children }: MockProps) =>
        React.createElement('div', { 'data-testid': 'swiper-slide-mock' }, children),
}));

// 4. Swiper 모듈 모의 객체 설정 (리턴 타입 명시)
jest.mock('swiper/modules', () => ({
    Navigation: (): null => null,
    Pagination: (): null => null,
}));

jest.mock('swiper/css', () => ({}));