"use client";
import React, { ComponentProps } from 'react';
import { TextInput } from '@vapor-ui/core';

// Vapor UI의 TextInput의 기존 type 타입을 제외하고 string으로 확장합니다.
interface VInputProps extends Omit<ComponentProps<typeof TextInput>, 'type'> {
    type?: string;
}

const VInput: React.FC<VInputProps> = (props) => {
    return <TextInput {...(props as any)} />;
};

export default VInput;
