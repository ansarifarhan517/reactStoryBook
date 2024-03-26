// function to decode the google polyline encoded, and give out the array of lat-lngs to plot the route
// import LL from 'leaflet'
import * as polyline from 'google-polyline'

const decodePolyline = function (encoded: string) {
  const points = polyline.decode(encoded)

  // // approximate the google points received to 10m accuracy
  // const simplifiedPoints = LL.LineUtil.simplify(points, 0.00001).map((point) => {
  //   return [point[0], point[1]]
  // })

  return points
}

export default decodePolyline
