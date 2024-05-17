const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Create a writable stream to the result log & error file
const resultLogFile = fs.createWriteStream('result_log.txt');
const errorLogFile = fs.createWriteStream('error_log.txt');

// Function to process a single file
const processFile = async (filePath, fileNumber) => {
    return new Promise((resolve) => {
        const startTime = new Date();
        console.log(`Processing file [${fileNumber}] : ${filePath}`);

        const command = `node index.js ${path.join(process.argv[2], path.relative(process.argv[2], filePath))}`;
        const childProcess = spawn(command, { shell: true });

        let stderr = '';

        childProcess.stdout.on('data', (data) => {
            // Write stdout data to the file as it arrives
            resultLogFile.write(data.toString());
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childProcess.on('close', (code) => {
            const endTime = new Date();
            let successFlag = false;

            if (stderr) {
                const header = `___`.repeat(40) + `\n`;
                const errorMessage = `${header}Error executing command for file number ${filePath}:\n${stderr}\n`;
                fs.appendFileSync('error_log.txt', errorMessage);
                console.error(errorMessage);
            } else {
                console.log(`File number ${fileNumber} successfully executed: ${filePath}`);
                successFlag = true;
            }

            const footerInsideBox = `File number ${fileNumber} successfully executed: ${successFlag}\nTime taken for file number ${fileNumber}: ${endTime - startTime} ms`;

            resolve();
        });
    });
};

// Function to process all files sequentially
const processFileSequentially = async (filePaths) => {
    for (let i = 0; i < filePaths.length; i++) {
        // Write initial content to the result log file
        filePath = filePaths[i], i + 1
        resultLogFile.write(`___`.repeat(40) + `\nProcessing File: ${filePath}\n`);
        await processFile(filePath, i + 1);
    }

    // Close the writable stream
    resultLogFile.end();
    errorLogFile.end();
};

// Function to process all files in a directory concurrently
const processDirectoryConcurrently = async (directoryPath) => {
    try {
        console.log(`Processing all files in directory: ${directoryPath}`);

        // Read all files in the directory
        const files = await fs.promises.readdir(directoryPath);

        // Use Promise.all to process files concurrently
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(directoryPath, file);

            // Check if it's a file (not a directory)
            if ((await fs.promises.stat(filePath)).isFile()) {
                await processFile(filePath, path.relative(process.argv[2], directoryPath));
            } else if ((await fs.promises.stat(filePath)).isDirectory()) {
                await processDirectoryConcurrently(filePath, path.relative(process.argv[2], directoryPath));
            }
        }));

        console.log(`Finished processing directory: ${directoryPath}`);
    } catch (error) {
        console.error(`Error reading folder contents for directory ${directoryPath}:`, error);
    }
};

// Function to get all file paths in a directory and its subdirectories
const getAllFilePaths = (directoryPath) => {
    try {
        const files = fs.readdirSync(directoryPath);
        const filePaths = [];

        for (const file of files) {
            const filePath = path.join(directoryPath, file);

            if (fs.statSync(filePath).isFile()) {
                filePaths.push(filePath);
            } else if (fs.statSync(filePath).isDirectory()) {
                const subDirectoryPaths = getAllFilePaths(filePath);
                filePaths.push(...subDirectoryPaths);
            }
        }

        return filePaths;
    } catch (error) {
        console.error(`Error reading folder contents for directory ${directoryPath}:`, error);
        return [];
    }
};

// Async function to run the entire script
const runScript = async () => {
    // Extract the input path from command line arguments
    const inputPath = process.argv[2];

    // Check if the input path is provided
    if (!inputPath) {
        console.error('Error: Input path is required. Usage: node index.js <inputpathfolder>');
        process.exit(1); // Exit with an error code
    }

    // Resolve the input path
    const resolvedInputPath = path.resolve(inputPath);

    // Get all file paths in the specified folder
    let filePaths = getAllFilePaths(resolvedInputPath);
    filePaths = filePaths.map(absolutePath => {
        return path.relative(process.cwd(), absolutePath);
    });

    // Print the result
    console.log(`Processing ${filePaths.length} File Paths:`);
    console.log(filePaths);

    // Process all files sequentially
    await processFileSequentially(filePaths);
};

// Call the async function to run the script
runScript().catch(error => console.error('Error running script:', error));
