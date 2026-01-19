"use client";
import React from 'react';
import styles from './search.module.css';
import SearchSidebar from '@/components/domains/search/SearchSidebar';
import SearchMain from '@/components/domains/search/SearchMain';
import SearchTourList from '@/components/domains/search/SearchTourList';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </React.Suspense>
    );
}

function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    // URL 파라미터가 있으면 투어 리스트, 없으면 메인 화면
    const view = categoryParam ? 'tourList' : 'main';
    const selectedCategory = categoryParam || '';

    const handleCategorySelect = (category: string) => {
        // 카테고리 선택 시 URL 업데이트
        router.push(`/search?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <SearchSidebar
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
            />

            {/* Dynamic Content Area */}
            {view === 'main' && <SearchMain
                onDetailsClick={() => router.push(`/search?category=${encodeURIComponent('추천 여행')}`)}
                onSearchClick={() => router.push(`/search?category=${encodeURIComponent('해변 여행')}`)}
            />}
            {view === 'tourList' && <SearchTourList category={selectedCategory} />}
        </div>
    );
}
