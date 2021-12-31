import _ from 'lodash';
import { mean, standardDeviation } from 'simple-statistics';

import { writeBooks } from '../../utils/xlsx';
import best1 from '../output/best1.json';
import best2 from '../output/best2.json';

interface Merge {
  member: Array<Record<string, unknown>>;
  num: Array<number>;
  numStr: string;
  avg: number;
  SD: number;
  M: number;
  F: number;
  CU: number;
  CH: number;
  BB: number;
  PK: number;
  EN: number;
  TH: number;
  V: number;
  group: number;
  length: number;
  [k: string]: unknown;
}

export default function generateOutput() {
  const best: Array<Array<Record<string, unknown>>> = [];
  for (let i = 0; i < 10; i++) {
    best.push(best2[i]);
    best.push(best1[i]);
  }
  const average = best.map((each) => ({ avg: mean(each.map((x) => x.score as number)) }));
  const SD = best.map((each) => ({ SD: standardDeviation(each.map((x) => x.score as number)) }));
  const sex = best.map((each) => _.countBy(each.map((x) => x.sex)));
  const local = best.map((each) => _.countBy(each.map((x) => x.local)));
  const EN = best.map((each) => _.countBy(each.map((x) => x.EN)));
  const member = best.map((each) => ({ member: each }));
  const num = best.map((each) => ({ num: each.map((x) => x.num) }));
  const numStr = best.map((each) => ({ numStr: each.map((x) => x.num).join() }));
  const groupIdx = _.range(1, 21).map((x) => ({ group: x }));
  const length = best.map((each) => ({ length: each.length }));
  const merge: Merge[] = _.merge(
    member,
    num,
    numStr,
    average,
    SD,
    sex,
    local,
    EN,
    groupIdx,
    length
  );

  const bestExport = _.sortBy(
    _.flatten(
      best.map((eachGroup, idxGroup) =>
        eachGroup.map((eachStudent) => ({
          ...eachStudent,
          group: idxGroup + 1
        }))
      )
    ),
    (val) => (val as unknown as { num: number }).num
  );
  const bestExportByGroup = _.sortBy(bestExport, (val) => val.group);
  const headerBest: Array<string> = [
    'EN',
    'local',
    'sex',
    'num',
    'id',
    'prefix',
    'firstName',
    'lastName',
    'score',
    'group'
  ];
  const headerMerge: Array<string> = [
    'group',
    'numStr',
    'length',
    'avg',
    'SD',
    'M',
    'F',
    'EN',
    'V',
    'TH',
    'CU',
    'CH',
    'BB',
    'PK'
  ];
  writeBooks(
    'src65/tissuebio/grouping/output/MDCU77.xlsx',
    [bestExport, bestExportByGroup, merge],
    [
      { header: headerBest, title: 'Student by Id' },
      { header: headerBest, title: 'Student by Group' },
      { header: headerMerge, title: 'Group Analysis' }
    ]
  );
}

generateOutput();
