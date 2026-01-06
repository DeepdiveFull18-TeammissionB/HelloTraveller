"use client";
import React, { ComponentProps } from 'react';
import { Text } from '@vapor-ui/core';

type VTextProps = ComponentProps<typeof Text>;

const VText: React.FC<VTextProps> = (props) => {
    return <Text {...props} />;
};

export default VText;
