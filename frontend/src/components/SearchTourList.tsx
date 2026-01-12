import React, { useEffect, useState } from 'react';
import Products from './Products';
import apiClient from '../services/apiClient';
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

const SearchTourList: React.FC<SearchTourListProps> = ({ category, maxItems, isCompact = false }) => {
    const [items, setItems] = useState<Item[]>([]);
    const router = useRouter();

    const loadItems = async () => {
        try {
            console.log('Selected Category:', category);
            const response = await apiClient.get('/products');
            setItems(response.data);
        } catch (error) {
            console.log(error);
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
