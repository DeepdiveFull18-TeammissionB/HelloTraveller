import React, { ChangeEvent } from 'react';

interface ProductsProps {
    name: string;
    imagePath: string;
    updateItemCount: (itemName: string, newItemCount: string) => void;
}

const Products: React.FC<ProductsProps> = ({ name, imagePath, updateItemCount }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value;
        updateItemCount(name, currentValue);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <img
                style={{ width: '75%' }}
                src={`http://localhost:4000/${imagePath}`}
                alt={`${name} product`}
            />
            <form style={{ marginTop: '10px' }}>
                <label style={{ textAlign: 'right' }}>{name}</label>
                <input
                    style={{ marginLeft: '7px' }}
                    type="number"
                    name="quantity"
                    min="0"
                    defaultValue={0}
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};

export default Products;
