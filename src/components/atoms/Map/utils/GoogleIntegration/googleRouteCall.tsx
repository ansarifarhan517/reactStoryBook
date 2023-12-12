import { RECURSIVE_CALL_ATTEMPT_LIMIT } from './../../constants/googleIntegration.constants'
import { googleLatLng, googleRoutesWaypoints } from './googleLatLngConversion'
import decodePolyline from './decodePolyline'

const googleRouteCall = async (props: any, waypoints: any[], iteration = 0) => {
  return new Promise<any[]>((resolve, reject) => {
    let decodedPolylineArray: any[] = []

    if (!iteration || iteration < RECURSIVE_CALL_ATTEMPT_LIMIT) {
      // if the iteration is within the recursie limit, fire the call,
      // else simply plot original waypoints as the aerial path

      const google = props.google
      const directionsService = new google.maps.DirectionsService()
      const directionsRequest = {
        origin: googleLatLng(waypoints[0]),
        destination: googleLatLng(waypoints[waypoints.length - 1]),
        waypoints: googleRoutesWaypoints(waypoints),
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      }

      directionsService.route(directionsRequest, function (
        response: any,
        status: string
      ) {
        if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
          setTimeout(async () => {
            // over query limit, fire the same call after 2 seconds
            decodedPolylineArray = await googleRouteCall(
              props,
              waypoints,
              iteration++
            )
          }, 2000)
        } else if (status === google.maps.DirectionsStatus.OK) {
          if (response?.routes?.['0']?.legs) {
            response.routes['0'].legs.forEach(function (leg: any) {
              if (leg && leg.steps) {
                leg.steps.forEach(function (step: any) {
                  // add the encoded polyline to the string
                  decodedPolylineArray.push(
                    decodePolyline(step.polyline.points.toString())
                  )
                })
              }
            })
          }
          resolve(decodedPolylineArray)
        } else {
          reject(decodedPolylineArray)
        }
      })
    } else {
      // iterations over, simply plot original waypoints as the aerial path
      decodedPolylineArray = waypoints
      reject(decodedPolylineArray)
    }
  })
}

export default googleRouteCall
