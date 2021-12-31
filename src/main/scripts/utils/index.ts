import _, { Dictionary } from 'lodash';

import type { FinalGroup, GroupLeaf, GroupTemplate, RecursiveObject } from '../grouping/type';

export function forEachTemplate(
  groupTemplate: GroupTemplate,
  func: (val: GroupLeaf, key: string) => void,
  path: Array<string> = []
) {
  _.forEach(groupTemplate, (val, key) => {
    const nextPath = [...path, key];
    if (isLeaf(val)) func(val, nextPath.join('.'));
    else forEachTemplate(val, func, nextPath);
  });
}

export function mapValuesTemplate<T>(
  groupTemplate: GroupTemplate,
  func: (val: GroupLeaf, key: string) => T,
  path: Array<string> = []
): RecursiveObject<T> {
  return _.mapValues(groupTemplate, (val, key) => {
    const nextPath = [...path, key];
    if (isLeaf(val)) return func(val, nextPath.join('.'));
    return mapValuesTemplate(val, func, nextPath);
  });
}

export function isLeaf(value: GroupTemplate | GroupLeaf): value is GroupLeaf {
  return !!value.__leaf__;
}

export function pickRandomLeaf(node: GroupTemplate | GroupLeaf): GroupLeaf {
  if (isLeaf(node)) return node;
  return pickRandomLeaf(randomPickFromObject(node));
}

export function randomPickFromObject<T>(obj: Record<string, T>) {
  const keys = _.keys(obj);
  const randomIndex = _.random(keys.length - 1);
  return obj[keys[randomIndex]];
}

export function randomPickFromArray<T>(arr: Array<T>) {
  const randomIndex = _.random(arr.length - 1);
  return arr[randomIndex];
}

export function swap(obj: Dictionary<any>, firstIdx: number, secondIdx: number) {
  const t = obj[firstIdx];
  obj[firstIdx] = obj[secondIdx];
  obj[secondIdx] = t;
}

export function phenotypeToGrouping(phenotype: GroupTemplate) {
  const finalGroup: FinalGroup = [];
  forEachTemplate(phenotype, (val) => {
    const { groupMap, member } = val;
    groupMap.forEach((group, idx) => {
      if (!finalGroup[group]) finalGroup[group] = [];
      finalGroup[group].push(member[idx]);
    });
  });
  finalGroup.forEach((eachGroup) =>
    eachGroup.sort((a, b) => (a.num as number) - (b.num as number))
  );
  return finalGroup;
}

// const isGetter = (x, name) => (Object.getOwnPropertyDescriptor(x, name) || {}).get;
// const isFunction = (x, name) => typeof x[name] === 'function';
// const deepFunctions = (x) =>
//   x &&
//   x !== Object.prototype &&
//   Object.getOwnPropertyNames(x)
//     .filter((name) => isGetter(x, name) || isFunction(x, name))
//     .concat(deepFunctions(Object.getPrototypeOf(x)) || []);
// const distinctDeepFunctions = (x) => Array.from(new Set(deepFunctions(x)));
// export const userFunctions = (x) =>
//   distinctDeepFunctions(x).filter((name) => name !== 'constructor' && !name.indexOf('__'));

// example usage

// class YourObject {
//   hello() { return "uk"; }
//   goodbye() { return "eu"; }
// }

// class MyObject extends YourObject {
//   hello() { return "ie"; }
//   get when() { return "soon"; }
// }

// const obj = new MyObject();
// console.log( userFunctions( obj ) ); // [ "hello", "when", "goodbye" ]
