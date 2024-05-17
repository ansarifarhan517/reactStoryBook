const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const port = 9091;
const { format } = require('date-fns')
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('path');
const runner = require("./runner.js")
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv')
dotenv.config()
const apiEndPoint = process.env.API_END_POINT;
const queryApiEndPoint = process.env.QUERY_API_END_POINT;

// const apiEndPoint = 'http://192.168.180.237:8080';
// const queryApiEndPoint = 'http://192.168.180.237:8889'
let totalCount = 0, intervalId;
// Later on we can override using command line arguments or ENV variables
const globalConfigPath = 'config/global-config.json'
const workingDir = process.cwd()

const app = express();
const server = createServer(app);
const io = new Server(server);

let THREAD_COUNT = 4
// const main = require("./index");

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});



// Function to acquire a connection from the pool
function getConnectionFromPool() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

// Function to release a connection back to the pool
function releaseConnection(connection) {
    connection.release();
}


// Function to execute a query asynchronously
function queryAsync(connection, query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/build'))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/initiate/**', createProxyMiddleware({
    target: apiEndPoint,
    pathRewrite: {
        '^/initiate': ''
    },
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        console.log(req.method, req.path, '->', apiEndPoint + proxyReq.path)
    }
}));

app.use('/query/**', createProxyMiddleware({
    target: queryApiEndPoint,
    pathRewrite: {
        '^/query': ''
    },
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        console.log(req.method, req.path, '->', queryApiEndPoint + proxyReq.path)
    }
}));


const createWorker = (runConfig, clientId) => {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();

        const worker = new Worker('./worker.js', {
            workerData: { runConfig, clientId }
        });
        console.log(`Thread ${clientId}: Started at ${startTime}`);
        worker.on('message', (result) => {
            const endTime = performance.now();
            const executionTimeInSeconds = (endTime - startTime) / 1000; // Convert to seconds

            let executionTime;
            let unit;

            if (executionTimeInSeconds >= 3600) {
                // If execution time is 1 hour or more, express in hours
                executionTime = executionTimeInSeconds / 3600;
                unit = 'hours';
            } else if (executionTimeInSeconds >= 60) {
                // If execution time is 1 minute or more, express in minutes
                executionTime = executionTimeInSeconds / 60;
                unit = 'minutes';
            } else {
                // Otherwise, express in seconds
                executionTime = executionTimeInSeconds;
                unit = 'seconds';
            }

            resolve({ result, executionTime, unit });
        });

        worker.on('error', (error) => {
            const endTime = performance.now();
            const executionTimeInSeconds = (endTime - startTime) / 1000; // Convert to seconds

            let executionTime;
            let unit;

            if (executionTimeInSeconds >= 3600) {
                executionTime = executionTimeInSeconds / 3600;
                unit = 'hours';
            } else if (executionTimeInSeconds >= 60) {
                executionTime = executionTimeInSeconds / 60;
                unit = 'minutes';
            } else {
                executionTime = executionTimeInSeconds;
                unit = 'seconds';
            }

            reject({ error, executionTime, unit });
        });
    });
};


