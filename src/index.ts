import { forEach } from 'lodash';
import { getTimeStatsForPulls } from './getTimeStatsForPulls';
import { readPulls } from './readPulls';

const data = readPulls();

const result = getTimeStatsForPulls(data);

forEach(result, (pulls, yearMonth) => console.log(yearMonth, pulls));
