import { Alignment, Classes, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import React from 'react';

import { version } from '../../../package.json';

export interface NavigationProps {}

export const Navigation: React.FC<NavigationProps> = () => (
  <Navbar className={Classes.DARK}>
    <NavbarGroup align={Alignment.LEFT}>
      <NavbarHeading>MDCU Genetical Grouping v.{version}</NavbarHeading>
      {/* <NavbarDivider /> */}
      {/* <AnchorButton
        href='http://blueprintjs.com/docs'
        text='Docs'
        target='_blank'
        minimal
        rightIcon='share'
      />
      <AnchorButton
        href='http://github.com/palantir/blueprint'
        text='Github'
        target='_blank'
        minimal
        rightIcon='code'
      /> */}
    </NavbarGroup>
  </Navbar>
);
