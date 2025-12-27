const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const token = core.getInput("github_token");
        const octokit = github.getOctokit(token);

        // The workflow is triggered by a pull_request event
        const { pull_request } = github.context.payload;

        if (!pull_request) {
            core.setFailed("This workflow must be triggered by a pull request.");
            return;
        }

        const { owner, repo } = github.context.repo;
        const prNumber = pull_request.number;

        const files = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: prNumber,
        });

        for (const file of files.data) {
            if (file.filename.includes('.bpmn')) {
                await octokit.rest.checks.create({
                    owner,
                    repo,
                    name: "BPMN Diagram Preview",
                    head_sha: github.context.payload.pull_request.head.sha,
                    status: "completed",
                    conclusion: "neutral",
                    details_url: detailsUrl,
                    output: {
                        title: "Interactive BPMN Diagram",
                        summary:
                            "Click **Details** to open the interactive BPMN viewer.\n\n" +
                            "Changes are based on the current pull request.",
                    },
                });

                core.info("Process model contains changes. Check the details.");
            }
            console.log(`${file.status}: ${file.filename}`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
