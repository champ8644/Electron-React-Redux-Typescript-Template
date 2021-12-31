import { Card, H3 } from '@blueprintjs/core';
import React from 'react';

export interface MainCardProps {
  header: string;
}

const MainCard: React.FC<MainCardProps> = (props) => (
  <Card className='example-card'>
    <H3>{props.header}</H3>
    {props.children}
  </Card>
);

export default MainCard;
