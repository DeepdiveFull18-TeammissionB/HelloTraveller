import { render, screen, fireEvent } from '@testing-library/react';
import VButton from './VButton';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('VButton Component', () => {
    it('renders children correctly', () => {
        render(<VButton>Vapor Button</VButton>);
        expect(screen.getByRole('button')).toHaveTextContent('Vapor Button');
    });

    it('applies variant class correctly', () => {
        render(<VButton variant="danger">Delete</VButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('v-btn-danger');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<VButton onClick={handleClick}>Click Me</VButton>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
