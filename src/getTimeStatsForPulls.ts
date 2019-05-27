import { PullsListResponseItem } from '@octokit/rest';
import { chain, isEmpty, reduce } from 'lodash';
import moment from 'moment';

const isMerged = (pull: PullsListResponseItem) =>
    pull.state == 'closed' && !isEmpty(pull.merged_at);

type Mapped = {
    id: number;
    yearMonth: string;
    range: string;
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
    [range: string]: Stats;
};

export const getTimeStatsForPulls = (data: PullsListResponseItem[]) => {
    return chain(data)
        .filter(isMerged)
        .map(current => {
            const dateFormat = 'YYYY-MM-DD';

            const createdAt = moment(current.created_at);

            const createdWeekStart = createdAt
                .startOf('week')
                .format(dateFormat);
            const createdWeekEnd = createdAt.endOf('week').format(dateFormat);

            const mergedAt = moment(current.merged_at);
            const diff = mergedAt.diff(createdAt);
            const result: Mapped = {
                id: current.id,
                yearMonth: createdAt.format('YYYY-MM'),
                range: `${createdWeekStart}---${createdWeekEnd}`,
                createdAt: current.created_at,
                closedAt: current.closed_at,
                age: moment.duration(diff).asDays(),
            };
            return result;
        })
        .groupBy(current => current.range)
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
