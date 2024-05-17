const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const runner = require("./runner.js")
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const { publishReport } = require('./report.js');

// Later on we can override using command line arguments or ENV variables
const globalConfigPath = 'config/global-config.json'
const workingDir = process.cwd()


const initializeSimulation = (simulation) => {
    let globalConfig = {}
    let runConfig = {}
    try {
        configPath = path.resolve(workingDir, globalConfigPath)
        globalConfig = require(configPath)
    } catch (error) {
        throw new Error(`Unable to load global config. Path ${globalConfigPath}. ${error}`)
    }

    try {
        runFilePath = path.resolve(workingDir, simulation.runConfigPath)
        runConfig = require(runFilePath)
    } catch (error) {
        throw new Error(`Unable to load run file ${runFilePath}. ${error}`)
    }

    try {
        if (!(Array.isArray(runConfig.clients))) {
            console.log(runConfig.clients)
            runConfig.environmentPath = path.resolve(workingDir, globalConfig.environmentsPath, globalConfig.environment)
            runConfig.clientListPath = path.resolve(runConfig.environmentPath, globalConfig.clientListFolder, runConfig.clients)
            runConfig.clients = fs.readFileSync(runConfig.clientListPath).toString('UTF8').split('\n').filter(Boolean)
        }
    } catch (error) {
        throw new Error(`Unable to load client List ${runConfig.clientListPath}. ${error}`)
    }

    runConfig.runConfigPath = simulation.runConfigPath
    runConfig.sessionId = simulation.sessionId
    runConfig.globalConfig = globalConfig
    runConfig.globalConfigPath = path.resolve(workingDir, globalConfigPath)
    return runConfig
}

const resultCallback = async (results) => {
    try {
        const {
            threadsInfo,
            request_starttime,
            request_endtime,
            err,
            runConfig,
            clientId,
            folderToRun,
            summary,
        } = results;

        const status = err ? 'Error' : 'Success';
        summary.threadId = threadsInfo.threadId;

        console.log(`\nParent ThreadID: ${process.pid}, Thread_ID: ${threadsInfo.threadId}, Thread_StartTime: ${threadsInfo.thread_starttime}, Start Time: ${request_starttime}, End Time: ${request_endtime}`);

        if (err) {
            console.log(`Unable to run the folder: ${folderToRun.folder} : Error ${err}`);
            if (err == 'Error: callback timed out') {
                console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] [Iteration: ${runConfig.runCount}] Collection run completed with errors [${folderToRun.folder}] `);
                let folder = {
                    folderName: folderToRun.folder,
                    timedout: true
                }
                summary.folder = folder
                await publishReport(summary, runConfig);
                return summary.environment.values;
            } else {
                throw err;
            }
        } else {
            await publishReport(summary, runConfig);
            console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] [Iteration: ${runConfig.runCount}] Completed Executon for Folder [${folderToRun.folder}] `);
            return summary.environment.values;
        }
    } catch (error) {
        console.error('Error in resultCallback:', error);
        throw error;
    }
};


async function runWorkerScript() {
    const { runConfig, clientId, threadsInfo } = workerData;
    try {
        const result = await runner.runNewman(runConfig, clientId, threadsInfo, resultCallback);
        parentPort.postMessage(result);
    } catch (error) {
        parentPort.postMessage({ error });
    }
}


async function runAllClientsWithWorkers(simulation) {
    const workerPromises = [];

    runConfig = initializeSimulation(simulation)
    clientsRemaining = runConfig.clients.slice()
    threads = runConfig.threads || runConfig.globalConfig.threads

    // Here we will continue until all client list is processed but will pause for maximum concurrency (threads)
    // And as soon as we are done with one of the clients, the old thread exits; Spawn a new thread for the next client
    while (clientsRemaining.length > 0 || workerPromises.length > 0) {
        while (workerPromises.length < threads && clientsRemaining.length > 0) {
            const clientId = clientsRemaining.shift();

            console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] Launching Runfile: ${simulation.runConfigPath} `)
            let threadsInfo = { threadId: uuidv4(), thread_starttime: new Date(), parentThreadId: process.pid }
            runConfig.reportDBConfig && publishThreadReportToMySql(threadsInfo, runConfig, 'insert')
            const worker = new Worker(__filename, { workerData: { runConfig, clientId, threadsInfo } });
            const workerPromise = new Promise((resolve) => {
                worker.on('message', (result) => {
                    runConfig.reportDBConfig && publishThreadReportToMySql(result, runConfig, 'update');
                    resolve(result);
                });
            });
            // Keep list of promises of the workers that are launched
            workerPromises.push(workerPromise);
            // Whenever the promise is settled, remove the promise from workerPromises
            workerPromise.finally(() => {
                const index = workerPromises.indexOf(workerPromise);
                if (index !== -1) workerPromises.splice(index, 1);
                // If all worker promises are resolved and no more clients remaining, exit the main process
                if (workerPromises.length === 0 && clientsRemaining.length === 0) {
                    console.log('All tasks completed. Exiting main process.');
                    // process.exit(0);
                }
            });

        }
        // Wait till at least 1 worker returns
        await Promise.race(workerPromises);
    }
    console.log(`[Session: ${runConfig.sessionId}] Execution completed for all clients.`);
}



async function main() {
    if (isMainThread) {
        simulation = {}
        if (process.argv.length < 3) {
            console.error('Usage: node index.js <run.js>');
            console.error("Example config/run.json")
            process.exit(1);
        } else {
            simulation.runConfigPath = process.argv[2] // runConfigPath is the path of json
            process.argv.length === 4 ? simulation.sessionId = process.argv[3] : simulation.sessionId = new Date().valueOf()
            await runAllClientsWithWorkers(simulation)
        }
    } else {
        await runWorkerScript();
    }
}


const publishThreadReportToMySql = (thread_reports, runConfig, operationType) => {
    var mysql = require('mysql');

    const dbConfig = require(path.resolve(runConfig.globalConfig.environmentsPath, runConfig.globalConfig.environment, runConfig.globalConfig.reportDBConfig)).mysql;
    dbConfig.table_name = 'thread_reports'
    var pool = mysql.createPool({
        ...dbConfig
    });

    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        // Table 1 : parentThreadID, thread_id(PK), thread_start_time, thread_end_time, threadStatus
        // Use the connection

        if (operationType === 'insert') {

            const thread_start_time = Math.floor(new Date(thread_reports.thread_starttime).getTime() / 1000);

            connection.query(`INSERT INTO thread_reports (thread_id, thread_starttime, thread_endtime, status, parent_thread_id) VALUES ('${thread_reports.threadId}', ${thread_start_time}, 0 , '', ${thread_reports.parentThreadId}) `, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) throw error;
                console.log(results, "Inserted")
                // Don't use the connection here, it has been returned to the pool.
            });
        } else if (operationType === 'update') {
            const thread_end_time = Math.floor(new Date(thread_reports.thread_endtime).getTime() / 1000);
            connection.query(`UPDATE thread_reports SET thread_endtime = ${thread_end_time} WHERE thread_id = '${thread_reports.threadId}'  `, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) throw error;
                console.log(results, "Updated")
                // Don't use the connection here, it has been returned to the pool.
            })
        }

    });
}
main()


