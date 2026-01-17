import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Products from '../domains/shared/Products'
import { OrderContextProvider } from '@/context/OrderContext'

import { BASE_URL } from '../../services/apiClient'

jest.mock('swiper/modules', () => ({
    Navigation: () => null,
    Pagination: () => null,
}));

jest.mock('swiper/css', () => ({}));

describe('Products Component', () => {
    const mockUpdateItemCount = jest.fn()

    const defaultProps = {
        name: 'San Francisco',
        imagePath: 'images/san-francisco.jpeg',
        updateItemCount: mockUpdateItemCount,
    }

    it('renders product card with name', () => {
        render(
            <OrderContextProvider>
                <Products {...defaultProps} />
            </OrderContextProvider>
        )

        expect(screen.getByText('San Francisco')).toBeInTheDocument()
    })

    it('renders product image', () => {
        render(
            <OrderContextProvider>
                <Products {...defaultProps} />
            </OrderContextProvider>
        )

        const image = screen.getByAltText('San Francisco product')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', `${BASE_URL}/images/san-francisco.jpeg`)
    })

    it('displays price', () => {
        render(
            <OrderContextProvider>
                <Products {...defaultProps} />
            </OrderContextProvider>
        )

        expect(screen.getByText(/1,000.*원/)).toBeInTheDocument()
    })
    it('has reserve button', () => {
        render(
            <OrderContextProvider>
                <Products {...defaultProps} />
            </OrderContextProvider>
        )

        expect(screen.getByText('예약')).toBeInTheDocument()
    })
});