app.post('/getData', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const { page, limit } = req.query;
        const payload = req.body;

        const offset = page > 1 ? (page - 1) * limit : 0;
        const cumulativeOffset = page > 1 ? (page - 1) * limit : 0;
        let query = ''

        if (payload.isFilterActive) {
            if (payload.filterType === 'date') {
                const { filterValue, columnNames } = payload;

                const conditions = [];
                Object.entries(columnNames).forEach(([columnName, isSelected]) => {
                    if (isSelected) {
                        const [minDateStr, maxDateStr] = filterValue[columnName];

                        // Parse dates and convert to milliseconds
                        const minDate = minDateStr ? new Date(minDateStr).getTime() : undefined;
                        const maxDate = maxDateStr ? new Date(maxDateStr).getTime() : undefined;

                        console.log(minDate, 'minDate as milliseconds');
                        console.log(maxDate, 'maxDate as milliseconds');
                        if (minDate && maxDate) {

                            conditions.push(`${columnName} >= ${minDate} AND ${columnName} <=  ${maxDate}`);
                        }
                        if (minDate && !maxDate) {
                            // Only minDate is provided
                            conditions.push(`${columnName} >= ${minDate}`);
                        }
                        if (maxDate && !minDate) {
                            // Only maxDate is provided
                            conditions.push(`${columnName} <= ${maxDate}`);
                        }
                    }
                });

                // Combine conditions with AND when both starttime and endtime are selected
                const dateCondition = conditions.length ? conditions.join(' AND ') : '1';

                query = `SELECT * FROM api_call_report WHERE
                session_id = (
                SELECT MAX(session_id) from api_call_report
                ) AND
                ${dateCondition} LIMIT ${limit} OFFSET ${offset}`;
                console.log(query)

            }
        }
        else {
            query = `SELECT * FROM api_call_report WHERE
                session_id = (
                SELECT MAX(session_id) from api_call_report
                ) LIMIT ${limit} OFFSET ${offset}`;
            console.log(query)

        }
        const results = await queryAsync(connection, query);
        res.json(results.map((data, index) => ({
            ...data,
            "id": cumulativeOffset + index + 1,
            starttime: format(new Date(data.starttime), 'yyyy-MM-dd hh:mm a'),
            endtime: format(new Date(data.endtime), 'yyyy-MM-dd hh:mm a'),
            responseTime: data.responseTime + ' ms',
        })));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});



app.get('/getJmeterData', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const { page, limit } = req.query;
        const offset = page > 1 ? (page - 1) * limit : 0;
        const cumulativeOffset = page > 1 ? (page - 1) * limit : 0;
        let query = ''


        query = `SELECT * FROM products.jmeterReportData LIMIT ${limit} OFFSET ${offset}`;
        console.log(query)


        const results = await queryAsync(connection, query);
        res.json(results.map((data, index) => ({
            ...data,
            "id": cumulativeOffset + index + 1,
        })));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});

app.get('/getJmeterDataCount', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const results = await queryAsync(
            connection,
            `SELECT COUNT(timeStamp) as TotalRecordCount FROM products.jmeterReportData`
        );
        res.json(results[0]); // Assuming results is an array, and you want the first item
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});


app.post('/getFiltereSummaryReports', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        let conditions = [];
        const { startTime, endTime } = req.body.payload;
        console.log(startTime)
        console.log(endTime)

        const minDate = startTime ? new Date(startTime) : undefined;
        const maxDate = endTime ? new Date(endTime) : undefined;

        const columnName = 'starttime'; // Assuming the column name is 'starttime'

        if (minDate && maxDate) {
            // Both minDate and maxDate provided
            const formattedStartFilter = minDate.getTime();
            const formattedEndFilter = maxDate.getTime();
            conditions.push(`starttime >= ${formattedStartFilter} AND endtime <=  ${formattedEndFilter}`);
        }
        if (minDate && !maxDate) {
            // Only minDate is provided
            const formattedStartFilter = minDate.getTime();
            conditions.push(` starttime >= ${formattedStartFilter}`);
        }
        if (maxDate && !minDate) {
            // Only endTime is provided
            const formattedEndFilter = endTime.getTime();
            conditions.push(`endtime <= ${formattedEndFilter}`);
        }

        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = 'WHERE session_id = (SELECT MAX(session_id) from api_call_report) ' + conditions.join(' AND ');
        }

        const query = `SELECT api,starttime, endtime,  COUNT(*) AS request_count, AVG(responseTime) AS avg_response_time,
            MAX(responseTime) AS max_response_time,
            SUM(CASE WHEN responseCode NOT BETWEEN 200 AND 299 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS ErrorRate
            FROM api_call_report 
            ${whereClause}
            GROUP BY api
            ORDER BY max_response_time `;
        console.log(query)
        const results = await queryAsync(connection, query);

        // Process results or send them as a response
        res.json(results.map((data, index) => {
            return {
                ...data,
                id: index + 1,
                starttime: format(new Date(data.starttime), 'yyyy-MM-dd hh:mm a'),
                endtime: format(new Date(data.endtime), 'yyyy-MM-dd hh:mm a'),
                responseTime: data.responseTime + ' ms',
            }
        }))
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});

