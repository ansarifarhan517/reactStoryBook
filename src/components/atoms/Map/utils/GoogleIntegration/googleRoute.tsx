import React, { useState, useEffect } from 'react'
import 'google-maps-react'
import AntPath from 'react-leaflet-ant-path'
import googleRouteCall from './googleRouteCall'
import prepareCallStack from './prepareRouteCallStack'

const GoogleRouteContainer = (props: any) => {
  // INPUT - set on 'n' waypoints
  // OUTPUT - set of route components for the waypoints (not necessarily 1)
  // ALGO
  // A : prepareCallStack
  // 1. Internally, from the n waypoints received, batch the waypoints into a threshold of 8 calls
  // 2. For all batches, maintain a map where key is the stringified lat - lng, and value is the markers received from call
  // 3. Fire the calls using the function (googleRouteCall)
  // 4. If QUERY limit is reached, give this call a 2 second timeout and then resend, untill the attempt count for that call RECURSIVE_CALL_ATTEMPT_LIMIT is maxed out.
  // 5. If NULL response(no routes) is received, just return the aerial route of the points and update latLngPathMapping & pendingCallsStack
  // 6. If a response of routes is recieved, then iteratively extract the waypoints / route out of the response and update latLngPathMapping & pendingCallsStack
  // C :
  // 9. In parallel, keep plotting the AntPath from latLngPathMapping.
  // 10. Later Optimization: Use use-memo + In localStorage/sessionStorage = cache the pendingCallsStack for reducing the google calls as well.

  const [paths, setPaths] = useState(prepareCallStack(props.positions) as any)

  useEffect(() => {
    const newPaths = prepareCallStack(props.positions)
    newPaths.forEach(async (path: any, index: number) => {
      newPaths[index].path = await googleRouteCall(props, path.points)
      console.log(newPaths[index].path)
      setPaths(newPaths)
    })
  }, [props])

  return (
    <React.Fragment>
      <GoogleRoutePresentation {...props} paths={paths} />
    </React.Fragment>
  )
}

const GoogleRoutePresentation = (props: any) => {
  console.log('GoogleRoutePresentation',props);

  return (
    <React.Fragment>
      {props.paths?.map((route: any, index: number) => {
        if (!route.path.length) {
          return <AntPath key={index} positions={route.points} options={{color:props.color[index]}}/>
        } else {
          return <AntPath key={index} positions={route.path} options={{color:props.color[index]}}/>
        }
      })}
    </React.Fragment>
  )
}

export default GoogleRouteContainer
