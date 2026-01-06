"use client";
import React, { ComponentProps } from 'react';
import { Button } from '@vapor-ui/core';

// Vapor UI의 Button은 variant(fill, outline, ghost)와 color(primary, secondary, danger 등)를 사용합니다.
type VButtonProps = ComponentProps<typeof Button>;

const VButton: React.FC<VButtonProps> = ({
    children,
    variant = 'fill',
    color = 'primary',
    ...props
}) => {
    return (
        <Button
            variant={variant as any}
            color={color as any}
            {...props}
        >
            {children}
        </Button>
    );
};

export default VButton;
