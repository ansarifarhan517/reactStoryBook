// generates the google declared way of declaring a lat-lng
export const googleLatLng = (latLngPoint: any[]) => {
  return { lat: latLngPoint[0], lng: latLngPoint[1] }
}

// generates the google declared way of declaring an array of lat-lngs
export const googleLatLngs = (latLngArray: any[]) => {
  return latLngArray.map((point) => {
    return googleLatLng(point)
  })
}

// generates the google declared way of passing the wayoints in the routes API
export const googleRoutesWaypoints = (latLngArray: any[]) => {
  return googleLatLngs(latLngArray).map((point) => {
    return { location: { ...point } }
  })
}
