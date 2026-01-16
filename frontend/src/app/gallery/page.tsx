"use client";
import React from 'react';
import SummaryPage from '@/components/domains/order/SummaryPage';
import Type from '@/components/domains/shared/Type';
import OrderSummary from '@/components/domains/order/OrderSummary';
import CartList from '@/components/domains/order/CartList';
import OrderComplete from '@/components/common/OrderComplete';

/**
 * 컴포넌트 갤러리 페이지
 */
export default function ComponentGallery() {
    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1 style={mainTitleStyle}>Component Gallery</h1>
                <p style={subtitleStyle}>새롭게 추가된 쇼핑카트 및 주문 완료 파츠들을 확인합니다.</p>
            </header>

            <main style={mainContentStyle}>
                {/* 1. Order Summary - 이미지 0 & 1의 우측 요약 */}
                <section style={sectionStyle}>
                    <div style={badgeStyle}>New Component</div>
                    <h2 style={sectionTitleStyle}>1. Order Summary</h2>
                    <p style={descriptionStyle}>이미지 0 & 1에 나타난 결제 요약 정보와 주문 확인 체크박스가 포함된 컴포넌트입니다.</p>
                    <div style={{ maxWidth: '440px' }}>
                        <OrderSummary
                            guestCount={6}
                            productAmount={6000}
                            optionAmount={2000}
                            totalAmount={8000}
                        />
                    </div>
                </section>

                {/* 2. Cart List - 이미지 1의 왼쪽 리스트 */}
                <section style={sectionStyle}>
                    <div style={badgeStyle}>New Component</div>
                    <h2 style={sectionTitleStyle}>2. Cart List</h2>
                    <p style={descriptionStyle}>이미지 1에 나타난 장바구니에 담긴 상품들의 상세 내역을 보여주는 리스트 컴포넌트입니다.</p>
                    <div style={previewBoxStyle}>
                        <CartList
                            items={[
                                { name: 'Poland 투어', startDate: '2026.01.07', count: 2, selectedOptions: ['생수 제공', '가이드 및 설명 제공'], imagePath: '', price: 1000 },
                                { name: 'Poland 투어', startDate: '2026.01.07', count: 2, selectedOptions: ['생수 제공', '가이드 및 설명 제공'], imagePath: '', price: 1000 },
                                { name: 'Poland 투어', startDate: '2026.01.07', count: 2, selectedOptions: ['생수 제공', '가이드 및 설명 제공'], imagePath: '', price: 1000 }
                            ]}
                        />
                    </div>
                </section>

                {/* 3. Order Complete - 이미지 2의 주문 완료 화면 */}
                <section style={sectionStyle}>
                    <div style={badgeStyle}>New Component</div>
                    <h2 style={sectionTitleStyle}>3. Order Complete</h2>
                    <p style={descriptionStyle}>이미지 2에 나타난 주문 성공 메시지, 디데이 카운트, 티켓 정보를 보여주는 화면입니다.</p>
                    <div style={previewBoxStyle}>
                        <OrderComplete
                            dDay={1}
                            tickets={[
                                { orderNumber: '384793287499283049', amount: 6000 },
                                { orderNumber: '384793287499283049', amount: 6000 },
                                { orderNumber: '384793287499283049', amount: 6000 }
                            ]}
                        />
                    </div>
                </section>

                {/* 기존 컴포넌트들... */}
                <div style={dividerStyle} />

                <section style={sectionStyle}>
                    <div style={badgeStyle}>Existing</div>
                    <h2 style={sectionTitleStyle}>4. Type Component (Options/Products)</h2>
                    <div style={previewBoxStyle}>
                        <Type orderType="options" />
                    </div>
                </section>

                <section style={sectionStyle}>
                    <div style={badgeStyle}>Existing</div>
                    <h2 style={sectionTitleStyle}>5. Summary Page (Legacy)</h2>
                    <div style={previewBoxStyle}>
                        <SummaryPage />
                    </div>
                </section>
            </main>

            <footer style={{ textAlign: 'center', marginTop: '100px', color: '#999', paddingBottom: '40px' }}>
                &copy; 2026 Component Gallery Utility
            </footer>
        </div>
    );
}

// --- Styles ---
const containerStyle: React.CSSProperties = {
    padding: '60px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'system-ui, sans-serif',
    color: '#333',
    background: '#fafafa'
};

const headerStyle: React.CSSProperties = {
    marginBottom: '60px',
    textAlign: 'center'
};

const mainTitleStyle: React.CSSProperties = {
    fontSize: '42px',
    fontWeight: 800,
    marginBottom: '10px'
};

const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#666'
};

const mainContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '100px'
};

const sectionStyle: React.CSSProperties = {
    position: 'relative'
};

const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    background: '#EEF2FF',
    color: '#4F46E5',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '12px'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px'
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#666',
    marginBottom: '24px'
};

const previewBoxStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
};

const dividerStyle: React.CSSProperties = {
    height: '2px',
    background: '#eee',
    margin: '20px 0'
};
