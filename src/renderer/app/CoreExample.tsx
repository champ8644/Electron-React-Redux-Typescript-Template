import { Button, ButtonGroup, Intent, KeyCombo, Slider } from '@blueprintjs/core';
import React, { useState } from 'react';

import MainCard from '../component/MainCard';

export const CoreExample: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<number>(8);
  return (
    <MainCard header='Core Sandbox'>
      <ButtonGroup>
        <Button intent={Intent.PRIMARY} text='Primary' />
        <Button intent={Intent.WARNING} text='Warning' />
        <Button intent={Intent.SUCCESS} text='Success' />
        <Button intent={Intent.DANGER} text='Danger' />
      </ButtonGroup>
      <br />
      <br />

      <KeyCombo combo='mod' />
      <br />

      <Slider min={0} max={11} onChange={setSliderValue} value={sliderValue} />
    </MainCard>
  );
};
