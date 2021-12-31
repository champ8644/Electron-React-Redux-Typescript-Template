import _ from 'lodash';

import { pickRandomLeaf } from '../../utils';

import type { GroupLeaf, GroupTemplate } from '../type';

export default function crossover(phenotypeA: GroupTemplate, phenotypeB: GroupTemplate) {
  const leaf = pickRandomLeaf(phenotypeA);
  const { key } = leaf;
  const leaf2 = _.at(phenotypeB, key)[0] as GroupLeaf;
  const t = leaf.groupMap;
  leaf.groupMap = leaf2.groupMap;
  leaf2.groupMap = t;
  return [phenotypeA, phenotypeB];
}
