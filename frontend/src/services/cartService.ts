"use client";

import { ItemDetail, OrderCounts, CustomerInfo } from "../types/order";
import apiClient from "./apiClient";

// Local interfaces removed as they are now imported from ../types/order

const CART_KEY = "hello_traveler_cart";
const ORDERS_KEY = "hello_traveler_orders";
const CUSTOMER_KEY = "hello_traveler_customer";

// 저장된 주문 데이터 인터페이스
export interface SavedOrder {
  orderId: string;
  orderNo?: string; // 추가
  items: Array<ItemDetail & { name: string; type?: string }>;
  date: string;
  totalAmount: number;
  totalCount?: number; // 추가 (인원수)
  status: 'confirmed' | 'canceled';
  customerInfo?: CustomerInfo;
}

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

      const transformToMap = (entries: [string, ItemDetail][]): Map<string, ItemDetail> => {
        const newMap = new Map<string, ItemDetail>();
        // Filter out items with count <= 0 when loading the cart
        entries.filter(([, item]) => item.count > 0).forEach(([name, value]) => {
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

  placeOrder: (orderDetail: Omit<SavedOrder, 'status'>): void => {
    try {
      const existingOrdersData = localStorage.getItem(ORDERS_KEY);
      const orders: SavedOrder[] = existingOrdersData ? JSON.parse(existingOrdersData) : [];

      const orderWithStatus: SavedOrder = {
        ...orderDetail,
        status: 'confirmed'
      };

      orders.unshift(orderWithStatus);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      // NEW: 백엔드 DynamoDB에 동기화
      // NOTE: 백엔드 동기화 (신규 CRM 경로 반영 /api/v1/orders)
      apiClient.post('/api/v1/orders', {
        orderNo: orderWithStatus.orderId, // HT-XXXX 번호
        customerName: orderWithStatus.customerInfo?.name,
        customerEmail: orderWithStatus.customerInfo?.email,
        customerPhone: orderWithStatus.customerInfo?.phone,
        productName: orderWithStatus.items[0]?.name || '여행 상품',
        price: orderWithStatus.totalAmount,
        personCount: orderDetail.totalCount || 1,
        startDate: (orderWithStatus.items[0] as ItemDetail & { startDate?: string })?.startDate,
        endDate: (orderWithStatus.items[0] as ItemDetail & { endDate?: string })?.endDate
      }).catch(err => console.error("DB Sync failed:", err));

    } catch (error) {
      console.error("주문 저장 실패:", error);
    }
  },

  /**
   * 주문 상태 업데이트 (예: 예약 취소)
   */
  updateOrderStatus: async (orderId: string, newStatus: 'confirmed' | 'canceled'): Promise<void> => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return;

      const orders: SavedOrder[] = JSON.parse(data);
      const targetOrder = orders.find(o => o.orderId === orderId);

      if (targetOrder) {
        targetOrder.status = newStatus;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        // 백엔드 동기화 (신규 CRM 경로 반영)
        await apiClient.post('/api/v1/orders', {
          orderNo: targetOrder.orderId,
          customerName: targetOrder.customerInfo?.name,
          customerEmail: targetOrder.customerInfo?.email,
          status: targetOrder.status
        });
      }
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
    }
  },

  /**
   * 주문 내역 삭제 (영구 삭제)
   */
  deleteOrder: async (orderId: string): Promise<void> => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return;

      const orders: SavedOrder[] = JSON.parse(data);
      const filteredOrders = orders.filter((order) => order.orderId !== orderId);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));

      // 백엔드 삭제 요청 (필요 시 구현, 현재는 경로만 맞춤)
      // await apiClient.delete(`/api/v1/orders/${orderId}`);
    } catch (error) {
      console.error("주문 삭제 실패:", error);
    }
  },

  /**
   * 주문 목록 서버에서 불러오기 (DB -> LocalStorage 동기화)
   */
  fetchOrdersFromBackend: async (): Promise<SavedOrder[]> => {
    try {
      // 신규 CRM API를 통한 비회원 주문 조회 로직으로 복구 (필요시 구현)
      // 현재는 로컬 데이터를 우선시하되 에러 로그를 남기지 않도록 처리
      return [];
    } catch (error) {
      console.error("백엔드 주문 불러오기 실패:", error);
      return [];
    }
  },

  /**
   * 주문 목록 불러오기 (동기)
   */
  getOrders: (): SavedOrder[] => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * 예약자 정보 저장
   */
  saveCustomerInfo: (info: { name: string; email: string }): void => {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(info));
  },

  /**
   * 예약자 정보 로드
   */
  getCustomerInfo: (): CustomerInfo => {
    const data = localStorage.getItem(CUSTOMER_KEY);
    return data ? JSON.parse(data) : { name: '', email: '', phone: '' };
  }
};
