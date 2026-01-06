"use client";
import React, { ComponentProps } from 'react';
import { Card } from '@vapor-ui/core';

// Vapor UI의 Card는 Card.Root를 기반으로 하며, 타입 안전성을 위해 any 캐스팅을 활용합니다.
const VCard: React.FC<any> = (props) => {
    return <Card.Root {...props} />;
};

export default VCard;
