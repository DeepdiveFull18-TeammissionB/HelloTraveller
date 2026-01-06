"use client";
import React from 'react';
import { Checkbox } from '@vapor-ui/core';

// Vapor UI의 Checkbox는 Checkbox.Root와 Checkbox.IndicatorPrimitive의 조합으로 구성됩니다.
const VCheckbox: React.FC<any> = (props) => {
    return (
        <Checkbox.Root {...props}>
            <Checkbox.IndicatorPrimitive />
        </Checkbox.Root>
    );
};

export default VCheckbox;
