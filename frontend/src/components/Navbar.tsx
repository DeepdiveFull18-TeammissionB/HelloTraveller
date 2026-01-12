"use client";
import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export interface NavbarProps {
    title: string;
    links: { label: string; href?: string }[];
    showLogoCircle?: boolean;
}

import { useRouter, usePathname } from 'next/navigation';

const Navbar = ({ title, links, showLogoCircle = true }: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === href) {
            if (href === '/search') {
                // 탐색 페이지에서는 단순 스크롤이 아니라 상태 리셋(첫 화면)을 위해 새로고침 수행
                window.location.href = href;
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
                        onClick={() => router.back()}
                        style={{ cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '32px', color: 'rgba(0,0,0,0.8)', paddingBottom: '6px', paddingRight: '1px' }}>‹</span>
                    </div>
                )}
                <h1
                    className={styles.logoText}
                    onClick={() => {
                        if (pathname === '/') {
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
                        <span key={idx} className={styles.navLink}>{link.label}</span>
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
