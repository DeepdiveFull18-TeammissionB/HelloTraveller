/**
 * 상품 및 장바구니 관련 타입 정의
 */

// API 클라이언트 타입
export interface ApiItem {
    name: string;
    imagePath: string;
    description: string;
}

// 장바구니 내역 상세 타입
export interface ItemDetail {
    count: number;
    imagePath: string;
    price: number;
    startDate?: string;
    endDate?: string;
    selectedOptions?: string[];
}

// 주문 아이템 (이름 포함)
export interface OrderItem extends ItemDetail {
    name: string;
}

// 장바구니 전체 카운트 맵
export interface OrderCounts {
    products: Map<string, ItemDetail>;
    options: Map<string, ItemDetail>;
}

// 합계 정보
export interface Totals {
    products: number;   // 상품 총 금액
    options: number;    // 옵션 총 금액
    total: number;      // 전체 합계 금액
    totalCount: number; // 상품 총 수량
}

// 주문 컨텍스트 데이터
export interface OrderData extends OrderCounts {
    totals: Totals;
    productItems: OrderItem[];
    optionItems: OrderItem[];
}

export type OrderType = "products" | "options";
