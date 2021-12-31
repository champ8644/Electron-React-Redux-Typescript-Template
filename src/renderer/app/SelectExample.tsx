import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useState } from 'react';

import MainCard from '../component/MainCard';
import { filterFilm, IFilm, renderFilm, TOP_100_FILMS } from './films';

const FilmSelect = Select.ofType<IFilm>();

export const SelectExample: React.FC = () => {
  const [film, setFilm] = useState<IFilm>(TOP_100_FILMS[0]);
  return (
    <MainCard header='Select Sandbox'>
      <FilmSelect
        items={TOP_100_FILMS}
        itemPredicate={filterFilm}
        itemRenderer={renderFilm}
        noResults={<MenuItem disabled={true} text='No results.' />}
        onItemSelect={setFilm}
      >
        <Button text={film.title} rightIcon='caret-down' />
      </FilmSelect>
    </MainCard>
  );
};
