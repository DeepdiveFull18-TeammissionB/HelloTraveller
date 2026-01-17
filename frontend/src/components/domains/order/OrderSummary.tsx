"use client";
import React from 'react';
import { Card, Text, Checkbox, Button } from '@vapor-ui/core';
import { showAlert } from '../../common/AlertPortal';
import OrderContext from '../../../context/OrderContext';
import CustomerInfoModal from './CustomerInfoModal';

interface OrderSummaryProps {
    guestCount?: number;
    productAmount?: number;
    optionAmount?: number;
    totalAmount?: number;
    onOrderConfirm?: () => void; // 주문 확인 절차 완료 콜백
}

/**
 * 이미지 0, 1의 우측 요약 영역 컴포넌트
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
    guestCount = 0,
    productAmount = 0,
    optionAmount = 0,
    totalAmount = 0,
    onOrderConfirm
}) => {
    const context = React.useContext(OrderContext);
    const fallbackData = {
        products: new Map(),
        options: new Map(),
        totals: { products: 0, options: 0, total: 0, totalCount: 0 },
        productItems: [],
        optionItems: [],
        customerInfo: { name: '', email: '', phone: '' }
    };
    const [orderData, , , , updateCustomerInfo] = context || [fallbackData, () => { }, () => { }, () => { }, () => { }];

    const [isChecked, setIsChecked] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const validateCustomerInfo = (info: { name: string; email: string }) => {
        if (!info || !info.name || !info.email) return false;
        if (!info.name.trim()) return false;
        if (!info.email.trim()) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(info.email)) return false;

        const nameRegex = /^[가-힣]{2,10}$|^[a-zA-Z\s]{2,30}$/;
        if (!nameRegex.test(info.name)) return false;

        return true;
    };

    const handleOrderClick = () => {
        if (!isChecked) {
            showAlert({
                title: '확인 필요',
                message: '\n주문 내용을 확인하셨나요?\n체크박스를 선택해 주세요.',
                type: 'warning'
            });
            return;
        }

        // 고객 정보 확인
        const currentInfo = orderData?.customerInfo || { name: '', email: '' };
        if (!validateCustomerInfo(currentInfo)) {
            setIsModalOpen(true);
            return;
        }

        // 1. 사용자에게 상단 버튼을 누르라고 안내
        showAlert({
            title: '준비 완료',
            message: '\n주문 확인이 완료되었습니다!\n이제 상단의 [결제 진행] 버튼을 눌러주세요.',
            type: 'success'
        });

        // 2. 부모에게 주문 확인됨을 알림
        if (onOrderConfirm) onOrderConfirm();
    };

    const handleModalSave = (newInfo: { name: string; email: string; phone: string }) => {
        if (!newInfo.name.trim() || !newInfo.email.trim()) {
            showAlert({ title: '입력 확인', message: '이름과 이메일을 모두 입력해 주세요.', type: 'warning' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newInfo.email)) {
            showAlert({ title: '이메일 형식', message: '올바른 이메일 형식이 아닙니다.', type: 'error' });
            return;
        }

        const nameRegex = /^[가-힣]{2,10}$|^[a-zA-Z\s]{2,30}$/;
        if (!nameRegex.test(newInfo.name)) {
            showAlert({ title: '이름 형식', message: '한글 2~10자 또는 영문 2~30자로 입력해 주세요.', type: 'error' });
            return;
        }

        if (updateCustomerInfo) updateCustomerInfo(newInfo);
        setIsModalOpen(false);

        // 정보 채워졌으니 바로 완료 처리
        showAlert({
            title: '정보 저장 완료',
            message: '\n예약자 정보가 저장되었습니다.\n이제 상단의 [결제 진행] 버튼을 눌러주세요.',
            type: 'success'
        });
        if (onOrderConfirm) onOrderConfirm();
    };

    return (
        <>
            <Card.Root style={summaryCardStyle}>
                <div style={contentWrapperStyle}>
                    {/* 상단 가격 상세 (이미지 1 구성) */}
                    <div style={detailRowStyle}>
                        <Text typography="body1">인원 수</Text>
                        <Text typography="body1" style={{ fontWeight: 600 }}>{guestCount}명</Text>
                    </div>
                    <div style={detailRowStyle}>
                        <Text typography="body1">상품금액</Text>
                        <Text typography="body1" style={{ fontWeight: 600 }}>{productAmount.toLocaleString()}₩</Text>
                    </div>
                    <div style={detailRowStyle}>
                        <Text typography="body1">옵션금액</Text>
                        <Text typography="body1" style={{ fontWeight: 600 }}>{optionAmount.toLocaleString()}₩</Text>
                    </div>

                    <div style={dividerStyle} />

                    {/* 총 합계 (이미지 0 & 1 구성) */}
                    <div style={totalLabelRowStyle}>
                        <Text typography="heading5" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>총 합계:</Text>
                        <div style={totalValueAreaStyle}>
                            <Text typography="heading1" style={totalValueTextStyle}>
                                {totalAmount.toLocaleString()}
                            </Text>
                            <span style={wonSymbolStyle}>₩</span>
                        </div>
                    </div>

                    {/* 확인 체크박스 (이미지 0 & 1 구성) */}
                    <div style={checkboxWrapperStyle}>
                        <Checkbox.Root
                            id="confirm-order"
                            style={{ width: '20px', height: '20px' }}
                            checked={isChecked}
                            onCheckedChange={(checked) => setIsChecked(!!checked)}
                        >
                            <Checkbox.IndicatorPrimitive />
                        </Checkbox.Root>
                        <label htmlFor="confirm-order" style={checkboxLabelStyle}>
                            주문을 확인하셨나요?
                        </label>
                    </div>

                    {/* 주문하기 버튼 */}
                    <Button
                        colorPalette="primary"
                        style={orderButtonStyle}
                        onClick={handleOrderClick}
                    >
                        주문하기
                    </Button>
                </div>
            </Card.Root>

            <CustomerInfoModal
                isOpen={isModalOpen}
                initialData={orderData?.customerInfo || { name: '', email: '' }}
                onSave={handleModalSave}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

const summaryCardStyle: React.CSSProperties = {
    padding: '32px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #eee',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '100%'
};

const contentWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#666'
};

const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: '#eee',
    margin: '10px 0'
};

const totalLabelRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
};

const totalValueAreaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
};

const totalValueTextStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 900,
    color: '#FF6F61' // 이미지의 코랄/레드톤 반영
};

const wonSymbolStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#FF6F61'
};

const checkboxWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px'
};

const checkboxLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333',
    fontWeight: 600,
    cursor: 'pointer'
};

const orderButtonStyle: React.CSSProperties = {
    width: '100%',
    height: '56px',
    fontSize: '18px',
    fontWeight: 700,
    borderRadius: '12px',
    background: '#1a1a1a', // 이미지의 다크그레이 버튼 반영
    color: '#fff',
    marginTop: '10px'
};

export default OrderSummary;
