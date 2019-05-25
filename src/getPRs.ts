import Octokit from "@octokit/rest";
import { writeFileSync } from "fs";

import { pat } from "./pat";

export const getPRs = () => {
  const client = new Octokit({
    auth: pat
  });

  const owner = "microsoft";
  const repo = "accessibility-insights-web";

  const options = client.pulls.list.endpoint.merge({ owner, repo, state: 'all' });
  client.paginate(options).then(pulls => {
    writeFileSync("data/msft-ai-web-pulls.json", JSON.stringify(pulls, null, 4), {
      encoding: "utf8"
    });
  });
};
