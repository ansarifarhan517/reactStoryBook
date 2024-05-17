const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

function convertCsvToJson(environmentPath, environmentName, cleintInfo, debug=false) {
    return new Promise((resolve, reject) => {
        const folderPath = path.resolve(environmentPath, environmentName, cleintInfo);
        const files = fs.readdirSync(folderPath);
        const jsonOutput = {};

        // Read all files in the environment folder
        files.forEach((file) => {
            const inputFilePath = path.join(folderPath, file);

            if (fs.statSync(inputFilePath).isFile() && file.endsWith('.csv')) {
                fs.createReadStream(inputFilePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        const clientRefId = row['client_ref_id'];

                        if (!clientRefId) {
                            console.error('client_ref_id column not found in the CSV file.');
                            throw new Error(`Missing column client_ref_id in ${inputFilePath}`)
                        }

                        const clientData = [];

                        for (const columnName in row) {
                            if (columnName === 'client_ref_id') continue;
                            const value = row[columnName];

                            const clientObject = {
                                key: columnName,
                                value: value,
                                type: 'default',
                                enabled: true,
                            };

                            clientData.push(clientObject);
                        }

                        if (jsonOutput[clientRefId]) {
                            jsonOutput[clientRefId].push(...clientData);
                        } else {
                            jsonOutput[clientRefId] = clientData;
                        }
                    })
                    .on('end', () => {
                        if (debug) {
                            // Save the combined JSON data to clientInfo.json
                            const outputJsonString = JSON.stringify(jsonOutput, null, 4);
                            const outputFilePath = path.join(folderPath, 'clientInfo.json');
                            fs.writeFileSync(outputFilePath, outputJsonString);
                        }
                        resolve(jsonOutput); // Resolve with the JSON data
                    })
                    .on('error', (error) => {
                        console.error('Error processing CSV file:', error);
                        reject(error); // Reject the promise in case of an error
                    });
            }
        });
    });
}

module.exports = {
    convertCsvToJson
};

