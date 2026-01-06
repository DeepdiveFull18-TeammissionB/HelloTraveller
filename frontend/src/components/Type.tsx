import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Products from './Products';
import Options from './Options';
import OrderContext, { OrderType } from '../context/OrderContext';

interface Item {
    name: string;
    imagePath: string;
}

interface TypeProps {
    orderType: OrderType;
}

const Type: React.FC<TypeProps> = ({ orderType }) => {
    const [items, setItems] = useState<Item[]>([]);
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('Type component must be used within an OrderContextProvider');
    }

    const [orderData, updateItemCount] = context;

    useEffect(() => {
        loadItems(orderType);
    }, [orderType]);

    const loadItems = async (type: OrderType) => {
        try {
            const response = await axios.get(`http://localhost:4000/${type}`);
            setItems(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Generic component picker
    const ItemComponent = orderType === "products" ? Products : Options;

    const optionItems = items.map((item) => (
        <ItemComponent
            key={item.name}
            name={item.name}
            imagePath={item.imagePath}
            updateItemCount={(itemName: string, newItemCount: string | number) =>
                updateItemCount(itemName, newItemCount, orderType)
            }
        />
    ));

    return (
        <div>
            <h2>주문 종류</h2>
            <p>하나의 가격</p>
            <p>총 가격 : {orderData.totals[orderType]}</p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: orderType === "options" ? "column" : "row",
                }}
            >
                {optionItems}
            </div>
        </div>
    );
};

export default Type;
