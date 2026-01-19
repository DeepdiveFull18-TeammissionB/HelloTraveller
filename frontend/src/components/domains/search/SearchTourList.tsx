import React, { useEffect, useState } from 'react';
import Products from '../shared/Products';
import ProductService from '../../../services/productService';
import { useRouter } from 'next/navigation';

interface Item {
    name: string;
    imagePath: string;
    description: string;
    price: number;
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

const categoryKeywords: Record<string, string[]> = {
    '해변 여행': ['beach', 'sea', 'ocean', 'boat', 'water', 'snorkeling', 'island', 'cruise'],
    '산악 여행': ['mountain', 'hiking', 'nature', 'trekking', 'park', 'forest', 'climbing'],
    '도시 탐방': ['city', 'museum', 'history', 'walking', 'culture', 'architecture', 'bus', 'art'],
    '모험 여행': ['adventure', 'safari', 'thrill', 'outdoor', 'bike', 'rafting', 'sport'],
};

const SearchTourList: React.FC<SearchTourListProps> = ({ category, maxItems, isCompact = false }) => {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                const coords = categoryCoordinates[category] || categoryCoordinates['추천 여행'];

                // [Refactored] Use ProductService
                let data = await ProductService.fetchTourProducts({
                    lat: coords.lat,
                    lon: coords.lon
                });

                if (!isMounted) return;

                // 필터링 전 원본 데이터 보존
                const originalData = [...data];

                if (category !== '추천 여행') {
                    const keywords = categoryKeywords[category];
                    if (keywords) {
                        data = data.filter((tour: Item) => {
                            const content = (tour.name + tour.description).toLowerCase();
                            return keywords.some(kw => content.includes(kw));
                        });
                    }
                }

                if (data.length < 2) {
                    // 필터링 결과가 너무 적으면 원본 데이터(추천 여행 등)를 대신 보여줌
                    data = originalData;
                }

                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setItems(shuffled.slice(0, maxItems || 10));

            } catch (error) {
                console.error(error);
            }
        };

        const timer = setTimeout(() => {
            load();
        }, 0);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [category, maxItems]);

    const displayedItems = items;

    return (
        <div style={{ padding: isCompact ? '10px 0' : '20px' }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                justifyContent: isCompact ? 'center' : 'flex-start'
            }}>
                {displayedItems.map((prod, index) => (
                    <Products
                        key={`${prod.name}-${index}`}
                        name={prod.name}
                        imagePath={prod.imagePath}
                        description={prod.description}
                        price={prod.price}
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
