import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, Mock } from 'vitest';
import { OrderContextProvider } from './context/OrderContext';
import axios from 'axios';

// Axios Mocking
vi.mock('axios');

describe('App', () => {
    it('renders App component and checks for OrderPage content', async () => {
        // 가짜 응답 설정 (빈 배열)
        (axios.get as Mock).mockResolvedValue({ data: [] });

        render(
            <OrderContextProvider>
                <App />
            </OrderContextProvider>
        );

        // "여행 상품 리스트" 확인
        expect(screen.getByText('여행 상품 리스트')).toBeInTheDocument();

        // "주문 종류"가 2개 있는지 확인
        const typeTitles = await screen.findAllByText('주문 종류');
        expect(typeTitles).toHaveLength(2);
    });
});
