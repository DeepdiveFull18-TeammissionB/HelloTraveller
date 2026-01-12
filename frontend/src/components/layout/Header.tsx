"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../common/SharedStyles.module.css';

interface HeaderProps {
    title?: string;
}

const Header = ({ title = "Hello Traveller" }: HeaderProps) => {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.headerTitle}>
                <h1>{title}</h1>
            </Link>
        </header>
    );
};

export default Header;
