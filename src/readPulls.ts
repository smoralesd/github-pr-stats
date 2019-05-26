import { PullsListResponseItem } from '@octokit/rest';
import { readFileSync } from 'fs';

export const readPulls = (): PullsListResponseItem[] => {
    const data = readFileSync('data/msft-ai-web-pulls.json', {
        encoding: 'utf8',
    });

    return JSON.parse(data) as PullsListResponseItem[];
};
