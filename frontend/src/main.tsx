import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { OrderContextProvider } from './context/OrderContext';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <OrderContextProvider>
                <App />
            </OrderContextProvider>
        </StrictMode>
    );
}
