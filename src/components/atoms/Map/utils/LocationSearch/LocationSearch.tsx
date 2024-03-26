// The Component which displays Search input with suggestions

import React, { useEffect, useRef, useState, useContext } from 'react'
import GooglePlacesAutocomplete, {
  geocodeByPlaceId
} from 'react-google-places-autocomplete'
import 'react-google-places-autocomplete/dist/index.min.css'
import {
  LocationSearchContainer,
  LocationSearchInput,
  ResultsContainer,
  Results,
  SearchIcon,
  CloseSuggestionIcon,
  StyledResult
} from './StyledLocationSearch'
import { getDefaultTheme } from './../../../../../utilities/theme'
import FontIcon from '../../../FontIcon'
import { useLeaflet } from 'react-leaflet'
import { GeocodingContext, IGeocodingContext } from '../..'
import { tSearchFieldAddressInfo } from '../../interfaces.d'
import { getAddressInfo, isArrayEqual } from '../../helperMethods'
import LL from 'leaflet'
const theme = getDefaultTheme()

/****
 * suggestion example
 * {
  "description": "Powai Lake, Powai, Mumbai, Maharashtra",
  "matched_substrings": [
    {
      "length": 10,
      "offset": 0
    }
  ],
  "place_id": "ChIJo6xQ__vH5zsRbDRmJ3PrN4Q",
  "reference": "ChIJo6xQ__vH5zsRbDRmJ3PrN4Q",
  "structured_formatting": {
    "main_text": "Powai Lake",
    "main_text_matched_substrings": [
      {
        "length": 10,
        "offset": 0
      }
    ],
    "secondary_text": "Powai, Mumbai, Maharashtra"
  },
  "terms": [
    {
      "offset": 0,
      "value": "Powai Lake"
    },
    {
      "offset": 12,
      "value": "Powai"
    },
    {
      "offset": 19,
      "value": "Mumbai"
    },
    {
      "offset": 27,
      "value": "Maharashtra"
    }
  ],
  "types": [
    "natural_feature",
    "establishment"
  ]
}
 */

interface ILocationSearch {
  google: any
  onLocationSelect: (
    position: any,
    searchText?: any,
    isMarkerDragged?: boolean,
    bounds?: any,
    zoom?: any,
    radius?: number,
    isCustomSearch?: boolean
  ) => void
  focusSearchPlace: boolean
  setIsMarkerDragged: (value: boolean) => void
  isMarkerDragged: boolean
  setSearchFieldAddressInfo: (info: tSearchFieldAddressInfo) => void
  setIsMapSearched: (value: boolean) => void
  isMapSearched: boolean
  currentPage: string
  // shouldReverseGeocode: boolean
}

