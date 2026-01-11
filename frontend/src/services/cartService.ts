"use client";

// Context에서 사용하는 타입을 그대로 가져옵니다.
type OrderType = "products" | "options";

interface OrderCounts {
  products: Map<string, number>;
  options: Map<string, number>;
}

const CART_KEY = "hello_traveler_cart";

export const cartService = {

  saveCart: (orderCounts: OrderCounts): void => {
    try {
      // Map은 바로 JSON이 안 되므로 [Key, Value] 형태의 배열로 변환
      const serializableData = {
        products: Array.from(orderCounts.products.entries()),
        options: Array.from(orderCounts.options.entries()),
      };
      localStorage.setItem(CART_KEY, JSON.stringify(serializableData));
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
    }
  },

  getCartItems: (): OrderCounts => {
    try {
      const data = localStorage.getItem(CART_KEY);
      if (!data) return { products: new Map(), options: new Map() };

      const parsed = JSON.parse(data);

      return {
        products: new Map(parsed.products),
        options: new Map(parsed.options),
      };
    } catch (error) {
      console.error("장바구니 로드 실패:", error);
      return { products: new Map(), options: new Map() };
    }
  },


  // 결제 완료 후 장바구니 비우기
  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  // 주문번호 생성
  generateOrderNumber: (): string => {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HT-${dateString}-${randomString}`;
  }
};