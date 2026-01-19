"use client";
import React from 'react';
import Header from './Header';
import Navbar, { NavbarProps } from './Navbar';
import styles from '../common/SharedStyles.module.css';
import { usePathname } from 'next/navigation';
import { cartService } from '../../services/cartService';

export default function GlobalHeader() {
    const pathname = usePathname();
    const [hasOrders, setHasOrders] = React.useState(false); // 복구됨
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userName, setUserName] = React.useState('');

    // 로그인 상태 및 예약 내역 체크
    React.useEffect(() => {
        const checkStatus = () => {
            // 로그인 체크
            const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const name = sessionStorage.getItem('name') || '';
            setIsLoggedIn(loggedIn);
            setUserName(name);

            // 장바구니 체크
            const orders = cartService.getOrders();
            setHasOrders(orders.length > 0);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000); // 1초마다 상태 감지 (간단한 폴링)
        return () => clearInterval(interval);
    }, [pathname]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        window.location.assign('/'); // 강제 새로고침으로 상태 초기화
    };

    let navbarProps: NavbarProps;

    // 공통 내비게이션 구성 함수
    const getGlobalLinks = () => [
        { label: '여행 상품', href: '/search' },
        ...(hasOrders ? [{ label: '내 예약', href: '/orders' }] : []),
        { label: '장바구니', href: '/payment' },
        { label: '문의하기' },
        // 로그인 상태에 따라 버튼 분기
        ...(isLoggedIn
            ? [{ label: '로그아웃', onClick: handleLogout }]
            : [{ label: '로그인', href: '/login' }])
    ];

    const userGreeting = isLoggedIn ? `${userName}님과 함께하는 투어!` : undefined;

    if (pathname === '/search') {
        navbarProps = {
            title: '여행 상품 탐색',
            links: getGlobalLinks(),
            userGreeting
        };
    } else if (pathname === '/payment') {
        navbarProps = {
            title: '여행 상품 결제',
            showLogoCircle: true,
            links: getGlobalLinks(),
            userGreeting
        };
    } else if (pathname === '/orders') {
        navbarProps = {
            title: '나의 예약 내역',
            showLogoCircle: true,
            links: getGlobalLinks(),
            userGreeting
        };
    } else {
        // 메인 홈
        navbarProps = {
            title: 'Home',
            showLogoCircle: false,
            links: getGlobalLinks(),
            userGreeting
        };
    }

    return (
        <div className={styles.topWrapper}>
            <Header />
            <Navbar {...navbarProps} />
        </div>
    );
}
