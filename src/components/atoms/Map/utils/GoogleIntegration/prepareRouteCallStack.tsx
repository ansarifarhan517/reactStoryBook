import { ROUTE_BATCH_LIMIT } from './../../constants/googleIntegration.constants'

const prepareCallStack = (waypoints: any[]) => {
  // prepare the proper batching for the waypoints in a multiple of 8's
  // and prepare the intermediate data for the maintenance of actual google call fires

  const pendingCallsStack = []
  let latlngHash = ''
  let prevEndIndex = 0

  for (let i = 0; i < waypoints?.length; i++) {
    if (
      (i && (i + 1) % ROUTE_BATCH_LIMIT === 0) ||
      i === waypoints.length - 1
    ) {
      // if a multiple of 8 is encountered, then commit the current batch to path mapping, and restart the hash for next batch
      // or if this is the last waypoint of the array, commit till here only
      pendingCallsStack.push({
        key: latlngHash, // the unique key of this call
        points: waypoints.slice(prevEndIndex, i + 1), // the lat lngs in this call
        path: [] as any // the actual path generated from google or otherwise, which will get plotted
      })

      latlngHash = ''
      prevEndIndex = i
    }

    latlngHash += waypoints[0] + waypoints[1]
  }

  return pendingCallsStack
}

export default prepareCallStack
