const { MongoClient } = require('mongodb');
const path = require('path');

let client;

const connectToDatabase = async (dbConfig) => {
    client = new MongoClient(dbConfig.uri); // Assign the MongoClient instance to the global 'client' variable
    try {
        await client.connect();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

const insertReportToMongo = async (client, report, mongoConfig) => { // Pass 'client' as a parameter
    try {
        const db = client.db(mongoConfig.database_name);
        const collection = db.collection(mongoConfig.collection_name);
        const result = await collection.insertMany(report);
        console.log(`Inserted ${result.insertedCount} documents into MongoDB`);
    } catch (error) {
        console.error('Error inserting report to MongoDB:', error);
    }
};

async function publishToMongoDB(runConfig, performanceReport) {
    try {
        const dbConfig = require(path.resolve(runConfig.environmentsPath, runConfig.environment, runConfig.reportDBConfig)).mongo;
        await connectToDatabase(dbConfig);

        if (runConfig.reportDB && performanceReport.length > 0) {
            await insertReportToMongo(client, performanceReport, dbConfig); // Pass 'client' as a parameter
        }
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Close the MongoDB connection after publishing the report
        if (client) {
            await client.close();
        }
    }
}

module.exports = { publishToMongoDB, connectToDatabase };
