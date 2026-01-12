"use client";
import React from 'react';
import Header from './Header';
import Navbar, { NavbarProps } from './Navbar';
import styles from './SharedStyles.module.css';
import { usePathname } from 'next/navigation';
import { cartService } from '../services/cartService';

export default function GlobalHeader() {
    const pathname = usePathname();
    const [hasOrders, setHasOrders] = React.useState(false);

    // 예약 내역 유무 체크
    React.useEffect(() => {
        const checkOrders = () => {
            const orders = cartService.getOrders();
            setHasOrders(orders.length > 0);
        };

        checkOrders();
        const interval = setInterval(checkOrders, 2000);
        return () => clearInterval(interval);
    }, [pathname]);

    let navbarProps: NavbarProps;

    // 공통 내비게이션 구성 함수
    const getGlobalLinks = () => [
        { label: '여행 상품', href: '/search' },
        ...(hasOrders ? [{ label: '내 예약', href: '/orders' }] : []),
        { label: '장바구니', href: '/payment' },
        { label: '문의하기' },
        { label: '로그인' }
    ];

    if (pathname === '/search') {
        navbarProps = {
            title: '여행 상품 탐색',
            links: getGlobalLinks(),
        };
    } else if (pathname === '/payment') {
        navbarProps = {
            title: '여행 상품 결제',
            showLogoCircle: true,
            links: getGlobalLinks(),
        };
    } else if (pathname === '/orders') {
        navbarProps = {
            title: '나의 예약 내역',
            showLogoCircle: true,
            links: getGlobalLinks(),
        };
    } else {
        // 메인 홈
        navbarProps = {
            title: 'Home',
            showLogoCircle: false,
            links: getGlobalLinks(),
        };
    }

    return (
        <div className={styles.topWrapper}>
            <Header />
            <Navbar {...navbarProps} />
        </div>
    );
}
