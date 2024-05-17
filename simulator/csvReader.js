const fs = require('fs');

function parseCsvSync(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const rows = fileContent.split('\n');

    // Assuming the first row contains headers
    const headers = rows[0].split(',');

    const parsedData = rows.slice(1).map((row) => {
      const columns = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = columns[index].trim();
        return obj;
      }, {});
    });

    return parsedData;
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error.message);
    return [];
  }
}

module.exports = parseCsvSync;

