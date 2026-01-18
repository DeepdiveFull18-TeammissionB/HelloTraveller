"use client";
import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export interface NavbarProps {
    title: string;
    links: { label: string; href?: string; onClick?: () => void }[];
    showLogoCircle?: boolean;
    userGreeting?: string; // 인사말 추가
}

import { useRouter, usePathname } from 'next/navigation';

const Navbar = ({ title, links, showLogoCircle = true, userGreeting }: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === href) {
            if (href === '/search') {
                router.push('/search');
                router.refresh();
            } else {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoArea}>
                {showLogoCircle && (
                    <div
                        className={styles.logoCircle}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.back();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '32px', color: 'rgba(0,0,0,0.8)', paddingBottom: '6px', paddingRight: '1px' }}>‹</span>
                    </div>
                )}
                <h1
                    className={styles.logoText}
                    onClick={() => {
                        if (pathname.startsWith('/search')) {
                            router.push('/search');
                            router.refresh();
                        } else if (pathname.startsWith('/payment')) {
                            router.push('/payment');
                            router.refresh();
                        } else if (pathname === '/') {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            router.push('/');
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {title}
                </h1>
            </div>
            <div className={styles.navLinks}>
                {userGreeting && (
                    <span style={{ marginRight: '24px', fontWeight: 600, color: '#444', fontSize: '0.95rem' }}>
                        {userGreeting}
                    </span>
                )}
                {links.map((link, idx) => (
                    link.href ? (
                        <Link
                            key={idx}
                            href={link.href}
                            className={styles.navLink}
                            onClick={(e) => handleLinkClick(e, link.href!)}
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span
                            key={idx}
                            className={styles.navLink}
                            onClick={link.onClick} // onClick 연결
                            style={link.onClick ? { cursor: 'pointer' } : undefined} // 클릭 가능하면 커서 변경
                        >
                            {link.label}
                        </span>
                    )
                ))}
                <div className={styles.searchBar}>
                    <span className={styles.searchText}>Search in site</span>
                    <div className={styles.searchIcon} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
