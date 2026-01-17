"use client";
import React from 'react';
import styles from './page.module.css';
import Type from '@/components/domains/shared/Type';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>즉흥 여행의 시작!</h2>
          <p className={styles.heroSubtitle}>복잡한 예약 없이 간편하게 여행 상품을 찾아보세요.</p>
          <Link href="/search" className={styles.heroButtonWrapper} style={{ textDecoration: 'none' }}>
            <span className={styles.heroButtonText}>여행 상품 탐색하기</span>
          </Link>
        </div>
        <div className={styles.heroImageArea}>
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Travel Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Recommended Tours Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>추천 투어 상품</h2>
          <p className={styles.sectionSubtitle}>최고의 여행이 기다리고 있습니다!</p>
        </div>

        {/* Integrating existing Type component for dynamic product loading */}
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          <Type orderType="products" hideHeader={true} />
        </div>
      </section>

      {/* Booking Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>예약하기</h2>
          <p className={styles.sectionSubtitle}>원하시는 인원 수와 날짜를 선택하세요!</p>
        </div>
        <div className={styles.bookingFormGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>인원 수</label>
            <div className={styles.inputField}>인원을 입력하세요</div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>여행 날짜</label>
            <div className={styles.inputField}>YYYY-MM-DD</div>
          </div>
          <div className={styles.orderButtonWrapper} onClick={() => router.push('/search')}>
            <span className={styles.orderButtonText}>지금 당장 투어 상품 보러가기</span>
          </div>
        </div>
      </section>

      {/* Promo Bar */}
      <div className={styles.promoBar}>
        <p className={styles.promoText}>지금 예약하면 특별 할인이 있습니다! 놓치지 마세요.</p>
      </div>

      {/* Extra Options Section - New Layout */}
      <section className={styles.sideHeaderSection}>
        <div className={styles.sideHeaderArea}>
          <h2 className={styles.sideTitle}>부가 옵션</h2>
          <p className={styles.sideSubtitle}>여행을 더욱 완벽하게!</p>
        </div>

        <div className={styles.optionsList}>
          {[
            {
              title: '여행자 보험',
              sub: '안전한 여행',
              icon: '🛡️'
            },
            {
              title: '식사권 포함',
              sub: '맛있는 저녁',
              icon: '🍽️'
            },
            {
              title: '좌석 업그레이드',
              sub: '더 편안한 여행',
              icon: '✈️'
            }
          ].map((option, idx) => (
            <div key={idx} className={styles.optionItem}>
              <div className={styles.optionIconCircle}>
                <span style={{ fontSize: '50px' }}>{option.icon}</span>
              </div>
              <div className={styles.optionTextGroup}>
                <h3 className={styles.optionItemTitle}>{option.title}</h3>
                <p className={styles.optionItemSub}>{option.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>고객 리뷰</h2>
          <p className={styles.sectionSubtitle}>우리의 여행을 경험한 고객들이 남긴 이야기</p>
        </div>
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <div className={styles.reviewUser}>
              <div className={styles.userAvatar} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: '#9CA3AF' }}>
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={styles.userName}>김지연</span>
            </div>
            <p className={styles.reviewText}>정말 쉽고 빠르게 예약할 수 있었습니다! 최고의 경험!</p>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.reviewUser}>
              <div className={styles.userAvatar} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: '#9CA3AF' }}>
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={styles.userName}>이승민</span>
            </div>
            <p className={styles.reviewText}>여행사와의 소통도 원활하여 좋았습니다!</p>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.reviewUser}>
              <div className={styles.userAvatar} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: '#9CA3AF' }}>
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={styles.userName}>박수민</span>
            </div>
            <p className={styles.reviewText}>즉흥 여행을 좋아하는 저에게 딱 맞는 서비스입니다!</p>
          </div>
        </div>
      </section>
    </div>
  );
}