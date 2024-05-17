const mysql = require('mysql');
const path = require('path');

let dbConfigs = {};

async function insertReportToDB(report, pool) {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(report[0]);

        const valuesPart = report.map(data => {
            const placeholders = columns.map(column => '?').join(', ');
            return `(${placeholders})`;
        }).join(', ');

        const flattenedData = report.map(data =>
            columns.map(column => data[column])
        ).flat();

        const sqlQuery = `INSERT INTO ${dbConfigs.table_name} (${columns.join(', ')}) VALUES ${valuesPart};`;

        pool.query(sqlQuery, flattenedData, (error, results) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            } else {
                const numInserted = results.affectedRows; // Get the number of affected rows
                console.log(`${numInserted} records inserted`);
                resolve(numInserted); // Resolve with the number of inserted records
            }
        });
    });
}

async function publishToMySQL(runConfig, performanceReport) {
    let pool;
    try {
        const dbConfig = require(path.resolve(runConfig.environmentsPath, runConfig.environment, runConfig.reportDBConfig)).mysql;
        dbConfigs = dbConfig;
        pool = await connectToDatabase(dbConfig);

        if (runConfig.reportDB && performanceReport.length > 0) {
            await insertReportToDB(performanceReport, pool);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        try {
            if (pool) {
                // Close the MySQL connection after publishing the report
                await pool.end();
                console.log('Closed MySQL connection');
            }
        } catch (error) {
            console.error('Error closing MySQL connection:', error);
        }
    }
}

async function connectToDatabase(dbConfig) {
    try {
        const pool = mysql.createPool({
            ...dbConfig,
            connectTimeout: 20000 // Adjust the timeout value as needed
        });

        // Test the connection to ensure it's successful
        pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error connecting to MySQL:', error);
            } else {
                console.log('Connected to MySQL');
                connection.release(); // Release the connection after testing
            }
        });

        return pool;
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error; // Throw error to propagate it
    }
}

module.exports = { publishToMySQL, connectToDatabase };
