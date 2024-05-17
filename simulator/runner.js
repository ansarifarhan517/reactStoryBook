const path = require('path');
const fs = require('fs');
const parseCsvSync = require("./csvReader.js")

const newman = require('newman'); // require newman in your project
const { prepareEnvironment, updateEnvironmentVars } = require("./environment.js");

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
// function hasReachedMaxTime(startTime, maxTime) {
//     const elapsedTime = (Date.now() - startTime) / 60000; // Convert milliseconds to minutes
//     return elapsedTime >= maxTime;
// }

async function runFolder(runConfig, folderToRun, clientId, threadsInfo, resultCallback) {
    // call newman.run to pass `options` object and wait for callback

    return new Promise((resolve, reject) => {
        options = {
            cwd: runConfig.path,
            collection: path.join(runConfig.collectionsPath, runConfig.collection),
            environment: runConfig.environmentData,
            folder: folderToRun.folder,
            timeout: folderToRun.timeout || runConfig.timeout,
            delayRequest: folderToRun.delay,
            verbose: true
        }
        if (folderToRun.iterationData) {
            // For each iteration we only pass one data point. (batchSize = 1)
            // The runCount is the current iteration number. If runCount count exceeds we restart from 0.
            rowNumber = runConfig.runCount % folderToRun.iterationData.length
            options.iterationData = [folderToRun.iterationData[rowNumber]]
        }
        if (!(runConfig.silent)) {
            if (runConfig.debug) {
                options.reporters = ['cli', 'json']
            } else {
                options.reporters = ['json']
            }
            options.reporter = { json: { export: path.join(runConfig.reportPath, `${folderToRun.folder}.json`) } }
        }

        // if (hasReachedMaxTime(runConfig.starttime, runConfig.maxTime)) {
        //     console.log('Max time reached. Ending simulation.');
        //     // Perform actions to end the simulation here...
        // }
        const request_starttime = new Date();
        //push records to mysql of starttime of threads with its parent thread
        newman.run(options, async function (err, summary) {
            const request_endtime = new Date();
            let resultCallbackArguments = {
                threadsInfo,
                request_starttime,
                request_endtime,
                err,
                runConfig,
                clientId,
                folderToRun,
                summary,
            }
            try {
                const callbackResult = await resultCallback(resultCallbackArguments);
                resolve(callbackResult);
            } catch (error) {
                console.error('Error in resultCallback:', error);
                reject(error);
            }
        })
    });
}

async function preLoadData(runConfig, stepsSection) {
    try {
        for (const folder of Object.keys(stepsSection)) {
            folderToRun = runConfig.steps[folder]
            if (folderToRun.data) {
                iterationDataFile = path.resolve(runConfig.path, runConfig.dataPath, folderToRun.data)
                iterationData = parseCsvSync(iterationDataFile);

                if (iterationData.length == 0) {
                    console.log(`In valid or no data for ${folder} file: ${iterationDataFile}`)
                    console.log('Open the file in CSV and do save as again.')
                    throw new Error(`In valid or no data for ${folder} file: ${iterationDataFile}`);
                }
                runConfig.steps[folder].iterationData = iterationData
                console.log(`Loaded data for folder ${folderToRun.folder} [${folderToRun.data}] : length = ${runConfig.steps[folder].iterationData.length}`)
            } else {
                runConfig.steps[folder].iterationData = false
            }
        }
        return runConfig
    } catch (error) {
        console.error('Newman run encountered an error: ', error);
        throw error
    }
}

async function initCollection(runConfig, clientId, threadsInfo, resultCallback) {
    try {
        globalConfig = require(runConfig.globalConfigPath)
        runConfig = { ...globalConfig, ...runConfig }

        if (!runConfig.testSuite) {
            throw new Error("Testsuite is not defined in Runfile")
        }
        testSuite = require(path.resolve(runConfig.testSuitesPath, runConfig.testSuite))
        runConfig = { ...runConfig, ...testSuite }

        env = await prepareEnvironment(runConfig, clientId)
        runConfig = { ...runConfig, ...env }
        if (runConfig.iterations == "Infinity") {
            runConfig.iterations = Infinity
        }

        runConfig.reports = path.resolve(runConfig.reports, String(runConfig.sessionId), `${clientId}`)
        runConfig = await runPreSteps(runConfig, clientId, threadsInfo, resultCallback)

        /* We preload all data only if preSteps have been successful */
        runConfig = await preLoadData(runConfig, runConfig.steps)

        return runConfig
    } catch (error) {
        console.error('Newman collection failed to launch:: error: ', error);
        throw error
    }
}

