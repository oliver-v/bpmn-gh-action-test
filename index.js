const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    const token = core.getInput("github_token");
    const octokit = github.getOctokit(token);

    const { pull_request } = github.context.payload;
    const { owner, repo } = github.context.repo;
    const prNumber = pull_request.number;

    const files = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
    });

    let conclusion = 'success';
    let title = '✅ No Process model changes';

    const obj = {
        owner,
        repo,
        name: title,
        head_sha: github.context.payload.pull_request.head.sha,
        status: "completed",
        conclusion: conclusion
    };

    for (const file of files.data) {
        if (file.filename.includes('.bpmn')) {
            obj.conclusion = 'neutral'
            obj.name = "⚠️ ⚠️ ⚠️ Process model changes ⚠️ ⚠️ ⚠️";
            obj.output = {
                title: "Process model changes",
                summary: "<a href='https://flow-diff.vercel.app/diff'>Go to the details.</a>"
            };
        }
    }

    await octokit.rest.checks.create(obj);
}

run();
