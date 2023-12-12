import React from 'react'
import { mount } from '../../../../../../jest.setup'
import LocationSearch from './LocationSearch'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Map from '../../index'
const fn = jest.fn()
describe('LocationSearch Input Unit testing..', () => {
  it('is truthy', () => {
    expect(LocationSearch).toBeTruthy()
  })

  it('should render suggestion input', () => {
    const suggestionWrapper = mount(
      <GooglePlacesAutocomplete apiKey='AIzaSyCjiaID1JW2sH7unnqrtsIlopaCU959-GA' />
    )
    expect(suggestionWrapper.find('input[type="text"]').length).toBe(1)
  })
  it('should render suggestions', () => {
    const container = mount(
      <GooglePlacesAutocomplete
        // onSelectSuggestion={fn}
        renderSuggestions={fn}
        onSelect={fn}
        // description={['mumbai, maharashtra']}
        renderInput={(props) => <input {...props} />}
      />
    )
    container.find('input').simulate('change')
    expect(fn).toBeCalled()
  })

  it('should render Map', () => {
    const Mapcontainer = mount(
      <Map
        googleApiKey='gaege'
        tiles='google_hybrid'
        id=''
        classes=''
        onLocationSelect={fn}
        locationSearch
        zoomControl
        height='200'
        width='400'
        zoom={4}
        position={[37.7749, -122.4194]}
        markers={[]}
        center={[37.7749, -122.4194]}
      >
        Test
      </Map>
    )
    expect(Mapcontainer.find('.leaflet-marker-icon').length).toBe(1)
  })
})
