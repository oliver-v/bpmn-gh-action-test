const core = require("@actions/core");

try {
    const message = core.getInput("message");
    console.log(`Message from GH action: ${message}`);
} catch (error) {
    core.setFailed(error.message);
}
