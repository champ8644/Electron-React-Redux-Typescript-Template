import _ from 'lodash';

import { mapValuesTemplate } from '../../utils';

import type { GroupTemplate } from '../type';

export default function seed(groupTemplate: GroupTemplate): GroupTemplate {
  return mapValuesTemplate(groupTemplate, (val) => ({
    ...val,
    groupMap: _.shuffle(val.groupMap)
  }));
}
