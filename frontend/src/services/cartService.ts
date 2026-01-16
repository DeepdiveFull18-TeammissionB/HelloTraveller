"use client";

import { ItemDetail, OrderCounts } from "../types/order";

// Local interfaces removed as they are now imported from ../types/order

const CART_KEY = "hello_traveler_cart";
const ORDERS_KEY = "hello_traveler_orders";

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

  placeOrder: (orderDetail: any): void => {
    try {
      const existingOrdersData = localStorage.getItem(ORDERS_KEY);
      const orders = existingOrdersData ? JSON.parse(existingOrdersData) : [];

      // 주문 상태 기본값 추가
      const orderWithStatus = {
        ...orderDetail,
        status: 'confirmed'
      };

      orders.unshift(orderWithStatus);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("주문 저장 실패:", error);
    }
  },

  /**
   * 주문 상태 업데이트 (예: 예약 취소)
   */
  updateOrderStatus: (orderId: string, newStatus: 'confirmed' | 'canceled'): void => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return;

      let orders = JSON.parse(data);
      orders = orders.map((order: any) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );

      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
    }
  },

  /**
   * 주문 내역 삭제 (영구 삭제)
   */
  deleteOrder: (orderId: string): void => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return;

      let orders = JSON.parse(data);
      orders = orders.filter((order: any) => order.orderId !== orderId);

      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("주문 삭제 실패:", error);
    }
  },

  /**
   * 주문 목록 불러오기
   */
  getOrders: (): any[] => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }
};