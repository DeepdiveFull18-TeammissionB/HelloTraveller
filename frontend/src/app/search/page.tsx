"use client";
import React from 'react';
import Link from 'next/link';
import styles from './search.module.css';
import SearchSidebar from '@/components/SearchSidebar';
import SearchMain from '@/components/SearchMain';
import SearchTourList from '@/components/SearchTourList';

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
                                    onDetailsClick={() => {setView('tourList'); setSelectedCategory('추천 여행');}} 
                                    onSearchClick={() => {setView('tourList'); setSelectedCategory('해변 여행');}} 
                                />}
            {view === 'tourList' && <SearchTourList category={selectedCategory} />}
        </div>
    );
}

const cardStyleGrid = styles.cardGrid; // Fix for reference if needed
