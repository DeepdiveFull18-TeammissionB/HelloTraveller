import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Products from '../Products'
import { OrderContextProvider } from '@/context/OrderContext'

import { BASE_URL } from '../../services/apiClient'

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

        expect(screen.getByText('San Francisco 투어')).toBeInTheDocument()
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

        expect(screen.getByText('1,000원')).toBeInTheDocument()
    })

    it('has detail button', () => {
        render(
            <OrderContextProvider>
                <Products {...defaultProps} />
            </OrderContextProvider>
        )

        expect(screen.getByText('상세보기')).toBeInTheDocument()
    })
})
