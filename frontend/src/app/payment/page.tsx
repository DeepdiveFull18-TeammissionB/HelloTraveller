"use client";
import React, { useState, useContext, useEffect } from 'react';
import OrderContext from '../../context/OrderContext';
import Link from 'next/link';
import styles from './payment.module.css';
import CartList from '../../components/CartList';
import OrderSummary from '../../components/OrderSummary';
import PaymentSuccess from '../../components/PaymentSuccess';
import Type from '../../components/Type';
import { cartService } from '../../services/cartService';

type PaymentStep = 'cart' | 'completed';



export default function PaymentPage() {
    const [step, setStep] = useState<PaymentStep>('cart');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const context = useContext(OrderContext);
    
    useEffect(() => {
        if (context && context[0].productItems.length > 0 && !selectedItem) {
            setSelectedItem(context[0].productItems[0]);
        }
    }, [context, selectedItem]);

    if (!context) return null;
    
    const [orderData, updateItemCount, resetCart] = context;

    const isCartEmpty = orderData.productItems.length === 0;

    const handleOrder = () => {
        const orderId = cartService.generateOrderNumber();

        const newOrder = {
            orderId: orderId,
            orderDate: new Date().toLocaleString(),
            items: orderData.productItems,
            totalAmount: orderData.totals.total,
            totalCount: orderData.totals.totalCount
        };

        cartService.placeOrder(newOrder);

        setStep('completed');
        if (resetCart) resetCart(); 
        window.scrollTo(0, 0);
    };

    const handleCountChange = (name: string, count: number) => {
        // Context의 updateItemCount를 활용 (isReplace 옵션이 있다면 true로)
        updateItemCount(name, count, "products", {}, true); 
    };

    // 결제 완료 시 컴포넌트 불러오기
    if (step === 'completed') {
        return (
            <div className={styles.container}>
                <PaymentSuccess />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Hero / Detailed Info Header */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>여행 상품 상세 정보</h2>
                    <p className={styles.sectionSubtitle}>아래에서 상품 옵션을 선택하세요.</p>
                    <div className={styles.buttonGroup}>
                        <Link href="/search" className={styles.btnOutline} style={{ textDecoration: 'none' }}>
                            상품 목록으로 돌아가기
                        </Link>
                        <div className={styles.btnSolid}>결제 진행</div>
                    </div>
                </div>
            </section>
            <section style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', padding: '20px' }}>
                <CartList
                    items={orderData.productItems}
                    onItemClick={(item) => setSelectedItem(item)}
                    selectedItemName={selectedItem?.name}
                    onCountChange={handleCountChange}
                />
                <OrderSummary
                    guestCount={orderData.totals.totalCount}
                    productAmount={orderData.totals.products}
                    optionAmount={orderData.totals.options}
                    totalAmount={orderData.totals.total}
                    onOrder={!isCartEmpty ? handleOrder : () => alert('장바구니에 상품이 없습니다.')}
                />
            </section>
            {/* Extra Products Section */}
            <section className={styles.extraSection}>
                <div className={styles.extraHeader}>
                    <div className={styles.extraHeaderText}>
                        <h2 className={styles.sectionTitle}>추가 상품</h2>
                        <p className={styles.sectionSubtitle}>여행의 즐거움을 더해줄 추가 상품을 선택하세요.</p>
                    </div>
                </div>
                {/* <div className={styles.extraGrid}>
                    {[
                        { title: '좌석 업그레이드', price: '₩30,000', badge: '인기', sub: '비행기좌석 업그레이드' },
                        { title: '조식', price: '₩15,000', badge: '추천', sub: '호텔 조식 포함' },
                        { title: '여행자 보험', price: '₩10,000', badge: '안전', sub: '여행자 보험' },
                        { title: '픽업 서비스', price: '₩25,000', badge: '편리', sub: '공항 픽업 서비스' },
                    ].map((item, idx) => (
                        <div key={idx} className={styles.extraCard}>
                            <div className={styles.extraImage}>
                                <div className={styles.cardBadge}>{item.badge}</div>
                                <span style={{ fontSize: 12, textAlign: 'center', padding: '0 10px' }}>{item.sub}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardPrice}>{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div> */}
                <Type orderType="options" hideHeader={true} />
                
            </section>

            {/* Product Detail Info Section */}
            <section className={styles.detailSection}>
                <div className={styles.extraHeader}>
                    <div className={styles.extraHeaderText}>
                        <h2 className={styles.sectionTitle}>상품 정보</h2>
                        <p className={styles.sectionSubtitle}>상품의 세부정보를 확인하세요.</p>
                    </div>
                </div>
                <div className={styles.detailInfoList}>
                    {selectedItem ? (
                        [
                            { label: '여행 시작일', value: selectedItem.startDate, tag: '확정 일정' },
                            { label: '여행 종료일', value: selectedItem.endDate, tag: '귀국 일정' },
                            { label: '출발지', value: '인천국제공항 (ICN)', tag: '자동입력' },
                            { label: '도착지', value: `${selectedItem.name} 인근 공항`, tag: '자동입력' },
                        ].map((info, idx) => (
                            <div key={idx} className={styles.detailItem}>
                                <div 
                                    className={styles.detailItemImage} 
                                    style={{ 
                                        backgroundImage: `url(${selectedItem.imagePath})`, // 이미 Context에서 http://... 포함해서 저장했으므로 그대로 사용
                                        backgroundSize: 'cover' 
                                    }} 
                                />
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemLabel}>{info.label}</h3>
                                    <p className={styles.itemValue}>{info.value}</p>
                                    {info.tag && <div className={styles.tag}>{info.tag}</div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        /* 2. 상품이 선택되지 않았을 때 보여줄 안내 문구 */
                        <div style={{ padding: '40px', textAlign: 'center', width: '100%', color: '#999' }}>
                            <h2>장바구니에서 상세 정보를 확인하실 상품을 선택해 주세요.</h2>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
