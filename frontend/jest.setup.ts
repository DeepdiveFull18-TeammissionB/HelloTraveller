import React from 'react';
import '@testing-library/jest-dom'

jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: {} })),
        post: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        }
    })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} }))
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/',
}));
jest.mock('swiper/react', () => ({
    Swiper: ({ children }: any) => React.createElement('div', { 'data-testid': 'swiper-mock' }, children),
    SwiperSlide: ({ children }: any) => React.createElement('div', { 'data-testid': 'swiper-slide-mock' }, children),
}));

jest.mock('swiper/modules', () => ({
    Navigation: () => null,
    Pagination: () => null,
}));

jest.mock('swiper/css', () => ({}));
