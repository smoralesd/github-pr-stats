import { PullsListResponseItem } from '@octokit/rest';

import * as data from '../data/msft-ai-web-pulls.json';

export const readPulls = (): PullsListResponseItem[] => {
    return (data as unknown) as PullsListResponseItem[];
};
