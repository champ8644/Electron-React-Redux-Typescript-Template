import _ from 'lodash';

import { pickRandomLeaf, randomPickFromArray, swap } from '../../utils';

import type { GroupTemplate } from '../type';

export default function mutate(phenotype: GroupTemplate) {
  const leaf = pickRandomLeaf(phenotype);
  const { groupMap } = leaf;
  if (groupMap.length < 2) return phenotype;
  const uniqueMap = _.uniq(groupMap).reduce((state, next) => {
    state[next] = [];
    return state;
  }, {} as Record<string, number[]>);
  groupMap.forEach((group, idx) => uniqueMap[group].push(idx));
  const pickUniqueMap = _.mapValues(uniqueMap, (val) => randomPickFromArray(val));
  const [firstPick, secondPick] = _.shuffle(_.entries(pickUniqueMap));
  swap(groupMap, Number(firstPick[1]), Number(secondPick[1]));
  return phenotype;
}

/** GroupMap
[
  17, 16, 14, 18, 15, 11, 10,
   8,  7,  5,  4,  3,  2,  1,
   1,  0,  0
]
*/

/** uniqueMap
{
  '0': [ 15, 16 ],
  '1': [ 13, 14 ],
  '2': [ 12 ],
  '3': [ 11 ],
  '4': [ 10 ],
  '5': [ 9 ],
  '7': [ 8 ],
  '8': [ 7 ],
  '10': [ 6 ],
  '11': [ 5 ],
  '14': [ 2 ],
  '15': [ 4 ],
  '16': [ 1 ],
  '17': [ 0 ],
  '18': [ 3 ]
}
*/

/** pickUniqueMap
{
  '0': 16,
  '1': 15,
  '2': 14,
  '3': 13,
  '4': 12,
  '5': 11,
  '6': 10,
  '7': 9,
  '8': 8,
  '9': 7,
  '10': 6,
  '11': 5,
  '13': 4,
  '15': 3,
  '17': 2,
  '18': 1,
  '19': 0
}
*/

/** firstPick, secondPick
[ [ '6', 9 ] [ '7', 8 ] ]
*/
