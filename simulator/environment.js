const path = require('path');
const { convertCsvToJson } = require('./csvtoJson');

function findEnvironmentValue(environmentValues, key) {
  const environmentVariable = environmentValues.find(variable => variable.key === key);
  return environmentVariable ? environmentVariable.value : null;
}

function updateEnvironmentValue(environmentValues, key, newValue) {
  const environmentVariable = environmentValues.find(variable => variable.key === key);
  if (environmentVariable) {
    // Update the value of the found environment variable
    environmentVariable.value = newValue;
  } else {
    // If not found, you can add a new object with the provided key and value
    environmentValues.push({ key, value: newValue });
  }
  return environmentValues
}

function updateEnvironmentVars(runConfig, envUpdates) {
  if (envUpdates.members) {
    for (const env of envUpdates.members) {
      runConfig.environmentData.values = updateEnvironmentValue(runConfig.environmentData.values, env.key, env.value)
    };
  }
  return runConfig.environmentData
}

const prepareEnvironment = async (runConfig, clientId) => {
    const envPath = path.resolve(runConfig.environmentsPath, runConfig.environment, runConfig.defaultEnvironmentVariables);
    environmentData = require(envPath)
    let clientInfo = {}
    try {
      clientInfo = await convertCsvToJson(runConfig.environmentsPath, runConfig.environment, runConfig.clientInfoFolder, runConfig.debug);
    } catch (error) {
      throw Error(`Error loading clientInfo file ${error}`);
    }
    if (!(clientId in clientInfo)) {
      throw Error(`Invalid clientId "${clientId}"`)
    }
    envUpdates = clientInfo[clientId]
    envUpdates.push({ key: 'SESSION_ID', value: runConfig.sessionId, enabled: true })
    envUpdates.push({ key: 'CLIENT_ID_REF', value: clientId, enabled: true })

    envUpdates.forEach(obj => {
      const { key, value } = obj;
      environmentData.values = updateEnvironmentValue(environmentData.values, key, value);
    });
    return { envPath, environmentData }
}

module.exports = {
  prepareEnvironment,
  updateEnvironmentVars,
}
