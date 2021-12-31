import { writeFileSync } from 'fs-extra';
import { mean, standardDeviation, variance } from 'simple-statistics';

import { phenotypeToGrouping } from '../../utils';

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import type { GroupTemplate } from '../type';

export default function fitness(phenotype: GroupTemplate) {
  try {
    var finalGroups = phenotypeToGrouping(phenotype);
    var averagedScore = finalGroups.map((finalGroup) =>
      mean(finalGroup.map((each) => each.score as number))
    );
    var overallMeanVariance = variance(averagedScore);
    var stdScore = finalGroups.map((finalGroup) =>
      standardDeviation(finalGroup.map((each) => each.score as number))
    );
    var overallStdVariance = variance(stdScore);
    return -(5 * overallMeanVariance + overallStdVariance);
  } catch (error) {
    console.error(error);
    // @ts-ignore
    console.log({ N: finalGroups.null, finalGroups, averagedScore, overallVariance });
    writeFileSync(
      'src65/tissuebio/grouping/genetic/fitnessError.json',
      // @ts-ignore
      JSON.stringify(phenotype, null, 2)
    );
    throw error;
  }
}
