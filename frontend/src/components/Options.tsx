"use client";
import React from 'react';
import {
    Checkbox,
    Text
} from '@vapor-ui/core';

interface OptionsProps {
    name: string;
    updateItemCount: (itemName: string, newItemCount: number) => void;
}

const Options: React.FC<OptionsProps> = ({ name, updateItemCount }) => {
    return (
        <div
            style={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#f8f8f8',
                marginBottom: '8px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
            }}
        >
            <Checkbox.Root
                id={`${name} option`}
                onCheckedChange={(checked: boolean) => {
                    updateItemCount(name, checked ? 1 : 0);
                }}
            >
                <Checkbox.IndicatorPrimitive />
            </Checkbox.Root>
            <label htmlFor={`${name} option`} style={{ cursor: 'pointer', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text typography="body2">{name}</Text>
                    <Text typography="body3" color="text-secondary">(+500원)</Text>
                </div>
            </label>
        </div>
    );
};

export default Options;
