import { createContext, useMemo, useState, useEffect } from "react";

const OrderContext = createContext();
export default OrderContext;

export function OrderContextProvider(props){
    const [orderCounts, setOrderCounts] = useState({
        products: new Map(),
        options: new Map()
    })

    const [totals, setTotals] = useState({
		products: 0,
		options: 0,
		total: 0
	});

    const pricePerItem = {
	    products: 1000,
	    options: 500,
    };

    function calculateSubtotal(orderType, orderCounts) {
        let optionCount = 0;
        for(const count of orderCounts[orderType].values()){
            optionCount += count;
        }
        
        return optionCount * pricePerItem[orderType];
    }

    useEffect(()=>{
		const productsTotal = calculateSubtotal("products", orderCounts);
		const optionsTotal = calculateSubtotal("options", orderCounts);
		const total = productsTotal + optionsTotal;
		setTotals({
			products: productsTotal,
			options: optionsTotal,
			total: total,
		});
	}, [orderCounts]);

    const value = useMemo(()=>{
        function updateItemCount(itemName, newItemCount, orderType){
            // 불변성의 원칙에 따라 원래 있던 값을 복사한다.
            const newOrderCounts = {...orderCounts};

            const orderCountsMap = orderCounts[orderType];
            orderCountsMap.set(itemName, parseInt(newItemCount));

            setOrderCounts(newOrderCounts);
        }
        return [{...orderCounts, totals}, updateItemCount]
    }, [orderCounts, totals]);
    
    return <OrderContext.Provider value={value}>
        {props.children}
    </OrderContext.Provider>
}