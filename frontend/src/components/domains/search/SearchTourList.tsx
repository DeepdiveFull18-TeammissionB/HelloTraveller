import React, { useEffect, useState } from 'react';
import Products from '../shared/Products';
import apiClient from '../../../services/apiClient';
import { useRouter } from 'next/navigation';

interface Item {
    name: string;
    imagePath: string;
    description: string;
}

interface SearchTourListProps {
    category: string;
    maxItems?: number;
    isCompact?: boolean;
}

const categoryCoordinates: Record<string, { lat: number; lon: number }> = {
    '추천 여행': { lat: 41.397158, lon: 2.160873 }, // 바르셀로나
    '해변 여행': { lat: 13.7563, lon: 100.5018 },   // 방콕/휴양지 인근
    '산악 여행': { lat: 46.5218, lon: 6.6323 },     // 스위스 알프스 인근
    '도시 탐방': { lat: 48.8566, lon: 2.3522 },     // 파리
    '모험 여행': { lat: -33.8688, lon: 151.2093 },  // 시드니
};

// 카테고리별 검색 키워드 설정 (이 단어들이 포함되면 해당 카테고리로 분류)
const categoryKeywords: Record<string, string[]> = {
    '해변 여행': ['beach', 'sea', 'ocean', 'boat', 'water', 'snorkeling', 'island', 'cruise'],
    '산악 여행': ['mountain', 'hiking', 'nature', 'trekking', 'park', 'forest', 'climbing'],
    '도시 탐방': ['city', 'museum', 'history', 'walking', 'culture', 'architecture', 'bus', 'art'],
    '모험 여행': ['adventure', 'safari', 'thrill', 'outdoor', 'bike', 'rafting', 'sport'],
};

const SearchTourList: React.FC<SearchTourListProps> = ({ category, maxItems, isCompact = false }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadItems = async () => {
        setLoading(true);
        try {
            const coords = categoryCoordinates[category] || categoryCoordinates['추천 여행'];
            const response = await apiClient.get('/api/tours', {
                params: { lat: coords.lat, lon: coords.lon }
            });

            let data = response.data;

            // 핵심: 선택된 카테고리에 맞는 키워드로 필터링
            if (category !== '추천 여행') {
                const keywords = categoryKeywords[category];
                if (keywords) {
                    data = data.filter((tour: any) => {
                        const content = (tour.name + tour.description).toLowerCase();
                        // 키워드 중 하나라도 포함되어 있으면 유지
                        return keywords.some(kw => content.includes(kw));
                    });
                }
            }

            // 만약 필터링 후 데이터가 너무 적으면 전체에서 랜덤으로 보여줌 (Fallback)
            if (data.length < 2) {
                data = response.data;
            }

            // 랜덤 섞기 및 10개 추출
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setItems(shuffled.slice(0, maxItems || 10));

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [category]);

    const displayedItems = maxItems ? items.slice(0, maxItems) : items;

    return (
        <div style={{ padding: isCompact ? '10px 0' : '20px' }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                justifyContent: isCompact ? 'center' : 'flex-start'
            }}>
                {displayedItems.map((prod) => (
                    <Products
                        key={prod.name}
                        name={prod.name}
                        imagePath={prod.imagePath}
                        description={prod.description}
                        width="280px"
                    />
                ))}
            </div>

            {!isCompact && (
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => router.push('/payment')}
                        style={{
                            padding: '16px 40px',
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            borderRadius: '16px',
                            fontWeight: 700,
                            fontSize: '18px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        장바구니 및 결제 창으로 이동하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchTourList;
