import { PullsListResponseItem } from '@octokit/rest';
import { chain, isEmpty, reduce } from 'lodash';
import moment from 'moment';

const isMerged = (pull: PullsListResponseItem) =>
    pull.state == 'closed' && !isEmpty(pull.merged_at);

type Mapped = {
    id: number;
    yearMonth: string;
    createdAt: string;
    closedAt: string;
    age: number;
};

export type Stats = {
    min: number;
    max: number;
    sum: number;
    count: number;
    avg: number;
};

export type TimeStatsForPulls = {
    [yearMonth: string]: Stats;
};

export const getTimeStatsForPulls = (data: PullsListResponseItem[]) => {
    return chain(data)
        .filter(isMerged)
        .map(current => {
            const createdAt = moment(current.created_at);
            const mergedAt = moment(current.merged_at);
            const diff = mergedAt.diff(createdAt);
            return {
                id: current.id,
                yearMonth: createdAt.format('YYYY-MM'),
                createdAt: current.created_at,
                closedAt: current.closed_at,
                age: moment.duration(diff).asDays(),
            } as Mapped;
        })
        .groupBy(current => current.yearMonth)
        .mapValues(pulls =>
            reduce(
                pulls,
                (acc, current) => {
                    if (current.age < acc.min) {
                        acc.min = current.age;
                    }

                    if (current.age > acc.max) {
                        acc.max = current.age;
                    }

                    acc.sum += current.age;
                    acc.count++;

                    return acc;
                },
                {
                    min: Infinity,
                    max: 0,
                    sum: 0,
                    count: 0,
                    avg: 0,
                } as Stats
            )
        )
        .mapValues(sum => {
            sum.avg = sum.sum / sum.count;
            return sum;
        })
        .value();
};
