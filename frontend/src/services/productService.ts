import apiClient from './apiClient';

export interface ProductItem {
    name: string;
    imagePath: string;
    description: string;
    price: number;
    matchedOptions?: string[];
}

interface FetchParams {
    lat?: number | string;
    lon?: number | string;
}

const ProductService = {
    /**
     * 투어 상품 데이터를 가져옵니다. (Hybrid Logic)
     * 1. 외부 API (Amadeus) 시도 (Timeout 2.5s)
     * 2. 실패 시 로컬 JSON 데이터 Fallback
     */
    fetchTourProducts: async (params?: FetchParams): Promise<ProductItem[]> => {
        try {
            // 1. 외부 API 시도
            const externalResponse = await apiClient.get('/api/external/tours', {
                params,
                timeout: 2500 // 2.5초 타임아웃
            });

            if (externalResponse.data && externalResponse.data.length > 0) {
                return externalResponse.data;
            }
            throw new Error("No external data found");
        } catch (e) {
            console.warn("Falling back to Local Data due to:", e);
            // 2. 로컬 데이터 Fallback
            const localResponse = await apiClient.get('/api/tours', { params });
            return localResponse.data;
        }
    }
};

export default ProductService;
