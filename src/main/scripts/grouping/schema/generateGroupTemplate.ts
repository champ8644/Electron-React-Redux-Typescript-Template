import { writeFileSync } from 'fs-extra';
import _ from 'lodash';

import type { Book, GroupCount, GroupLeaf, GroupList, GroupSchema, GroupTemplate } from '../type';

const verbose = false;

/**
 * 
/**
 * Make grouping key for nominal parameter
 * @param data options key from excel
 * @param priority priority options for making sorting
 * @returns [...keys] sorted by priority
 */
function makeGroupKey<
  K extends string,
  T extends Record<K, unknown>,
  U extends Record<K, number | null>
>(data: T, priority: U) {
  return _.chain(data)
    .pickBy(x => x === 'nominal')
    .keys()
    .map(key => [key, priority[key as K]])
    .sortBy(x => x[1])
    .map(x => x[0] as string)
    .value();
}

function makeGroupCount(
  data: Record<string, unknown>[],
  groupKey: string[],
  depth = 0
): GroupCount {
  const outputGroup = _.groupBy(data, groupKey[depth]);
  let length = 0;
  const output = _.mapValues(outputGroup, eachGroup => {
    if (depth + 1 === groupKey.length) {
      length += eachGroup.length;
      return eachGroup;
    }
    const groupCount = makeGroupCount(eachGroup, groupKey, depth + 1);
    length += groupCount.length as number;
    return groupCount;
  });
  return { ...output, length };
}

// function printGroupCount(groupCount: GroupCount): PrintedCount {
//   return _.mapValues(groupCount, eachGroup => {
//     if (_.isNumber(eachGroup)) return eachGroup;
//     if (Array.isArray(eachGroup)) return eachGroup.length;
//     return printGroupCount(eachGroup);
//   });
// }

/**
 *
 * @param numerator 304
 * @param denominator 20
 * @returns \{ '15': 16, '16': 4 }
 */
function divideByGroup(numerator: number, denominator: number) {
  const baseResult = Math.floor(numerator / denominator);
  const fraction = numerator % denominator;
  return {
    [baseResult]: denominator - fraction,
    ...(fraction > 0 && { [baseResult + 1]: fraction })
  };
}

/**
 * 
 * @param groupInitial \{ '15': 16, '16': 4 }
 * @returns \{
  '15': [
     0,  1,  2,  3,  4,  5,
     6,  7,  8,  9, 10, 11,
    12, 13, 14, 15
  ],
  '16': [ 16, 17, 18, 19 ]
}
 */
function makeInitialGroup(groupInitial: Record<string, number>): GroupList {
  let i = 0;
  return _.mapValues(groupInitial, val => {
    i += val;
    return _.range(i - val, i);
  });
}

/**
 * 
 * @param groupCount 
 * @param groupList 
 * @returns 
{
  "M": {
    "EN": {
      "CU": {
        "0": "[16,14,12]",
        "1": "[19,18,17,15,13,11,10,9,8,7,6,5,4,3,2,1,0]"
      }
    },
    "TH": {
      "CU": {
        "4": "[14,15,10,7,1,0]",
        "5": "[19,17,16,12,18,13,11,9,8,6,5,4,3,2]"
      },
      "BB": {
        "0": "[16,18,11,8,5,4,3,2,1,0]",
        "1": "[19,17,14,12,15,13,10,9,7,6]"
      },
      "CH": {
        "1": "[17,18,15,13,11,10,9,8,7,6,5,4,3,2,1,0]",
        "2": "[19,16,14,12]"
      },
      "PK": {
        "0": "[19,12,13,9,6]",
        "1": "[17,16,14,18,15,11,10,8,7,5,4,3,2]",
        "2": "[1,0]"
      }
    }
  },
  "F": {
    "EN": {
      "CU": {
        "0": "[17,15]",
        "1": "[18,19,16,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]"
      },
      "BB": {
        "0": "[19,16,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]",
        "1": "[18,17,15]"
      }
    },
    "TH": {
      "CU": {
        "3": "[18,15,12,9,7,6,5,4,3,2,1,0]",
        "4": "[16,19,17,14,13,11,10,8]"
      },
      "CH": {
        "0": "[19,17,13,10]",
        "1": "[16,18,15,14,12,11,9,8,7,6,5,4,3,2,1,0]"
      },
      "PK": {
        "1": "[19,17,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]",
        "2": "[16,18]"
      },
      "BB": {
        "0": "[16,18,14,11,8]",
        "1": "[19,17,15,13,12,10,9,7,6,5,4,3,2,1,0]"
      }
    }
  }
}
 */
