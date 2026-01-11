"use client";

// 1. Context와 동일한 상세 정보 인터페이스 정의
export interface ItemDetail {
  count: number;
  imagePath: string;
  startDate?: string;
  endDate?: string;
  selectedOptions?: string[];
}

export interface OrderCounts {
  products: Map<string, ItemDetail>;
  options: Map<string, ItemDetail>;
}

const CART_KEY = "hello_traveler_cart";

export const cartService = {
  /**
   * 장바구니 저장: 객체 형태의 ItemDetail도 JSON.stringify가 자동으로 처리해줍니다.
   */
  saveCart: (orderCounts: OrderCounts): void => {
    try {
      const serializableData = {
        products: Array.from(orderCounts.products.entries()),
        options: Array.from(orderCounts.options.entries()),
      };
      localStorage.setItem(CART_KEY, JSON.stringify(serializableData));
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
    }
  },

  /**
   * 장바구니 로드: 복원할 때도 Map<string, ItemDetail> 구조로 복원합니다.
   */
  getCartItems: (): OrderCounts => {
    try {
      const data = localStorage.getItem(CART_KEY);
      if (!data) return { products: new Map(), options: new Map() };

      const parsed = JSON.parse(data);

      const transformToMap = (entries: any[]) => {
        const newMap = new Map<string, ItemDetail>();
        entries.forEach(([name, value]) => {
            newMap.set(name, value);
        });
        return newMap;
      };

      return {
        products: transformToMap(parsed.products || []),
        options: transformToMap(parsed.options || []),
      };
    } catch (error) {
      console.error("장바구니 로드 실패:", error);
      return { products: new Map(), options: new Map() };
    }
  },

  // 결제 완료 후 비우기 및 주문번호 생성은 기존과 동일
  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  generateOrderNumber: (): string => {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HT-${dateString}-${randomString}`;
  }
};