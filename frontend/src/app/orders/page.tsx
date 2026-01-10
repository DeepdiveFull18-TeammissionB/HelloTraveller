import OrderComplete from "../../components/OrderComplete";

export default function OrderPage() {
    return (
        <OrderComplete
            dDay={1}
            tickets={[
                { orderNumber: '384793287499283049', amount: 6000 },
                { orderNumber: '384793287499283049', amount: 6000 },
                { orderNumber: '384793287499283049', amount: 6000 }
            ]}
        />
    );
}