"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Text, Button } from '@vapor-ui/core';

interface CustomerInfoModalProps {
    isOpen: boolean;
    initialData: { name: string; email: string; phone?: string };
    onSave: (data: { name: string; email: string; phone: string }) => void;
    onClose: () => void;
}

const CustomerInfoModal: React.FC<CustomerInfoModalProps> = ({ isOpen, initialData, onSave, onClose }) => {
    const [name, setName] = useState(initialData.name);
    const [email, setEmail] = useState(initialData.email);

    useEffect(() => {
        const timer = setTimeout(() => {
            setName(initialData.name);
            setEmail(initialData.email);
        }, 0);
        return () => clearTimeout(timer);
    }, [initialData, isOpen]);

    if (!isOpen || typeof document === 'undefined') return null;

    const handleSave = () => {
        onSave({ name, email, phone: initialData.phone || '' });
    };

    return createPortal(
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ textAlign: 'left', width: '100%', marginBottom: '24px' }}>
                    <Text typography="heading4" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>예약자 정보 입력</Text>
                    <Text typography="body2" style={{ color: '#666', display: 'block' }}>주문을 완료하기 위해 성함과 이메일을 입력해 주세요.</Text>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>이름 (Name)</label>
                    <input
                        style={inputStyle}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 홍길동 또는 Gildong Hong"
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>이메일 (Email)</label>
                    <input
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@travel.com"
                    />
                </div>

                <div style={footerStyle}>
                    <Button variant="outline" colorPalette="secondary" onClick={onClose} style={buttonStyle}>취소</Button>
                    <Button colorPalette="primary" onClick={handleSave} style={buttonStyle}>저장 및 계속</Button>
                </div>
            </div>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11000,
};

const modalStyle: React.CSSProperties = {
    width: '450px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
};

const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    width: '100%',
};

const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
    textAlign: 'left',
};

const inputStyle: React.CSSProperties = {
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
};

const buttonStyle: React.CSSProperties = {
    flex: 1,
    height: '50px',
    borderRadius: '12px',
    fontWeight: 700,
};

export default CustomerInfoModal;
