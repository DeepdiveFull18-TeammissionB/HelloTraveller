"use client";
import React, { useContext } from 'react';
import {
  Text,
  Card,
  Button
} from '@vapor-ui/core';
import Type from '@/components/Type';
import SummaryPage from '@/components/SummaryPage';
import OrderContext from '@/context/OrderContext';

export default function Home() {
  const context = useContext(OrderContext);
  if (!context) return null;
  const [orderData] = context;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
          <Text typography="heading1" style={{ fontWeight: 800 }}>Hello Traveller</Text>
          <Text typography="body1" color="text-secondary">Vapor UI Native Layout 적용</Text>
        </div>

        {/* 메인 레이아웃: 왼쪽(투어상품) + 오른쪽(옵션+주문) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* 왼쪽: 투어 상품 */}
          <Card.Root style={{ padding: '1.5rem', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Text typography="heading3" style={{ fontWeight: 700 }}>투어 상품</Text>
              <Type orderType="products" />
            </div>
          </Card.Root>

          {/* 오른쪽: 옵션 + 주문 확인 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* 오른쪽 위: 추가 옵션 */}
            <Card.Root style={{ padding: '1.5rem', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Text typography="heading3" style={{ fontWeight: 700 }}>추가 옵션</Text>
                <Type orderType="options" />
              </div>
            </Card.Root>

            {/* 오른쪽 아래: 주문 확인 */}
            <Card.Root style={{ padding: '1.5rem', border: '1px solid #eee', position: 'sticky', top: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Text typography="heading3" style={{ fontWeight: 700 }}>주문 확인</Text>

                <div>
                  <SummaryPage />
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text typography="heading4">최종 금액</Text>
                    <Text typography="heading2" color="primary" style={{ fontWeight: 800 }}>
                      {orderData.totals.total.toLocaleString()}원
                    </Text>
                  </div>

                  <Button colorPalette="primary" size="xl" style={{ width: '100%', height: '56px' }}>
                    주문하기
                  </Button>
                </div>
              </div>
            </Card.Root>

          </div>
        </div>
      </div>
    </div>
  );
}
