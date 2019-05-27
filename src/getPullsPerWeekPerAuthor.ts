import { PullsListResponseItem } from '@octokit/rest';
import { chain, groupBy } from 'lodash';
import moment from 'moment';

export const getPullsPerWeekPerAuthor = (data: PullsListResponseItem[]) => {
    return chain(data)
        .groupBy(current => {
            const createdAt = moment(current.created_at);
            const dateFormat = 'YYYY-MM-DD';
            const weekStart = createdAt.startOf('week').format(dateFormat);
            const weekEnd = createdAt.endOf('week').format(dateFormat);

            return `${weekStart}---${weekEnd}`;
        })
        .mapValues(pulls => groupBy(pulls, current => current.user.login))
        .value();
};
