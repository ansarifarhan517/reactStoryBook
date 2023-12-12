// function to simplify any polyline, and give out the array of lat-lngs to plot the route
import LL from 'leaflet'
// import * as polyline from 'google-polyline'

const simplifyPolyline = function (path: any[]) {
  //   const points = polyline.decode(encoded)

  // approximate the google points received to 10m accuracy
  const simplifiedPoints = LL.LineUtil.simplify(path, 0.000001).map((point) => {
    return [point[0], point[1]]
  })

  return simplifiedPoints
}

export default simplifyPolyline
