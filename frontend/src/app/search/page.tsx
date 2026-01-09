"use client";
import React from 'react';
import Link from 'next/link';
import styles from './search.module.css';
export default function SearchPage() {
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {[
                    { icon: '🏖️', label: '해변 여행' },
                    { icon: '🏞️', label: '산악 여행' },
                    { icon: '🏙️', label: '도시 탐방' },
                    { icon: '🚴‍♂️', label: '모험 여행' },
                ].map((item, idx) => (
                    <div key={idx} className={styles.sidebarItem}>
                        <div className={styles.iconBox}>{item.icon}</div>
                        <span className={styles.sidebarText}>{item.label}</span>
                    </div>
                ))}
            </aside>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>모두를 위한 여행 상품</h2>
                    <p className={styles.heroSubtitle}>당신의 완벽한 여행을 찾으세요. 다양한 여행 상품들을 확인하고 예약하세요!</p>
                    <div className={styles.heroButtons}>
                        <div className={styles.btnOutline}>회원가입</div>
                        <div className={styles.btnSolid}>지금 탐색하기</div>
                    </div>
                </div>
            </section>

            {/* Recommended Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>추천 여행 상품</h2>
                    <p className={styles.sectionSubtitle}>최고의 여행지를 확인해보세요!</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={styles.btnSolid} style={{ width: 'auto', padding: '12px 24px' }}>자세히 보기</div>
                    </div>
                </div>

                <div className={styles.cardGrid}>
                    {[
                        { title: '장흥 해변 투어', duration: '2일 1박', badge: '인기 상품', sub: '여름 해변' },
                        { title: '알프스 하이킹', duration: '3일', badge: '모험 상품', sub: '알프스 산맥' },
                        { title: '서울 야경 투어', duration: '1일', badge: '추천', sub: '도시 야경' },
                        { title: '아이슬란드 오로라 투어', duration: '5일 4박', badge: '특별 상품', sub: '오로라 관측' },
                        { title: '지중해 크루즈', duration: '7일', badge: '럭셔리 상품', sub: '지중해 크루즈' },
                    ].map((card, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.cardImage}>
                                <div className={styles.cardBadge}>{card.badge}</div>
                                <span style={{ fontSize: 12 }}>{card.sub}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>{card.title}</div>
                                <div className={styles.cardDuration}>{card.duration}</div>
                                <div className={styles.cardIcons}>
                                    <span>💖</span>
                                    <span>🔥</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Booking Form Section */}
            <section className={styles.section}>
                <div style={{ display: 'flex', gap: '60px', width: '100%', maxWidth: '1100px' }}>
                    <div style={{ flex: 1 }}>
                        <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>여행 상품 예약</h2>
                        <p className={styles.sectionSubtitle} style={{ textAlign: 'left' }}>원하는 여행 상품을 선택하고 예약을 진행하세요.</p>
                    </div>
                    <div className={styles.bookingForm}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이름</label>
                            <input className={styles.input} placeholder="이름을 입력하세요" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이메일</label>
                            <input className={styles.input} placeholder="이메일을 입력하세요" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>선택하시고 싶은 상품</label>
                            <div className={styles.tagGroup}>
                                {['장흥 해변 투어', '알프스 하이킹', '서울 야경 투어', '아이슬란드 오로라 투어'].map(tag => (
                                    <div key={tag} className={styles.tag}>{tag}</div>
                                ))}
                            </div>
                            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>상품을 선택해주세요.</span>
                        </div>
                        <div className={styles.formButtons}>
                            <div className={styles.btnCancel}>취소</div>
                            <Link href="/payment" className={styles.btnSolid} style={{ textDecoration: 'none' }}>예약하기</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