function makeGroupSchema(
  groupCount: GroupCount,
  groupList: GroupList,
  groupNumber: number,
  path: Array<string> = []
): GroupSchema {
  /**
    [
      {
        key: 'M',
        length: 162,
        base: 8,
        reminder: 2
      },
      {
        key: 'F',
        length: 142,
        base: 7,
        reminder: 2
      }
    ]
   */
  const choiceOptions = _.chain(groupCount)
    .omit('length')
    .entries()
    .map(([key, val]) => {
      const { length } = val as { length: number };
      const base = Math.floor(length / groupNumber);
      const reminder = length % groupNumber;
      return { key, length, base, reminder };
    })
    .value();

  /**
   * [ { key: 'M', reminder: 2 }, { key: 'F', reminder: 2 } ]
   */
  const reminderMaps = choiceOptions.map(choiceOption => _.pick(choiceOption, ['key', 'reminder']));

  /**
   * [ 'M', 'F', 'M', 'F' ]
   */
  const reminderPool: Array<string> = [];
  let isEmpty = true;
  do {
    isEmpty = true;
    // eslint-disable-next-line no-loop-func
    reminderMaps.forEach(reminderMap => {
      if (reminderMap.reminder) {
        isEmpty = false;
        reminderPool.push(reminderMap.key);
        reminderMap.reminder--;
      }
    });
  } while (!isEmpty);

  const groupBase: Array<[number, Record<string, number>]> = [];
  _.forEach(groupList, (arr, key) => {
    arr.forEach(val => {
      const groupBaseOption: Record<string, number> = { max: Number(key), left: Number(key) };
      choiceOptions.forEach(choiceOption => {
        groupBaseOption[choiceOption.key] = choiceOption.base;
        groupBaseOption.left -= choiceOption.base;
      });
      groupBase.push([val, _.omit(groupBaseOption)]);
    });
  });
  /**
[
  [ 19, { max: 16, left: 1, M: 8, F: 7 } ],
  [ 18, { max: 16, left: 1, M: 8, F: 7 } ],
  [ 17, { max: 16, left: 1, M: 8, F: 7 } ],
  [ 16, { max: 16, left: 1, M: 8, F: 7 } ],
  [ 15, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 14, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 13, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 12, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 11, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 10, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 9, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 8, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 7, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 6, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 5, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 4, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 3, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 2, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 1, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 0, { max: 15, left: 0, M: 8, F: 7 } ]
]
   */
  groupBase.sort((a, b) => b[1].max - a[1].max || b[0] - a[0]);

  /**
[
  [ 19, { max: 16, left: 0, M: 9, F: 7 } ],
  [ 18, { max: 16, left: 0, M: 8, F: 8 } ],
  [ 17, { max: 16, left: 0, M: 9, F: 7 } ],
  [ 16, { max: 16, left: 0, M: 8, F: 8 } ],
  [ 15, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 14, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 13, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 12, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 11, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 10, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 9, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 8, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 7, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 6, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 5, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 4, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 3, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 2, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 1, { max: 15, left: 0, M: 8, F: 7 } ],
  [ 0, { max: 15, left: 0, M: 8, F: 7 } ]
]
   */
  groupBase.forEach(eachGroupBase => {
    const [, groupBaseOption] = eachGroupBase;
    while (groupBaseOption.left) {
      const popKey = reminderPool.shift();
      if (!popKey) throw "Pop key is undefined, this shouldn't happened";
      groupBaseOption[popKey]++;
      groupBaseOption.left--;
    }
  });

  /**
{
  M: {
    '8': [
      18, 16, 15, 14, 13, 12, 11,
      10,  9,  8,  7,  6,  5,  4,
       3,  2,  1,  0
    ],
    '9': [ 19, 17 ]
  },
  F: {
    '7': [
      19, 17, 15, 14, 13, 12, 11,
      10,  9,  8,  7,  6,  5,  4,
       3,  2,  1,  0
    ],
    '8': [ 18, 16 ]
  }
}
   */
  const nextGroupLists: Record<string, GroupList> = {};
  groupBase.forEach(eachGroupBase => {
    const [group, options] = eachGroupBase;
    _.forEach(options, (val, key) => {
      if (key === 'max' || key === 'left') return;
      if (!nextGroupLists[key]) nextGroupLists[key] = {};
      if (!nextGroupLists[key][val]) nextGroupLists[key][val] = [];
      nextGroupLists[key][val].push(group);
    });
  });

  return _.chain(groupCount)
    .omit('length')
    .mapValues((eachGroupCount, key) => {
      if (_.isNumber(eachGroupCount)) throw 'Length should be omitted already';
      if (_.isArray(eachGroupCount)) return nextGroupLists[key];
      return makeGroupSchema(eachGroupCount, nextGroupLists[key], groupNumber, [...path, key]);
    })
    .value();
}

