// All the types exported for leaflet map will come here

// the type of the tiles which leaflet will consume
export type tTiles =
  | 'osm_standard'
  | 'google_satellite'
  | 'google_roadmap'
  | 'google_terrain'
  | 'google_hybrid'
  | 'osm_humanitarian'
  | 'osm_cycle'
  | 'osm_transport'

// Define the type of google mutant type - it is not exportable from library currently
export type tGoogleMutantType = 'roadmap' | 'satellite' | 'terrain' | 'hybrid'

export type tOSMMutatntType =
  | 'standard'
  | 'humanitarian'
  | 'cycle'
  | 'transport'

// map theme - light or dark
export type tTheme = 'light' | 'dark'
