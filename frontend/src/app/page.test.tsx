import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { OrderContextProvider } from '@/context/OrderContext';
import axios from 'axios';

// Axios Mocking
jest.mock('axios');

describe('Home Page', () => {
    it('renders order list and summary content', async () => {
        // 가짜 응답 설정
        (axios.get as jest.Mock).mockResolvedValue({ data: [] });

        render(
            <OrderContextProvider>
                <Home />
            </OrderContextProvider>
        );

        // "여행 상품 리스트" 확인
        expect(screen.getByText('여행 상품 리스트')).toBeInTheDocument();

        // "주문 종류"가 2개 있는지 확인
        const typeTitles = await screen.findAllByText('주문 종류');
        expect(typeTitles).toHaveLength(2);

        // SummaryPage 내용 확인
        expect(screen.getByText('주문하려는 것을 확인하셨나요?')).toBeInTheDocument();
    });
});
