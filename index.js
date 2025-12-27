const core = require("@actions/core");

try {
    const message = core.getInput("message");
    console.log(`Message: ${message}`);
} catch (error) {
    core.setFailed(error.message);
}
