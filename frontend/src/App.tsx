import React from 'react';
import './App.css';
import SummaryPage from './pages/SummaryPage/index';
import OrderPage from './pages/OrderPage/index';

const App: React.FC = () => {
    return (
        <div style={{ padding: '4rem' }}>
            <OrderPage />
            <SummaryPage />
        </div>
    );
};

export default App;
