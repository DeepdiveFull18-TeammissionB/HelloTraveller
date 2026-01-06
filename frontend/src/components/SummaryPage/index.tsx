"use client";
import React, { useState, FormEvent } from 'react';
import {
    Checkbox,
    Button
} from '@vapor-ui/core';

const SummaryPage: React.FC = () => {
    const [checked, setChecked] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // 주문 확인 로직
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Checkbox.Root
                        checked={checked}
                        id="confirm-checkbox"
                        onCheckedChange={(checked: boolean) => setChecked(checked)}
                    >
                        <Checkbox.IndicatorPrimitive />
                    </Checkbox.Root>
                    <label
                        htmlFor="confirm-checkbox"
                        style={{ cursor: 'pointer', fontSize: '15px' }}
                    >
                        주문하려는 것을 확인하셨나요?
                    </label>
                </div>

                <Button
                    disabled={!checked}
                    type="submit"
                    colorPalette="primary"
                    size="lg"
                    style={{ width: '100%' }}
                >
                    주문 확인
                </Button>
            </div>
        </form>
    );
};

export default SummaryPage;
