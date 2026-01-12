"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Text, Button } from '@vapor-ui/core';

interface AlertOptions {
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

let showGlobalAlert: (options: AlertOptions) => void = () => { };

export const showAlert = (options: AlertOptions) => {
    showGlobalAlert(options);
};

export const AlertPortal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AlertOptions | null>(null);

    useEffect(() => {
        showGlobalAlert = (opt: AlertOptions) => {
            setOptions(opt);
            setIsOpen(true);
        };
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (options?.onConfirm) {
            options.onConfirm();
        }
    }, [options]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (options?.onCancel) {
            options.onCancel();
        }
    }, [options]);

    if (!isOpen || !options || typeof document === 'undefined') return null;

    const getIcon = () => {
        switch (options.type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '🚫';
            default: return '🔔';
        }
    };

    const hasCancel = !!options.cancelLabel;

    return createPortal(
        <div style={overlayStyle} onClick={() => setIsOpen(false)}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={iconAreaStyle}>{getIcon()}</div>
                <div style={contentAreaStyle}>
                    <Text typography="heading4" style={{ fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>
                        {options.title}
                    </Text>
                    <Text typography="body1" style={{ color: '#666', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {options.message}
                    </Text>
                </div>
                <div style={{ ...footerStyle, display: 'flex', gap: '12px' }}>
                    {hasCancel && (
                        <Button
                            variant="outline"
                            colorPalette="secondary"
                            style={{ ...buttonStyle, boxShadow: 'none' }}
                            onClick={handleCancel}
                        >
                            {options.cancelLabel}
                        </Button>
                    )}
                    <Button
                        colorPalette="primary"
                        style={buttonStyle}
                        onClick={handleConfirm}
                    >
                        {options.confirmLabel || '확인'}
                    </Button>
                </div>
            </div>
            <style jsx>{`
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.85); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.2s ease'
};

const modalStyle: React.CSSProperties = {
    width: '500px',
    maxWidth: '90vw',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '28px',
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
};

const iconAreaStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '20px'
};

const contentAreaStyle: React.CSSProperties = {
    marginBottom: '32px'
};

const footerStyle: React.CSSProperties = {
    width: '100%'
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '16px',
    boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
};