app.get('/download-csv-reports', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const query = `SELECT * FROM api_call_report WHERE session_id = (SELECT MAX(session_id) from api_call_report)`;
        const results = await queryAsync(connection, query);

        const csvFilePath = 'output.csv';

        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'id', title: 'Id' },
                { id: 'request_name', title: 'Request Name' },
                { id: 'method', title: 'Method' },
                { id: 'domain', title: 'Domain' },
                { id: 'api', title: 'Api' },
                { id: 'session_id', title: 'Session Id' },
                { id: 'client_id', title: 'Client Id' },
                { id: 'starttime', title: 'Start Time' },
                { id: 'endtime', title: 'End Time' },
                { id: 'responseCode', title: 'Response Code' },
                { id: 'responseTime', title: 'Response Time' },
                { id: 'responseSize', title: 'Response Size' },
            ],
        });

        await csvWriter.writeRecords(results);

        res.download(csvFilePath, 'output.csv', async (err) => {
            if (err) {
                console.error('Error sending CSV:', err);
                res.status(500).send('Internal Server Error');
            }

            await fs.unlink(csvFilePath, (err) => {
                if (err) {
                    console.error('Error sending CSV:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        });
    } catch (error) {
        console.error('Error writing CSV:', error);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});

app.get('/download-jmeter-reports', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const query = `SELECT * FROM products.jmeterReportData`;
        const results = await queryAsync(connection, query);

        const csvFilePath = 'output.csv';

        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'label', title: 'Label' },
                { id: 'responseCode', title: 'Response Code' },
                { id: 'responseMessage', title: 'Response Message' },
                { id: 'threadName', title: 'Thread Name' },
                { id: 'Latency', title: 'Latency' },
                { id: 'test_run_id', title: 'Test Run Id' },
            ],
        });

        await csvWriter.writeRecords(results);

        res.download(csvFilePath, 'output.csv', async (err) => {
            if (err) {
                console.error('Error sending CSV:', err);
                res.status(500).send('Internal Server Error');
            }

            await fs.unlink(csvFilePath, (err) => {
                if (err) {
                    console.error('Error sending CSV:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        });
    } catch (error) {
        console.error('Error writing CSV:', error);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});


app.get('/download-csv-summaryReports', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const results = await queryAsync(
            connection,
            'SELECT api, COUNT(*) AS request_count, AVG(responseTime) AS avg_response_time, ' +
            'MAX(responseTime) AS max_response_time, ' +
            'SUM(CASE WHEN responseCode NOT BETWEEN 200 AND 299 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS ErrorRate ' +
            'FROM api_call_report ' +
            'WHERE starttime >= UNIX_TIMESTAMP(NOW() - INTERVAL 1 HOUR) ' +
            'AND session_id = (SELECT MAX(session_id) from api_call_report)' +
            'GROUP BY api'
        );

        const csvFilePath = 'output.csv';

        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'id', title: 'Id' },
                { id: 'request_count', title: 'Request Count' },
                { id: 'avg_response_time', title: 'Average Response Time' },
                { id: 'max_response_time', title: 'Max Response Time' },
                { id: 'api', title: 'Api' },
                { id: 'ErrorRate', title: 'Error Rate' },
            ],
        });

        await csvWriter.writeRecords(results);

        res.download(csvFilePath, 'output.csv', async (err) => {
            if (err) {
                console.error('Error sending CSV:', err);
                res.status(500).send('Internal Server Error');
            }

            await fs.unlink(csvFilePath, (err) => {
                if (err) {
                    console.error('Error sending CSV:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        });
    } catch (error) {
        console.error('Error writing CSV:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});

app.get('/getAllData', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const query = `SELECT * FROM api_call_report WHERE session_id = (SELECT MAX(session_id) from api_call_report)`;
        const results = await queryAsync(connection, query);

        res.json(
            results.map((data, index) => ({
                ...data,
                id: index + 1,
                starttime: format(new Date(data.starttime), 'yyyy-MM-dd hh:mm a'),
                endtime: format(new Date(data.endtime), 'yyyy-MM-dd hh:mm a'),
                responseTime: data.responseTime + ' ms',
            }))
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});

app.post('/getDataCount', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const payload = req.body;
        let condition = '';

        if (payload.isFilterActive) {
            if (payload.filterType === 'date') {
                const { filterValue, columnNames } = payload;

                const conditions = Object.entries(columnNames)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([columnName]) => {
                        const [minDateStr, maxDateStr] = filterValue[columnName];
                        const minDate = minDateStr ? new Date(minDateStr).getTime() : undefined;
                        const maxDate = maxDateStr ? new Date(maxDateStr).getTime() : undefined;

                        if (minDate && maxDate) {
                            return `${columnName} >= ${minDate} AND ${columnName} <= ${maxDate}`;
                        }
                        if (minDate) {
                            return `${columnName} >= ${minDate}`;
                        }
                        if (maxDate) {
                            return `${columnName} <= ${maxDate}`;
                        }

                        return ''; // Empty string if neither minDate nor maxDate is provided
                    })
                    .filter(Boolean); // Remove empty strings

                condition = conditions.length ? `AND ${conditions.join(' AND ')}` : '';
            }
        }

        // Construct the join clause and subquery
        let whereClause = `
            WHERE session_id = (
                SELECT MAX(session_id) FROM api_call_report
            )
        `;


        console.log(`SELECT COUNT(api_call_report.id) as TotalRecordCount FROM api_call_report ${whereClause} ${condition}`);
        const results = await queryAsync(
            connection,
            `SELECT COUNT(id) as TotalRecordCount FROM api_call_report  ${whereClause} ${condition}`
        );

        res.json(results[0]); // Assuming results is an array, and you want the first item
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});


app.get('/getSummaryReports', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();

        const results = await queryAsync(
            connection,
            'SELECT api,starttime,endtime, COUNT(*) AS request_count, AVG(responseTime) AS avg_response_time, ' +
            'MAX(responseTime) AS max_response_time, ' +
            'SUM(CASE WHEN responseCode NOT BETWEEN 200 AND 299 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS ErrorRate ' +
            'FROM api_call_report ' +
            'WHERE session_id = (SELECT MAX(session_id) from api_call_report) ' +
            'GROUP BY api'
        );

        res.json(
            results.map((data, index) => ({
                ...data,
                "id": index + 1,
                starttime: format(new Date(data.starttime), 'yyyy-MM-dd hh:mm a'),
                endtime: format(new Date(data.endtime), 'yyyy-MM-dd hh:mm a'),
                responseTime: data.responseTime + ' ms',
            }))
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
});


app.post('/insertScripts', async (req, res) => {
    try {
        const runConfig = req.body;

        if (!runConfig) {
            return res.status(400).json({ error: 'Invalid request. Missing runConfig in the request body.' });
        }
        runConfig.sessionId = new Date().valueOf()
        const totalClients = runConfig.clients.length;

        if (THREAD_COUNT >= totalClients) {
            console.warn("Number of threads is greater than or equal to the number of clients. Adjusting numThreads.");
            THREAD_COUNT = totalClients;
        }

        const clientsPerThread = Math.floor(totalClients / THREAD_COUNT);
        const remainingClients = totalClients % THREAD_COUNT;

        const threadClientRanges = [];

        let start = 0;
        for (let i = 0; i < THREAD_COUNT; i++) {
            let end = start + clientsPerThread + (i < remainingClients ? 1 : 0);
            threadClientRanges.push(runConfig.clients.slice(start, end));
            start = end;
        }

        const workerPromises = [];

        for (let i = 0; i < THREAD_COUNT; i++) {
            const clientsForThread = threadClientRanges[i];
            console.log(`Thread ${i + 1}: Number of clients = ${clientsForThread.length}`);
            if (clientsForThread.length > 0) {
                workerPromises.push(createWorker(runConfig, runConfig.clients[i]));
            }
        }

        const results = [];

        Promise.all(workerPromises)
            .then(workerResults => {
                workerResults.forEach(({ result, executionTime }) => {
                    results.push({ result, executionTime });
                });

                console.log('Thread execution results:', results);

                console.log(`All clients completed. Find results in session ${runConfig.sessionId}`);
                res.json({ message: 'Script execution initiated successfully.', results });
            })
            .catch(error => {
                console.error(`[${runConfig.sessionId}] Error running clients: ${error}:`);
                res.status(500).json({ error: 'Internal Server Error' });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/average-threads-per-sec', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        const results = await queryAsync(
            connection,
            `SELECT COUNT(*) AS totalThreads,
            (MAX(thread_endtime) - MIN(thread_starttime)) AS totalDurationInSeconds
            FROM thread_reports;`
        );

        // Extract total number of threads and total duration from query results
        const { totalThreads, totalDurationInSeconds } = results[0];
        console.log(totalThreads, totalDurationInSeconds)
        // Calculate average threads per second
        const averageThreadsPerSecond = totalThreads / totalDurationInSeconds;

        // Send the average threads per second as the response
        res.json({ averageThreadsPerSecond });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
})


app.get('/average-rps', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromPool();
        connection.connect();
        const results = await queryAsync(
            connection,
            `SELECT
            COUNT(*) AS totalRequests,
            (MAX(endtime) - MIN(starttime)) / 1000 AS totalDurationInSeconds
            FROM api_call_report; `
        ); 1

        // Extract total requests and total duration from query results
        const { totalRequests, totalDurationInSeconds } = results[0];

        // Calculate average RPS
        const averageRPS = totalRequests / totalDurationInSeconds;

        // Send the average RPS as the response
        res.json({ averageRPS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            releaseConnection(connection);
        }
    }
})

app.post('/node-simulator', async (req, res) => {
    try {
        const runConfig = req.body.fileName;
        if (!runConfig) {
            return res.status(400).json({ error: 'Invalid request. Missing runConfig in the request body.' });
        }
        simulation = {}
        simulation.runConfigPath = req.body.fileName // runConfigPath is the path of json
        simulation.sessionId = new Date().valueOf()
        runAllClientsWithWorkers(simulation)
    } catch (error) {

    }
})

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
        console.log(runFilePath)
        runConfig = require(runFilePath)
    } catch (error) {
        throw new Error(`Unable to load run file ${runFilePath}. ${error}`)
    }

    try {
        if (!(Array.isArray(runConfig.clients))) {
            console.log(runConfig.clients)
            runConfig.clientListPath = path.resolve(workingDir, globalConfig.environmentsPath, globalConfig.environment, runConfig.clients)
            runConfig.clients = fs.readFileSync(runConfig.clientListPath).toString('UTF8').split('\n').filter(Boolean)
        }
    } catch (error) {
        throw new Error(`Unable to load client List ${runConfig.clientListPath}. ${error}`)
    }

    runConfig.sessionId = simulation.sessionId
    runConfig.globalConfig = globalConfig
    runConfig.globalConfigPath = path.resolve(workingDir, globalConfigPath)
    return runConfig
}

async function runAllClientsWithWorkers(simulation) {

    if (isMainThread) {
        const workerPromises = [];

        runConfig = initializeSimulation(simulation)
        clientsRemaining = runConfig.clients.slice()
        threads = runConfig.threads || runConfig.globalConfig.threads

        // Here we will continue till all client list but will pause for maximum concenrrency (threads)
        // And as soon as we are done with one of the clients, the old thead exits; Spawn a new thread for the next client
        while (clientsRemaining.length > 0 || workerPromises.length > 0) {
            while (workerPromises.length < threads && clientsRemaining.length > 0) {
                const clientId = clientsRemaining.shift();

                console.log(`[Session: ${runConfig.sessionId}] [Client ID: ${clientId}] Launching Runfile: ${simulation.runConfigPath} `)
                const worker = new Worker('./worker.js', { workerData: { runConfig, clientId } });
                const workerPromise = new Promise((resolve) => {
                    worker.on('message', (result) => {
                        resolve(result);
                    });
                });
                // Keep list of promises of the workers that are launched
                workerPromises.push(workerPromise);
                // Whenever the promise is settled, remove the promise from workerPromises
                workerPromise.finally(() => {
                    const index = workerPromises.indexOf(workerPromise);
                    if (index !== -1) workerPromises.splice(index, 1);
                });

            }
            // Wait till at least 1 worker returns
            await Promise.race(workerPromises);
        }
        console.log(`[Session: ${runConfig.sessionId}] Execution completed for all clients.`);
    } else {
        await runWorkerScript();
    }
}

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});



// Function to emit updated stats to clients via Socket.io
async function emitUpdatedStats() {
    let connection;
    try {
        connection = await getConnectionFromPool();

        // Calculate average threads per second
        // const threadResults = await queryAsync(
        //     connection,
        //     `SELECT COUNT(*) AS totalThreads,
        //     (MAX(thread_endtime) - MIN(thread_starttime)) AS totalDurationInSeconds
        //     FROM thread_reports;`
        // );
        // const { totalThreads, totalDurationInSeconds } = threadResults[0];
        // const averageThreadsPerSecond = totalThreads / totalDurationInSeconds;

        //Calculate Current Total Running threads
        const threadsCountResults = await queryAsync(connection,
            `SELECT COUNT(*) AS totalThreads
FROM (
    SELECT DISTINCT(thread_id)
    FROM api_call_report
    WHERE session_id = (SELECT MAX(session_id) FROM api_call_report)
) AS distinct_threads
LEFT JOIN thread_reports AS tr ON distinct_threads.thread_id = tr.thread_id

            `
        )

        const requestCountResults = await queryAsync(connection,
            `SELECT COUNT(*) AS totalRequest
            FROM api_call_report WHERE api_call_report.session_id = (SELECT MAX(session_id) FROM api_call_report);
            `
        )

        // Calculate average RPS
        const apiResults = await queryAsync(
            connection,
            `SELECT 
            COUNT(*) / ((MAX(endtime) - MIN(starttime)) / 1000) AS avg_requests_per_second
            FROM 
            api_call_report WHERE api_call_report.session_id = (SELECT MAX(session_id) FROM api_call_report);`
        );

        //Calculate Finished Threads 
        const finishedThreads = await queryAsync(
            connection,
            `SELECT COUNT(*) AS finishedThreadsCount
FROM(
                SELECT DISTINCT(thread_id)
    FROM api_call_report
    WHERE session_id = (SELECT MAX(session_id) FROM api_call_report)
        ) AS distinct_threads
LEFT JOIN thread_reports AS tr ON distinct_threads.thread_id = tr.thread_id
WHERE tr.thread_endtime = 0; `
        )

        if (totalCount !== 0) {
            console.log(totalCount, "totalCount")
            connection.query(`CALL CheckSimulationCompletion(${totalCount})`, (error, results) => {
                if (error) {
                    console.error('Error while calling stored procedure:', error);
                } else {
                    console.log(results[0][0])
                    if (results[0][0].MSG === 'Simulation Completed') {
                        console.log('completed')
                        io.emit('newManCompletion', { isComplete: 'Completed' })
                        // To clear the interval (stop it)
                        clearInterval(intervalId);
                    }
                }
            });
        }
        console.log(finishedThreads, 'finishedThreads')

        console.log(apiResults[0], 'rps')
        // Emit updated stats to clients
        // io.emit('average-threads-per-sec', { averageThreadsPerSecond });
        io.emit('current-running-threads', threadsCountResults[0]);
        io.emit('current-running-request', requestCountResults[0]);
        io.emit('average-rps', { averageRPS: apiResults[0].avg_requests_per_second });
        io.emit('finishedThreadCount', { finishedThreads: finishedThreads[0].finishedThreadsCount })


    } catch (error) {
        console.error('Error while calculating and emitting stats:', error);
    } finally {
        // Close the connection
        if (connection) {
            releaseConnection(connection);
        }
    }
}

io.on('connection', (socket) => {
    console.log("userConnected")
    // Listen for 'simulation-started' event
    socket.on('simulation-started', (data) => {
        totalCount = data
        if (intervalId) {
            clearInterval(intervalId);
        }
        // Start new interval
        intervalId = setInterval(emitUpdatedStats, 2000);//2 secs
    })
    // Handle other socket events here
});


server.listen(port, () => {
    console.log(`Server Running on ${port}`);
});
