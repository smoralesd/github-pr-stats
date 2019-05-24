import Octokit from "@octokit/rest";
import { pat } from "./pat";
import moment from "moment";

const client = new Octokit({
  auth: pat
});

const owner = 'microsoft';
const repo = 'accessibility-insights-web';

const days: number[] = [];

client.pulls.list({
    owner,
    repo,
    state: 'all',
    per_page: 100,
}).then(pulls => {
    // console.log(pulls);
    pulls.data.forEach(pull => {
        let age = 'NA';
        if (pull.state == 'closed') {
            const mergedAt = moment(pull.merged_at);
            const createdAt = moment(pull.created_at);
            age = (mergedAt.diff(createdAt, 'days')).toString();
            days.push(Number(age));
        }

        console.log('#', pull.number, 'user', pull.user.login, 'days', age);
    });

    const sum = days.reduce((accumulator, current) => accumulator + current,0);
    console.log("average", sum / days.length);
});