/************************************************************************************************************************************
 runStep and runStepInBackground executes one step out of the collection at a time.
 runStep - proesses executes each folder sequentially and executes all folders one by one for each iteration
 runStepsInBackground - executes folders in background and follows through all itertion of a folder before proceeding to the next one
 runPreSteps runs all steps of preSteps stage; and is always sequential even if the rest of the collection is executed in background
************************************************************************************************************************************/
async function runPreSteps(runConfig, clientId, threadsInfo, resultCallback) {
    if (runConfig.preSteps) {
        console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] [Iteration: ${runConfig.runCount}] Running preSteps `)
        runConfig = await preLoadData(runConfig, runConfig.preSteps)
        for (const folder of Object.keys(runConfig.preSteps)) {
            folderToRun = runConfig.preSteps[folder]
            runConfig.reportPath = path.resolve(runConfig.reports, `${runConfig.runCount}`)
            envVars = await runFolder(runConfig, folderToRun, clientId, threadsInfo, resultCallback)
            runConfig.environmentData = updateEnvironmentVars(runConfig, envVars)
        }
    }
    return runConfig
}

async function runSteps(runConfig, clientId, threadsInfo, resultCallback) {
    envValues = []
    for (const folder of Object.keys(runConfig.steps)) {
        folderToRun = runConfig.steps[folder]
        folderName = folderToRun.folder
        console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] [Iteration: ${runConfig.runCount}] Executing Folder [${folderName}] `)
        runConfig.reportPath = path.resolve(runConfig.reports, `${runConfig.runCount}`)
        envVars = await runFolder(runConfig, folderToRun, clientId, threadsInfo, resultCallback)
        runConfig.environmentData = updateEnvironmentVars(runConfig, envVars)
    }
    return envValues
}

async function runStepsInBackground(runConfig, folderToRun, clientId, threadsInfo, resultCallback) {
    let folderName = folderToRun.folder
    let folderRunCount = 0

    const queue = [];
    const isSettled = [];

    let delay = folderToRun.delay || runConfig.delay
    let timeout = folderToRun.timeout || runConfig.timeout
    let maxQueueSize = timeout / delay
    console.log(`delay: ${delay}, timeout: ${timeout} maxQueueSize: ${maxQueueSize}`)

    while (folderRunCount < runConfig.iterations) {
        console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] [Iteration: ${folderRunCount}] Executing Folder Async [${folderName}] `)
        let startTime = new Date()
        const promise = runFolder(runConfig, folderToRun, clientId, threadsInfo, resultCallback)
        await sleep(Math.min((delay - (new Date() - startTime)), 0))

        queue.push(promise);
        isSettled.push(false);

        if (queue.length >= maxQueueSize) {
            const settledIndex = await Promise.race(
                isSettled.map((_, index) => queue[index].then(() => index))
            );

            // Remove the settled promise from the queue
            queue.splice(settledIndex, 1);
            isSettled.splice(settledIndex, 1);

            console.log("Settled promise:", settledIndex);
        }
        folderRunCount += 1
    }

    // Wait for any remaining promises to settle
    await Promise.all(queue);
    console.log(`Folder ${folderName} execution complete`);
}

async function runCollection(runConfig, clientId, threadsInfo, resultCallback) {
    try {
        while (runConfig.iterations > runConfig.runCount) {
            envVars = await runSteps(runConfig, clientId, threadsInfo, resultCallback)
            runConfig.runCount += 1
            let elapsedTime = (new Date() - runConfig.threadStartTime) / 1000;
            if (runConfig.maxPeriod && elapsedTime >= runConfig.maxPeriod) {
                console.log('Max period reached. Ending simulation.');
                break;
            }
        }
    } catch (error) {
        console.error('Newman run encountered an error: ', error);
    }
}

async function runCollectionInBackground(runConfig, clientId, threadsInfo, resultCallback) {
    try {
        for (const folder of Object.keys(runConfig.steps)) {
            folderToRun = runConfig.steps[folder]
            runConfig.reportPath = path.resolve(runConfig.reports, `${runConfig.runCount}`)
            await runStepsInBackground(runConfig, folderToRun, clientId, threadsInfo, resultCallback)
            let elapsedTime = (new Date() - runConfig.threadStartTime) / 1000;
            if (runConfig.maxPeriod && elapsedTime >= runConfig.maxPeriod) {
                console.log('Max period reached. Ending simulation.');
                break;
            }
        }
    } catch (error) {
        console.error('Error occured while running collection in background. Error: ', error);
    }
}

async function runNewman(runConfig, clientId, threadsInfo, resultCallback) {
    runConfig.runCount = 0
    runConfig.threadStartTime = new Date();
    runConfig = await initCollection(runConfig, clientId, threadsInfo, resultCallback)
    if (runConfig.background) {
        await runCollectionInBackground(runConfig, clientId, threadsInfo, resultCallback)
    } else {
        await runCollection(runConfig, clientId, threadsInfo, resultCallback)
    }
    console.log(`[Session: ${runConfig.sessionId}] Completd running collection for [Client ID: ${clientId}]`)
    return { ...threadsInfo, thread_endtime: new Date() }
}

module.exports = {
    initCollection,
    runCollection,
    runCollectionInBackground,
    runNewman,
}

