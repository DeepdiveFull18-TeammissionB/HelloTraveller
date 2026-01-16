import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Options from '../domains/shared/Options'

// Mock Swiper components
jest.mock('swiper/react', () => ({
    Swiper: ({ children }: any) => <div data-testid="swiper-mock">{children}</div>,
    SwiperSlide: ({ children }: any) => <div data-testid="swiper-slide-mock">{children}</div>,
}));

jest.mock('swiper', () => ({
    Navigation: () => null,
    Pagination: () => null,
}));

jest.mock('swiper/css', () => ({}));

describe('Options Component', () => {
    const mockUpdateItemCount = jest.fn()

    const defaultProps = {
        name: 'Insurance',
        updateItemCount: mockUpdateItemCount,
        currentCount: 0,
        totalPeople: 1,
    }

    beforeEach(() => {
        mockUpdateItemCount.mockClear()
    })

    it('renders option name', () => {
        render(<Options {...defaultProps} />)
        expect(screen.getByText(/Insurance/)).toBeInTheDocument()
    })

    it('displays price', () => {
        render(<Options {...defaultProps} />)
        // '인당 500₩'과 '500 ₩' 중 하나만 확실히 매칭되도록 getAll 처리하거나 특정 요소를 지칭
        const priceElements = screen.getAllByText(/500.*₩/)
        expect(priceElements.length).toBeGreaterThanOrEqual(1)
        expect(priceElements[0]).toBeInTheDocument()
    })

    it('has checkbox', () => {
        render(<Options {...defaultProps} />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
    })

    it('calls updateItemCount when checkbox is clicked', () => {
        render(<Options {...defaultProps} />)
        const checkbox = screen.getByRole('checkbox')

        fireEvent.click(checkbox)

        expect(mockUpdateItemCount).toHaveBeenCalled()
    })
})