function sanityCheck(
  groupCount: GroupCount | Array<Record<string, unknown>>,
  groupSchema: GroupSchema,
  payloadGroupCount: Record<string, number>,
  str = ''
) {
  // This is leaf
  if (_.isArray(groupCount)) {
    let summation = 0;
    _.forEach(groupSchema, (eachGroupSchema, key) => {
      const eachStr = `${str} ${key}`;
      if (!Array.isArray(eachGroupSchema))
        throw new Error(`At ${eachStr}: Leaf contains non-array`);
      summation += eachGroupSchema.length * Number(key);
      eachGroupSchema.forEach(group => {
        if (!payloadGroupCount[group]) payloadGroupCount[group] = 0;
        payloadGroupCount[group] += Number(key);
      });
    });
    if (summation !== groupCount.length) {
      throw new Error(
        `At ${str}: summation ${summation} is not equal groupCount ${groupCount.length}`
      );
    }
    verbose && console.log(`Correct counting at${str} (${summation} = ${groupCount.length})`);
    return;
  }
  // This is node
  const unionKey = _.union(_.keys(groupCount), _.keys(groupSchema)).filter(x => x !== 'length');
  unionKey.forEach(key => {
    const eachGroupSchema = groupSchema[key];
    const eachStr = `${str} ${key}`;
    if (!eachGroupSchema)
      throw new Error(`At ${eachStr}: eachGroupSchema is undefined, expected Object`);
    if (Array.isArray(eachGroupSchema)) {
      console.log('🚀 ~ file: importInput.ts ~ line 386 ~ sanityCheck ~ eachGroupSchema', {
        key,
        eachGroupSchema,
        groupCount,
        eachStr
      });
      throw new Error(`At ${eachStr}: eachGroupSchema is Array, expected Object`);
    }
    const eachGroupCount = groupCount[key];
    if (_.isNumber(eachGroupCount))
      throw new Error(`At ${eachStr}: eachGroupCount is Number, expected Object`);
    sanityCheck(eachGroupCount, eachGroupSchema, payloadGroupCount, eachStr);
  });
}

function sanityCheckMain(
  groupCount: GroupCount | Array<Record<string, unknown>>,
  groupSchema: GroupSchema,
  groupListInitial: GroupList
) {
  const payloadGroupCount: Record<string, number> = {};
  sanityCheck(groupCount, groupSchema, payloadGroupCount);
  _.forEach(groupListInitial, (groups, _count) => {
    const count = Number(_count);
    groups.forEach(group => {
      if (payloadGroupCount[group] !== count) {
        throw new Error(
          `Payload group count (${payloadGroupCount[group]}) is not equal count (${count}) at ${group}`
        );
      } else
        verbose && console.log(`Equal initial at ${group} (${payloadGroupCount[group]}=${count})`);
    });
  });
}

function makeGroupTemplate(
  groupCount: GroupCount | Array<Record<string, unknown>>,
  groupSchema: GroupSchema,
  path: Array<string> = []
): GroupTemplate | GroupLeaf {
  // This is leaf
  if (_.isArray(groupCount)) {
    const groupMap: Array<number> = [];
    _.forEach(groupSchema, (groups, amount) => {
      if (!_.isArray(groups))
        throw new Error('GroupSchema at Leaf is not Array, this is impossible');
      groups.forEach(group => {
        _.times(Number(amount)).forEach(() => groupMap.push(group));
      });
    });
    return {
      __leaf__: true,
      member: groupCount,
      schema: groupSchema,
      groupMap,
      key: path.join('.')
    };
  }
  // This is node
  return _.chain(groupSchema)
    .omit('length')
    .mapValues((eachGroupSchema, key) => {
      if (Array.isArray(eachGroupSchema))
        throw new Error(`eachGroupSchema is Array, expected Object, this is impossible`);
      const eachGroupCount = groupCount[key];
      if (_.isNumber(eachGroupCount)) throw new Error(`eachGroupCount is Number, expected Object`);
      return makeGroupTemplate(eachGroupCount, eachGroupSchema, [...path, key]);
    })
    .value();
}

/**
 * Get raw data to provide the group schema to be use by seed()
 * @param book Array of datas
 * @param dataType Type of each column
 * @param dataPriority Priority of each column
 * @param groupNumber Number of group needed
 * @returns GroupSchema
 */
export default function generateGroupTemplate(
  book: Book,
  dataType: Record<string, string>,
  dataPriority: Record<string, number | null>,
  groupNumber: number
): GroupTemplate {
  let groupKey: string[] | undefined;
  let groupCount: GroupCount | undefined;
  let groupListInitial: GroupList | undefined;
  let groupSchema: GroupSchema | undefined;
  let groupTemplate: GroupTemplate | undefined;
  try {
    groupKey = makeGroupKey(dataType, dataPriority);
    groupCount = makeGroupCount(book, groupKey);
    groupListInitial = makeInitialGroup(divideByGroup(book.length, groupNumber));
    groupSchema = makeGroupSchema(groupCount, groupListInitial, groupNumber);
    sanityCheckMain(groupCount, groupSchema, groupListInitial);
    groupTemplate = makeGroupTemplate(groupCount, groupSchema) as GroupTemplate;
    writeFileSync(
      'src65/tissuebio/grouping/schema/groupTemplate.json',
      JSON.stringify(groupTemplate, null, 2)
    );
    return groupTemplate;
  } catch (error: any) {
    writeFileSync(
      'src65/tissuebio/grouping/output/error.json',
      JSON.stringify(
        { groupKey, groupCount, groupListInitial, groupSchema, groupTemplate },
        null,
        2
      )
    );
    throw new Error(error);
  }
}
