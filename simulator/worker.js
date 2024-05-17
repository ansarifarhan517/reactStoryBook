const { workerData, parentPort } = require('worker_threads');
const runner = require("./runner.js");

async function runWorkerScript() {
    const { runConfig, clientId } = workerData;

    await runner.runNewman(runConfig, clientId, customCallBack)
        .then(result => {
            parentPort.postMessage(result);
        })
        .catch(error => {
            parentPort.postMessage({ error });
        });
}
const customCallBack = (summary) => {
    console.log(summary, "callbakc console")
}

runWorkerScript()


