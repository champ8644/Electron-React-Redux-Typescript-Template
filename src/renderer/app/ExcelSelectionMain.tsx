import { Button } from '@blueprintjs/core';
import React, { useState } from 'react';

import Bridge from '../bridge';
import MainCard from '../component/MainCard';

export const ExcelSelectionMain: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<number>(8);
  return (
    <MainCard header='Excel Selector'>
      <Button intent='primary' text='Choose File' onClick={() => Bridge.call?.excelImport()} />
      {/* <ButtonGroup>
        <Button intent={Intent.PRIMARY} text='Primary' />
        <Button intent={Intent.WARNING} text='Warning' />
        <Button intent={Intent.SUCCESS} text='Success' />
        <Button intent={Intent.DANGER} text='Danger' />
      </ButtonGroup> */}
      {/* <br />
      <br />

      <KeyCombo combo='mod' />
      <br />

      <Slider min={0} max={11} onChange={setSliderValue} value={sliderValue} /> */}
    </MainCard>
  );
};
