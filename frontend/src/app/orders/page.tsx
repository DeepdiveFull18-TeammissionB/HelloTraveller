"use client";
import React, { useEffect, useState } from 'react';
import { cartService } from '../../services/cartService';
import styles from './orders.module.css';
import Link from 'next/link';
import { Button, Text } from '@vapor-ui/core';
import { showAlert } from '../../components/common/AlertPortal';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        const loadedOrders = cartService.getOrders();
        setOrders(loadedOrders);
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleCancelOrder = (orderId: string) => {
        showAlert({
            title: '예약 취소 확인',
            message: '\n예약을 취소하겠습니다.\n정말 취소하시겠습니까?',
            type: 'warning',
            confirmLabel: '예약 취소',
            cancelLabel: '예약 유지',
            onConfirm: () => {
                cartService.updateOrderStatus(orderId, 'canceled');
                loadOrders(); // 상태 새로고침
                showAlert({
                    title: '취소 완료',
                    message: '\n예약이 성공적으로 취소되었습니다.',
                    type: 'success'
                });
            }
        });
    };

    const handleDeleteOrder = (orderId: string) => {
        showAlert({
            title: '주문 내역 삭제',
            message: '\n선택하신 예약 내역을 영구히 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.',
            type: 'warning',
            confirmLabel: '내역 삭제',
            cancelLabel: '삭제 취소',
            onConfirm: () => {
                cartService.deleteOrder(orderId);
                loadOrders();
                showAlert({
                    title: '삭제 완료',
                    message: '\n주문 내역이 삭제되었습니다.',
                    type: 'success'
                });
            }
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyArea}>
                    <Text typography="body1">로딩 중...</Text>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>내 예약 내역</h1>
                    <p className={styles.subtitle}>여행 상품의 예약 상태를 한눈에 확인하세요.</p>
                </div>
                <div className={styles.emptyArea}>
                    <span className={styles.emptyIcon}>🎫</span>
                    <Text typography="heading4" style={{ fontWeight: 700 }}>아직 예약된 내역이 없습니다.</Text>
                    <Text typography="body1" style={{ color: '#666' }}>지금 바로 멋진 여행 상품을 찾아보세요!</Text>
                    <Link href="/search" style={{ textDecoration: 'none', marginTop: '10px' }}>
                        <Button colorPalette="primary" size="lg" style={{ borderRadius: '12px', padding: '0 40px' }}>
                            여행 상품 탐색하기
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>내 예약 내역</h1>
                <p className={styles.subtitle}>총 {orders.length}건의 소중한 여행 추억이 담겨있습니다.</p>
            </div>

            <div className={styles.orderList}>
                {orders.map((order, index) => {
                    const isCanceled = order.status === 'canceled';

                    return (
                        <div key={order.orderId || index} className={`${styles.orderCard} ${isCanceled ? styles.canceledCard : ''}`}>
                            {/* Order Info Header */}
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>예약 번호</span>
                                        <span className={`${styles.infoValue} ${styles.orderId}`}>{order.orderId}</span>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>예약 일시</span>
                                        <span className={styles.infoValue}>{order.orderDate}</span>
                                    </div>
                                </div>
                                <div className={styles.statusSection}>
                                    <div className={styles.statusBadge}>
                                        {isCanceled ? (
                                            <Text typography="body2" style={{ color: '#FF5252', fontWeight: 700 }}>● 예약 취소됨</Text>
                                        ) : (
                                            <Text typography="body2" style={{ color: '#4CAF50', fontWeight: 700 }}>● 예약 확정</Text>
                                        )}
                                    </div>
                                    {!isCanceled ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorPalette="secondary"
                                            onClick={() => handleCancelOrder(order.orderId)}
                                            style={{ borderRadius: '8px', fontSize: '12px', height: '32px', padding: '0 8px' }}
                                        >
                                            예약 취소
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorPalette="secondary"
                                            onClick={() => handleDeleteOrder(order.orderId)}
                                            style={{ borderRadius: '8px', fontSize: '12px', height: '32px', padding: '0 8px', borderColor: '#ddd', color: '#999' }}
                                        >
                                            기록 삭제
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className={styles.orderItems}>
                                {order.items.map((item: any, itemIdx: number) => {
                                    const isOption = item.type === 'option';

                                    // 옵션 아이콘 선택 함수
                                    const getOptionEmoji = (name: string) => {
                                        const lower = name.toLowerCase();
                                        if (lower.includes('insurance')) return '✨';
                                        if (lower.includes('dinner')) return '🍽️';
                                        if (lower.includes('firstclass')) return '✈️';
                                        return '📦';
                                    };

                                    return (
                                        <div key={itemIdx} className={styles.itemRow}>
                                            <div
                                                className={styles.itemImage}
                                                style={{
                                                    backgroundImage: item.imagePath ? `url(${item.imagePath})` : 'none',
                                                    filter: isCanceled ? 'grayscale(100%) opacity(0.5)' : 'none',
                                                    backgroundColor: isOption ? '#F0F9FF' : '#f5f5f5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '40px'
                                                }}
                                            >
                                                {!item.imagePath && isOption && <span>{getOptionEmoji(item.name)}</span>}
                                            </div>
                                            <div className={styles.itemContent}>
                                                <h3 className={styles.itemName} style={{ color: isCanceled ? '#999' : 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {isOption && <span className={styles.optionBadge}>추가상품</span>}
                                                    {item.name} {isCanceled && '(취소됨)'}
                                                </h3>
                                                <div className={styles.itemDetails}>
                                                    <span className={styles.detailBadge}>{isOption ? '🔢' : '👤'} {item.count}{isOption ? '개' : '명'}</span>
                                                    {item.startDate && (
                                                        <span className={styles.detailBadge}>📅 {item.startDate} ~ {item.endDate}</span>
                                                    )}
                                                </div>
                                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                    <div className={styles.itemOptions}>
                                                        <strong>선택 옵션:</strong> {item.selectedOptions.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.itemPriceArea}>
                                                <Text typography="body1" style={{ fontWeight: 700, color: isCanceled ? '#999' : '#1a1a1a' }}>
                                                    {((item.price || 0) * (item.count || 0)).toLocaleString()}₩
                                                </Text>
                                                {item.count > 1 && (
                                                    <Text typography="body3" color="text-secondary" style={{ fontSize: '11px' }}>
                                                        ({item.price?.toLocaleString()}₩ × {item.count})
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Footer */}
                            <div className={styles.orderFooter}>
                                <span className={styles.totalLabel}>총 결제 금액</span>
                                <span className={styles.totalAmount} style={{ color: isCanceled ? '#999' : '#4F46E5', textDecoration: isCanceled ? 'line-through' : 'none' }}>
                                    {order.totalAmount?.toLocaleString()}₩
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}