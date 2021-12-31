import { FocusStyleManager } from '@blueprintjs/core';
import React from 'react';

import { CoreExample } from './CoreExample';
import { ExcelSelectionMain } from './ExcelSelectionMain';
import { Navigation } from './Navigation';
import { Popover2Example } from './Popover2Example';
import { SelectExample } from './SelectExample';

FocusStyleManager.onlyShowFocusOnTabs();

export default function App() {
  return (
    <div>
      <Navigation />
      <ExcelSelectionMain />
      <CoreExample />
      <SelectExample />
      <Popover2Example />
    </div>
  );
}
