const { publishToMongoDB } = require("./mongoPublisher");
const { publishToMySQL } = require("./mysqlPublisher");

function findEnvironmentValue(environmentValues, key) {
  const environmentVariable = environmentValues.find(variable => variable.key === key);
  return environmentVariable ? environmentVariable.value : null;
}

async function analyseReport(report, runConfig) {
  const urlResponseTimeMap = {};
  const performanceReport = []
  if (report.run.executions.length === 0) {
    let request_name = "", api = "unknown"
    const method = "unknown"
    const domain = report.environment.name
    const session_id = findEnvironmentValue(report.environment.values, "SESSION_ID")
    const client_id = findEnvironmentValue(report.environment.values, "CLIENT_ID_REF")
    const starttime = report.run.timings.started
    const endtime = report.run.timings.completed || report.run.timings.started
    const thread_id = report.threadId
    const responseCode = -1
    const responseTime = -1
    const responseSize = 0

    report['collection']['items']['members'].forEach(data => {
      if (data.name === report.folder.folderName) {
        // console.log(data.items['members'].length, "reqCount")
        data.items['members'].forEach((i) => {
          const pathString = i.request.url.path.join('/');
          request_name = i.name
          api = pathString
        })
      }
    })
    result = {
      request_name,
      method,
      domain,
      api,
      session_id,
      client_id,
      starttime,
      endtime,
      responseCode,
      responseTime,
      responseSize,
      thread_id
    }
    performanceReport.push(result)
    console.log(result)
    console.log(`SUMMARY: | ${runConfig.runConfigPath} | ${result.client_id} | ${result.request_name} | ${result.method} | ${result.api} | ${responseCode}`)
  }
  else {
    report.run.executions.forEach((execution) => {

      const request_name = execution.item.name.substring(0, 254)
      const method = execution.request.method.substring(0, 254)
      const domain = report.environment.name
      const api = execution.request.url.path.join('/');
      const session_id = findEnvironmentValue(report.environment.values, "SESSION_ID")
      const client_id = findEnvironmentValue(report.environment.values, "CLIENT_ID_REF")
      const starttime = report.run.timings.started
      const endtime = report.run.timings.completed || report.run.timings.started
      const thread_id = report.threadId
      // fill default values first
      var responseCode = -1
      var responseTime = -1
      var responseSize = 0
      if (execution.response) {
        responseCode = execution.response.code
        responseTime = execution.response.responseTime;
        responseSize = execution.response.stream.toString().length
      }

      // Store URL and response time in the map
      if (!urlResponseTimeMap[api]) {
        urlResponseTimeMap[api] = [];
      }
      urlResponseTimeMap[api].push(responseTime);

      result = {
        request_name,
        method,
        domain,
        api,
        session_id,
        client_id,
        starttime,
        endtime,
        responseCode,
        responseTime,
        responseSize,
        thread_id
      }
      performanceReport.push(result)
      console.log(result)
      console.log(`SUMMARY: | ${runConfig.runConfigPath} | ${result.client_id} | ${result.request_name} | ${result.method} | ${result.api} | ${responseCode}`)
    });

  }
  return performanceReport
}

async function publishReport(report, runConfig) {
  try {
    const performanceReport = await analyseReport(report, runConfig)
    if (globalConfig.reportDB === 'mysql') {
      await publishToMySQL(runConfig, performanceReport);
    } else if (globalConfig.reportDB === 'mongo') {
      await publishToMongoDB(runConfig, performanceReport);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = { analyseReport, publishReport }
