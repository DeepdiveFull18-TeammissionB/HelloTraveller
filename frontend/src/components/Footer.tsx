"use client";
import React from 'react';
import styles from './SharedStyles.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span className={styles.footerLink}>이용약관</span>
            <span className={styles.footerLink}>개인정보처리방침</span>
            <span className={styles.footerLink}>문의하기</span>
            <span className={styles.copyright}>© 2026 Hello-traveler-make</span>
        </footer>
    );
};

export default Footer;
