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

        // Hero 섹션 확인
        expect(screen.getByText('즉흥 여행의 시작!')).toBeInTheDocument();

        // 섹션 제목들 확인
        expect(screen.getByText('추천 투어 상품')).toBeInTheDocument();
        expect(screen.getByText('예약하기')).toBeInTheDocument();
        expect(screen.getByText('고객 리뷰')).toBeInTheDocument();

        // CTA 버튼 확인
        expect(screen.getByText('여행 상품 탐색하기')).toBeInTheDocument();
    });
});
