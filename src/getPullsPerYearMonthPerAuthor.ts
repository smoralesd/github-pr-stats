import { PullsListResponseItem } from '@octokit/rest';
import { chain, groupBy } from 'lodash';
import moment from 'moment';

export const getPullsPerYearMonthPerAuthor = (
    data: PullsListResponseItem[]
) => {
    return chain(data)
        .groupBy(current => moment(current.created_at).format('YYYY-MM'))
        .mapValues(pulls => groupBy(pulls, current => current.user.login))
        .value();
};
