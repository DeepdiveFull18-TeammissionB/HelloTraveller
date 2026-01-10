import React, { useEffect, useState } from 'react';
import Products from './Products';
import axios from 'axios';

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

    const handleUpdateCount = (name: string, count: string) => {
    console.log(`${name} 상품 ${count}명 예약`);
    // 상태 업데이트 로직 추가
    };

    const loadItems = async () => {
            try {
                // TODO: use category for filtering or API call
                console.log('Selected Category:', category);
                const response = await axios.get(`http://localhost:4000/products`);
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
        <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            padding: isCompact ? '10px 0' : '20px',
            justifyContent: isCompact ? 'center' : 'flex-start'
        }}>
            {displayedItems.map((prod) => (
                <Products
                    key={prod.name}
                    name={prod.name}
                    imagePath={prod.imagePath}
                    description={prod.description}
                    updateItemCount={handleUpdateCount}
                    width="250px"
                />
            ))}
        </div>
    );
};

export default SearchTourList;
