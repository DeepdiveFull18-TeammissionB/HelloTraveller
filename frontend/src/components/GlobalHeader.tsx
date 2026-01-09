"use client";
import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import styles from './SharedStyles.module.css';
import { usePathname } from 'next/navigation';

const GlobalHeader = () => {
    const pathname = usePathname();

    // Determine Navbar props based on route
    const getNavbarProps = () => {
        if (pathname === '/search') {
            return {
                title: "여행 상품 탐색",
                links: [
                    { label: '여행 상품' },
                    { label: '장바구니' },
                    { label: '문의하기' },
                    { label: '로그인' }
                ],
                showLogoCircle: true
            };
        }
        if (pathname === '/payment') {
            return {
                title: "여행 상품 결제",
                links: [
                    { label: '여행 상품' },
                    { label: '내 예약' },
                    { label: '장바구니' },
                    { label: '문의하기' },
                    { label: '로그아웃' }
                ],
                showLogoCircle: true
            };
        }
        // Default for main or other pages
        return {
            title: "Home",
            links: [
                { label: '여행 상품', href: '/search' },
                { label: '장바구니' },
                { label: '문의하기' },
                { label: '로그인' }
            ],
            showLogoCircle: false
        };
    };

    const navbarProps = getNavbarProps();

    return (
        <div className={styles.topWrapper}>
            <Header />
            <Navbar {...navbarProps} />
        </div>
    );
};

export default GlobalHeader;
