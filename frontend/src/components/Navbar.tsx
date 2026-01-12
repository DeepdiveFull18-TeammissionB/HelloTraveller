"use client";
import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export interface NavbarProps {
    title: string;
    links: { label: string; href?: string }[];
    showLogoCircle?: boolean;
}

import { useRouter } from 'next/navigation';

const Navbar = ({ title, links, showLogoCircle = true }: NavbarProps) => {
    const router = useRouter();

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
                    onClick={() => window.location.reload()}
                    style={{ cursor: 'pointer' }}
                >
                    {title}
                </h1>
            </div>
            <div className={styles.navLinks}>
                {links.map((link, idx) => (
                    link.href ? (
                        <Link key={idx} href={link.href} className={styles.navLink}>
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
