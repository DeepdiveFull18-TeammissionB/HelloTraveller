"use client";
import React from 'react';
import Link from 'next/link';
import styles from './payment.module.css';
export default function PaymentPage() {
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

            {/* Extra Products Section */}
            <section className={styles.extraSection}>
                <div className={styles.extraHeader}>
                    <div className={styles.extraHeaderText}>
                        <h2 className={styles.sectionTitle}>추가 상품</h2>
                        <p className={styles.sectionSubtitle}>여행의 즐거움을 더해줄 추가 상품을 선택하세요.</p>
                    </div>
                    <div className={styles.buttonGroup}>
                        <div className={styles.btnOutline}>취소</div>
                        <div className={styles.btnSolid}>선택 완료</div>
                    </div>
                </div>
                <div className={styles.extraGrid}>
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
                </div>
            </section>

            {/* Product Detail Info Section */}
            <section className={styles.detailSection}>
                <div className={styles.extraHeader}>
                    <div className={styles.extraHeaderText}>
                        <h2 className={styles.sectionTitle}>상품 정보</h2>
                        <p className={styles.sectionSubtitle}>상품의 세부정보를 확인하세요.</p>
                    </div>
                    <div className={styles.buttonGroup}>
                        <div className={styles.btnOutline}>돌아가기</div>
                        <div className={styles.btnSolid}>자세히 보기</div>
                    </div>
                </div>
                <div className={styles.detailInfoList}>
                    {[
                        { label: '여행 시작일', value: '2023년 12월 01일', tag: '정확한 일정' },
                        { label: '여행 종료일', value: '2023년 12월 08일', tag: '일주일' },
                        { label: '출발지', value: '인천국제공항', tag: null },
                        { label: '도착지', value: '파리, 프랑스', tag: null },
                    ].map((info, idx) => (
                        <div key={idx} className={styles.detailItem}>
                            <div className={styles.detailItemImage} />
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemLabel}>{info.label}</h3>
                                <p className={styles.itemValue}>{info.value}</p>
                                {info.tag && <div className={styles.tag}>{info.tag}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