const LocationSearch = (props: ILocationSearch) => {
  const {
    google,
    onLocationSelect,
    focusSearchPlace,
    isMarkerDragged,
    setIsMarkerDragged,
    setSearchFieldAddressInfo,
    setIsMapSearched,
    isMapSearched,
    currentPage
    // shouldReverseGeocode
  } = props
  const [curser, setCursor] = useState<any>(0)
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false)
  let listOfsuggestions: any = []
  const { map } = useLeaflet()
  const geocodingContext: IGeocodingContext = useContext(GeocodingContext)
  const position = geocodingContext?.geocoding?.position
  const searchText = geocodingContext?.geocoding?.searchText
  const [currentPosition, setCurrentPosition] = useState(
    geocodingContext?.geocoding?.position
  )
  const [searchValue, setSearchValue] = useState<string>('')
  const locationSearchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setSearchValue(geocodingContext?.geocoding?.searchText || '')
    LL.DomEvent.disableClickPropagation(locationSearchRef.current as HTMLElement);
  }, [])

  useEffect(() => {
    // is position getting changed then only go and find a loaction
    if(!currentPage){
      console.log("inside prev code, bhuma")
      try {
        if (
          position &&
          Number(currentPosition?.[0]) !== Number(position?.[0]) &&
          Number(currentPosition?.[1]) !== Number(position?.[1])
        ) {
          // if(!Number.isNaN(position[0]) ){
          setCurrentPosition(position)
          const geocoder = new google.maps.Geocoder()
          const latlngObj: any = {
            lat: Number(position?.[0]),
            lng: Number(position?.[1])
          }
  
          geocoder?.geocode(
            {
              latLng: latlngObj
            },
            function (responses: any) {
              if (responses && responses.length > 0) {
                let nearestResponse = responses['0']
                responses.forEach((res: any) => {
                  if (res?.types.includes('premise')) {
                    nearestResponse = res
                  }
                })
  
                const addressInfo: tSearchFieldAddressInfo = getAddressInfo(
                  // eslint-disable-next-line camelcase
                  nearestResponse?.address_components
                )
                addressInfo.position = position
                // if marker dragged / geocoding location search-> send dynamic address
                // if user searching on search field then send whatever user searched
                // addressInfo.searchText = isMarkerDragged
                //   ? nearestResponse.formatted_address
                //   : geocodingContext?.geocoding?.searchText
                setSearchFieldAddressInfo(addressInfo)
                // if dragged phenomenon explained in map file, first make it false
                // for such case onLocationSelect  send true so that the name we are getting through this api will get
                // reflcted in search input.If user manually search something or is coming through props then show user written value
                // to achieve that send false as a third arg
                if (isMarkerDragged) {
                  setIsMarkerDragged(false)
                  // setSearchValue(responses['0'].formatted_address)
                }
                // onLocationSelect(
                //   [Number(position?.[0]), Number(position?.[1])],
                //   // responses['0'].formatted_address,
                //   isMarkerDragged
                //     ? nearestResponse.formatted_address
                //     : geocodingContext?.geocoding?.searchText,
                //   !!isMarkerDragged
                // )
              }
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    }
    
  }, [position])

  useEffect(() => {
    const hasValidCoordinates = position && !isArrayEqual(position, [-200, -200]);

    if(currentPage==="alladdress"){
      try {
          // Only if cooridnates are valid do reverse geocode
          if (hasValidCoordinates) {
            const isSearchEmpty = !searchValue
            const areCoordinatesChanged = Number(currentPosition?.[0]) !== Number(position?.[0]) || Number(currentPosition?.[1]) !== Number(position?.[1])
            // Logic: searchText comes when user types in searchbar and comes as prop and searchValue is previous search or reverse geocoded result.
            // This check is added for non geocoded address. For such address we can't pass position as [-200, -200]; so if we have address typed we send that in searchbar. 
            const isValidSearch = searchText !== searchValue;

            // Reverse Geocode should only work either if searchField is empty or cooridnates are changed
            if (isSearchEmpty || (areCoordinatesChanged && isValidSearch)) {
              setCurrentPosition(position)
              const geocoder = new google.maps.Geocoder()
              const latlngObj: any = {
                lat: Number(position?.[0]),
                lng: Number(position?.[1])
              }

              geocoder?.geocode(
                {
                  latLng: latlngObj
                },
                function (responses: any) {
                  if (responses && responses.length > 0) {
                    let nearestResponse = responses['0']
                    responses.forEach((res: any) => {
                      if (res?.types.includes('premise')) {
                        nearestResponse = res
                      }
                    })

                    const addressInfo: tSearchFieldAddressInfo = getAddressInfo(
                      nearestResponse?.address_components
                    )
                    addressInfo.position = position
                    setSearchFieldAddressInfo(addressInfo)
                    setSearchValue(nearestResponse.formatted_address)
                    onLocationSelect(
                      [Number(position?.[0]), Number(position?.[1])],
                      nearestResponse.formatted_address,
                      !!isMarkerDragged
                    )

                    if (isMarkerDragged) {
                      setIsMarkerDragged(false)
                    }
                  }
                }
              )
            }
          }

      } catch (e) {
        console.log(e)
      }
    }
  }, [position])

  useEffect(() => {
    // if the searchtext is different that previous search and physically written or got through prop
    // not dragged one then find lat long and set in map file onLocationSelect which will trigger above useEffect for lat long
    if (
      position !== null &&
      searchText !== searchValue &&
      searchValue !== null &&
      searchText !== '' &&
      !isMarkerDragged
    ) {
      setSearchValue(searchText || '')
      // only if search through map,(search text not coming as a prop)then go inside this loop
      if (
        currentPosition &&
        position &&
        JSON.stringify(currentPosition) === JSON.stringify(position) &&
        isMapSearched
      ) {
        return onLocationSelect(position, searchText || '', false)
      }

      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: searchText }, function (
        results: any,
        status: any
      ) {
        if (status === google.maps.GeocoderStatus.OK) {
          let nearestLocation = results[0]
          results?.forEach((res: any) => {
            if (res?.types.includes('premise')) {
              nearestLocation = res
            }
          })
          const latitude = Number(nearestLocation.geometry.location.lat())
          const longitude = Number(nearestLocation.geometry.location.lng())
          
          onLocationSelect([latitude, longitude], searchText || '', false)
        }
      })
    }
  }, [searchText, isMarkerDragged])

  const googlePlacesAutocompleteRef: any = useRef()

  useEffect(() => {
    // if we dont want to focus search place. eg user wants change marker that time below variable will come false, just clear search value from search box
    if (!focusSearchPlace) {
      googlePlacesAutocompleteRef?.current?.clearValue()
    }
  }, [focusSearchPlace])

  useEffect(() => {
    if (googlePlacesAutocompleteRef?.current?.state?.value) {
      map?.doubleClickZoom.disable()
      map?.boxZoom.disable()
      map?.scrollWheelZoom.disable()
      map?.dragging.disable()
    }
  }, [googlePlacesAutocompleteRef?.current?.state?.value])

  // function when the location is selected/searched for
  const selectLocation = (suggestion: any, event: any) => {
    event.preventDefault()
    geocodeByPlaceId(suggestion?.place_id).then((results) => {
      let place = results[0]
      results?.forEach((res: any) => {
        if (res?.types.includes('premise')) {
          place = res
        }
      })

      const loc: any = place.geometry.location
      const locBounds: any = place.geometry.viewport
      const googleBounds = new google.maps.LatLngBounds()
      const formattedAddress = suggestion.description
      // place.formatted_address
      const addressInfo: tSearchFieldAddressInfo = getAddressInfo(
        // eslint-disable-next-line camelcase
        place?.address_components
      )

      setCurrentPosition([loc.lat(), loc.lng()])
      addressInfo.position = [loc.lat(), loc.lng()]
      addressInfo.searchText = formattedAddress

      setSearchFieldAddressInfo(addressInfo)
      googleBounds.union(locBounds)
      const bounds = [
        [googleBounds.getSouthWest().lat(), googleBounds.getSouthWest().lng()],
        [googleBounds.getNorthEast().lat(), googleBounds.getNorthEast().lng()]
      ]
      if (onLocationSelect !== undefined) {
        onLocationSelect([loc.lat(), loc.lng()], formattedAddress, true, bounds)
      }
    })
  }

  const removeGeocoding = () => {
    // this is when you add some thing in lat long field(geocoding layer) and try to clear something in searchfield
    // let geocoding layer find searchtext and then clear it
    setTimeout(() => {
      setSearchValue('')
    }, 600)
  }

  const handleInputKeyPress = (e: any) => {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && curser > 0) {
      setCursor(curser - 1)
    } else if (e.keyCode === 40) {
      setCursor(curser + 1)
    }
    setIsMapSearched(true)
    map?.doubleClickZoom.disable()
    map?.boxZoom.disable()
    map?.scrollWheelZoom.disable()
    map?.dragging.disable()
    if (e.keyCode === 13) {
      const selectedSuggestion =
        listOfsuggestions[curser] ||
        googlePlacesAutocompleteRef.current.state?.suggestions[curser]

      // set hovered selected value
      googlePlacesAutocompleteRef.current.changeValue(
        selectedSuggestion
          ? selectedSuggestion.description
          : googlePlacesAutocompleteRef.current.state.value
      )

      // set location on map
      selectLocation(selectedSuggestion, e)
      // set cursor on 0
      setCursor(0)
      // whenever you press enter your first value on the list gets selected so while rendering not to show any list of suggestion just set this flag
      setClickedSuggestion(true)
    } else {
      // whenever you press any other key (its for either remove or write anthing)that time to show the list of suggestion just set this flag to false
      setClickedSuggestion(false)
    }
  }

  return (
    <LocationSearchContainer ref={locationSearchRef}>
      <GooglePlacesAutocomplete
        placeholder='Search Places'
        ref={googlePlacesAutocompleteRef}
        initialValue={searchValue}
        // all the customizations for the search input
        renderInput={(props: any) => {
          return (
            <div className='custom-wrapper'>
              <SearchIcon className='icon icon-search' />
              <div>
                <LocationSearchInput
                  {...props}
                  placeholder='Search Places'
                  onKeyDown={handleInputKeyPress}
                  onFocus={() => {
                    // whenevr focus on input disable double click zooming
                    map?.doubleClickZoom.disable()
                    map?.boxZoom.disable()
                    map?.scrollWheelZoom.disable()
                    map?.dragging.disable()
                  }}
                  onBlur={() => {
                    // whenevr blue the input, enable again double click zooming
                    map?.doubleClickZoom.enable()
                    map?.boxZoom.enable()
                    map?.scrollWheelZoom.enable()
                    map?.dragging.enable()
                  }}
                />
                {props.value && googlePlacesAutocompleteRef?.current && (
                  <CloseSuggestionIcon
                    onClick={() => {
                      googlePlacesAutocompleteRef?.current?.clearValue()
                      removeGeocoding()
                    }}
                    className='icon icon-close'
                  />
                )}
              </div>
            </div>
          )
        }}
        // all the customization for the suggestions which appear
        renderSuggestions={(active, suggestions: any, onSelectSuggestion) => {
          listOfsuggestions = suggestions
          if (clickedSuggestion) {
            return <div />
          }
          return (
            <ResultsContainer className='suggestions-container'>
              {suggestions &&
                suggestions.map((suggestion: any, index: number) => {
                  // whatevr we type in input
                  const stateValue =
                    googlePlacesAutocompleteRef?.current?.state.value
                  // as given above first text
                  const primaryText = suggestion.structured_formatting.main_text
                  // greyed text in the list of suggestion
                  const secondoryText =
                    suggestion.structured_formatting.secondary_text

                  const lengthOfString = stateValue.length
                  const startIndexOFString = primaryText
                    .toLowerCase()
                    .indexOf(stateValue?.trim()?.toLowerCase())

                  const endIndex = startIndexOFString + lengthOfString
                  // in primary text whatever match with your input text make it bold
                  const matchedWord = primaryText.slice(0, endIndex)
                  // unmatched one make normal but in black color
                  const unMatchedWord = primaryText.slice(
                    endIndex,
                    primaryText.length
                  )
                  // check stateValue is substring of description if yes then make it bold or else inactive calss apply
                  return (
                    <StyledResult
                      key={index}
                      className={
                        curser === index ? 'active suggestion' : 'suggestion'
                      }
                    >
                      <FontIcon
                        variant='default-marker'
                        color={curser === index ? 'charts.red' : 'grey.500'}
                        size={15}
                        hoverColor='red'
                      />
                      <Results
                        style={{
                          backgroundColor: active
                            ? `${theme?.colors.grey[100]}`
                            : ''
                        }}
                        onClick={(event: any) => {
                          // whatever user select, find lat lng and send it to map/index.jsx and through there to geocoding layer where we flyToBound that location
                          selectLocation(suggestion, event)
                          // whenevr user select anything make this flag on so that we can dont show other suggestions on render
                          setClickedSuggestion(true)
                          // send that suggestions to google component to handle internally
                          onSelectSuggestion(suggestion, event)
                          // When draw-control is active, this will prevent the propagation of click to Map
                          LL.DomEvent.disableClickPropagation(event.currentTarget as HTMLElement);
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {matchedWord}
                        </span>
                        <span
                          style={{
                            fontWeight: 'normal',
                            fontSize: '14px',
                            color: '#000'
                          }}
                        >
                          {unMatchedWord} {', '}
                        </span>
                        <span className='inactive'>{secondoryText}</span>
                      </Results>
                    </StyledResult>
                  )
                })}
            </ResultsContainer>
          )
        }}
      />
    </LocationSearchContainer>
  )
}

export default LocationSearch
