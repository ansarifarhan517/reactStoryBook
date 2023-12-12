// the type of the action which Locationsearch will consume
export type onLocationSelectFunc = (
  position: any,
  searchText?: any,
  zoom?: any,
  bounds?: any
) => void
