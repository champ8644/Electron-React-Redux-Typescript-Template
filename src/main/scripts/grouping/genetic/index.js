import { formatDuration, intervalToDuration } from 'date-fns';
import { createWriteStream, writeFileSync } from 'fs';
import GeneticAlgorithmConstructor from 'geneticalgorithm';
import _ from 'lodash';

import { phenotypeToGrouping } from '../../utils';
import crossover from './crossover';
import fitness from './fitness';
import mutate from './mutate';
import seed from './seed';

export default function genetic(
  groupTemplate,
  options = {
    path: {
      log: 'src65/tissuebio/grouping/output/log.txt',
      out: 'src65/tissuebio/grouping/output/best.json'
    }
  }
) {
  const {
    path: { log: logPath, out: outPath }
  } = options;
  const population = _.range(100).map(() => seed(groupTemplate));

  const geneticAlgorithm = GeneticAlgorithmConstructor({
    mutationFunction: mutate,
    crossoverFunction: crossover,
    fitnessFunction: fitness,
    population
  });

  const stream = createWriteStream(logPath);

  const startTime = new Date();
  const maxI = 50000;
  let prevScore = 0;
  for (let i = 0; i <= maxI; i++) {
    geneticAlgorithm.evolve();
    if (i % 100 === 0) {
      const bestScore = geneticAlgorithm.bestScore();
      const endTime = new Date();
      const interval = {
        start: startTime,
        end: endTime
      };
      const timestring = formatDuration(intervalToDuration(interval));
      console.log(`Iteration ${i} at ${timestring}: ${bestScore}`);
      if (i % 100 === 0) stream.write(`Iteration ${i} at ${timestring}: ${bestScore}\n`);
      if (i % 1000 === 0) {
        if (prevScore === bestScore) break;
        prevScore = bestScore;
      }
    }
  }
  const best = geneticAlgorithm.best();
  const endTime = new Date();
  const interval = {
    start: startTime,
    end: endTime
  };
  const timestring = formatDuration(intervalToDuration(interval));
  const bestScore = geneticAlgorithm.bestScore();
  stream.write(`Finished in ${timestring}: ${bestScore}\n`);
  console.log(`Finished in ${timestring}: ${bestScore}`);
  stream.end();
  stream.close();
  const finalGroups = phenotypeToGrouping(best);
  writeFileSync(outPath, JSON.stringify(finalGroups, null, 2));

  // exec('shutdown -s -t 60');
}
