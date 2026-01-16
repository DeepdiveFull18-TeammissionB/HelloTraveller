"use client";
import React, { useState, useContext, useEffect } from 'react';
import OrderContext from '../../context/OrderContext';
import Link from 'next/link';
import styles from './payment.module.css';
import CartList from '../../components/domains/order/CartList';
import OrderSummary from '../../components/domains/order/OrderSummary';
import OrderComplete from '../../components/common/OrderComplete';
import PaymentSuccess from '../../components/common/PaymentSuccess'; // 다시 추가
import Type from '../../components/domains/shared/Type';
import { cartService } from '../../services/cartService';
import apiClient from '../../services/apiClient';
import { showAlert } from '../../components/common/AlertPortal';
import { useRouter } from 'next/navigation'; // useRouter 추가
import { getRouteInfo } from '../../services/airportService';

type PaymentStep = 'cart' | 'processing' | 'completed'; // processing 단계 추가



export default function PaymentPage() {
    const router = useRouter();
    const [step, setStep] = useState<PaymentStep>('cart');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<{ id: string, amount: number } | null>(null);

    const context = useContext(OrderContext);

    useEffect(() => {
        if (context && context[0].productItems.length > 0 && !selectedItem) {
            setSelectedItem(context[0].productItems[0]);
        }
    }, [context, selectedItem]);

    if (!context) return null;

    const [orderData, updateItemCount, resetCart, removeItem] = context;

    const isCartEmpty = orderData.productItems.length === 0;

    const handleOrder = async () => {
        if (!isConfirmed) {
            showAlert({
                title: '확인 단계',
                message: '\n먼저 하단의 "주문하기" 버튼을 눌러.\n주문 내용을 최종 확인해 주세요.',
                type: 'info'
            });
            return;
        }

        try {
            // 1. 백엔드에 주문 요청 (이제 주문 번호는 백엔드에서 생성함)
            const response = await apiClient.post('/order', {
                totals: orderData.totals
            });

            const serverOrder = response.data; // { orderId: "HT-...", price: ... }
            const orderId = serverOrder.orderId;
            const totalAmount = orderData.totals.total;

            const newOrder = {
                orderId: orderId,
                orderDate: new Date().toLocaleString(),
                items: [
                    ...orderData.productItems.map(item => ({ ...item, type: 'tour' })),
                    ...orderData.optionItems.map(item => ({ ...item, type: 'option' }))
                ],
                totalAmount: totalAmount,
                totalCount: orderData.totals.totalCount
            };

            // 2. 주문 데이터 저장 (로컬 기록용)
            cartService.placeOrder(newOrder);
            setCompletedOrder({ id: orderId, amount: totalAmount });

            // 3. 장바구니 초기화
            if (resetCart) resetCart();

            // 4. 결제 완료 진행
            setStep('processing');
            window.scrollTo(0, 0);

            setTimeout(() => {
                setStep('completed');
            }, 3000);

        } catch (error) {
            console.error("주문 생성 실패:", error);
            showAlert({
                title: '주문 실패',
                message: '서버와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
                type: 'error'
            });
        }
    };

    const handleCountChange = (name: string, count: number) => {
        const existingImage = orderData.productItems.find(item => item.name === name)?.imagePath || "";
        updateItemCount(name, count, "products", { imagePath: existingImage }, true);
    };

    // 1단계: 결제 처리 중 (PaymentSuccess 노출)
    if (step === 'processing') {
        return (
            <div className={styles.container}>
                <PaymentSuccess />
            </div>
        );
    }

    // 2단계: 최종 완료 (OrderComplete 티켓 노출)
    if (step === 'completed' && completedOrder) {
        return (
            <div className={styles.container}>
                <OrderComplete
                    dDay={7}
                    tickets={[
                        { orderNumber: completedOrder.id, amount: completedOrder.amount }
                    ]}
                    onViewOrders={() => router.push('/orders')}
                />
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
                        <div
                            className={styles.btnSolid}
                            onClick={handleOrder}
                            style={{ cursor: 'pointer' }}
                        >
                            결제 진행
                        </div>
                    </div>
                </div>
            </section>
            <section style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', padding: '20px' }}>
                <CartList
                    items={orderData.productItems}
                    onItemClick={(item) => setSelectedItem(item)}
                    selectedItemName={selectedItem?.name}
                    onCountChange={handleCountChange}
                    onRemove={(name) => removeItem(name, 'products')}
                />
                <OrderSummary
                    guestCount={orderData.totals.totalCount}
                    productAmount={orderData.totals.products}
                    optionAmount={orderData.totals.options}
                    totalAmount={orderData.totals.total}
                    onOrderConfirm={() => setIsConfirmed(true)} // 주문 확인 시 상태 업데이트
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
                    {selectedItem ? (() => {
                        const route = getRouteInfo(selectedItem.name, 'Seoul'); // Default to Seoul for now

                        // Local Activity Logic (No Flight)
                        if (route.isLocalActivity) {
                            return [
                                {
                                    label: '일정 시작 (Start)',
                                    value: `${selectedItem.startDate} | 현지 일정 시작`,
                                    tag: '현지 합류'
                                },
                                {
                                    label: '일정 종료 (End)',
                                    value: `${selectedItem.endDate} | 현지 일정 종료`,
                                    tag: '현지 해산'
                                },
                            ].map((info, idx) => (
                                <div key={idx} className={styles.detailItem}>
                                    <div
                                        className={styles.detailItemImage}
                                        style={{
                                            backgroundImage: `url(${selectedItem.imagePath})`,
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemLabel}>{info.label}</h3>
                                        <p className={styles.itemValue}>{info.value}</p>
                                        {info.tag && <div className={styles.tag}>{info.tag}</div>}
                                    </div>
                                </div>
                            ));
                        }

                        // Flight Logic
                        return [
                            {
                                label: '가는 날 (Outbound)',
                                value: `${selectedItem.startDate} | ${route.departure.code} ✈️ ${route.destination.code}`,
                                tag: '출국 항공편'
                            },
                            {
                                label: '오는 날 (Inbound)',
                                value: `${selectedItem.endDate} | ${route.destination.code} ✈️ ${route.departure.code}`,
                                tag: '귀국 항공편'
                            },
                        ].map((info, idx) => (
                            <div key={idx} className={styles.detailItem}>
                                <div
                                    className={styles.detailItemImage}
                                    style={{
                                        backgroundImage: `url(${selectedItem.imagePath})`,
                                        backgroundSize: 'cover'
                                    }}
                                />
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemLabel}>{info.label}</h3>
                                    <p className={styles.itemValue}>{info.value}</p>
                                    {info.tag && <div className={styles.tag}>{info.tag}</div>}
                                </div>
                            </div>
                        ));
                    })() : (
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
