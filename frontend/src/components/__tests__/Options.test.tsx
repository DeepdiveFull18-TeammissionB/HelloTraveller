import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Options from '../Options'

describe('Options Component', () => {
    const mockUpdateItemCount = jest.fn()

    const defaultProps = {
        name: 'Insurance',
        updateItemCount: mockUpdateItemCount,
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
        expect(screen.getByText('(+500원)')).toBeInTheDocument()
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
