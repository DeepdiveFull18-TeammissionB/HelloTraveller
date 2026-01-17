"use client";
import React from 'react';
import styles from './search.module.css';
import SearchSidebar from '@/components/domains/search/SearchSidebar';
import SearchMain from '@/components/domains/search/SearchMain';
import SearchTourList from '@/components/domains/search/SearchTourList';

export default function SearchPage() {
    const [view, setView] = React.useState<'main' | 'tourList'>('main');
    const [selectedCategory, setSelectedCategory] = React.useState<string>('');

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setView('tourList');
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
                onDetailsClick={() => { setView('tourList'); setSelectedCategory('추천 여행'); }}
                onSearchClick={() => { setView('tourList'); setSelectedCategory('해변 여행'); }}
            />}
            {view === 'tourList' && <SearchTourList category={selectedCategory} />}
        </div>
    );
}
