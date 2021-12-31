import { openSingleBook } from '../utils/xlsx';
import genetic from './genetic';
import generateGroupTemplate from './schema/generateGroupTemplate';

const dataType = {
  num: 'description',
  id: 'description',
  EN: 'nominal',
  local: 'nominal',
  sex: 'nominal',
  prefix: 'description',
  firstName: 'description',
  lastName: 'description',
  score: 'continuous'
};

const dataPriority = {
  num: null,
  id: null,
  EN: 2,
  local: 3,
  sex: 1,
  prefix: null,
  firstName: null,
  lastName: null,
  score: 1
};

const groupNumber = 10;

export function main() {
  const book = openSingleBook<Record<string, unknown>>(
    'src65/tissuebio/grouping/input/data.xlsx'
  ).filter((each) => (each as { num: number }).num % 2 === 1);
  const groupTemplate = generateGroupTemplate(book, dataType, dataPriority, groupNumber);
  console.log('🚀 ~ file: index.ts ~ line 37 ~ main ~ groupTemplate', groupTemplate);
  genetic(groupTemplate, {
    path: {
      log: 'src65/tissuebio/grouping/output/log.txt',
      out: 'src65/tissuebio/grouping/output/best2.json'
    }
  });
}

main();
