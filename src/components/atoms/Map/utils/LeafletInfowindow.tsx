// The Component which displays Search input with suggestions

import React, { Fragment, useEffect, useState } from 'react'
import { getGeoLocation } from '../helperMethods'
import { StyledLabel } from '../StyledMap'

const getValue = (
  data: any,
  definitions: any,
  dataKey: any,
  dataIndex: number,
  popupCustomComponent: any
) => {
  if (definitions[dataKey] && definitions[dataKey].dataType === 'text') {
    const unitValue = definitions[dataKey]?.unit
      ? definitions[dataKey]?.unit
      : ''
    const value = data ? (data[dataKey] ? data[dataKey] : 'Not Available') : ''
    const parsedValue = unitValue ? parseFloat(value).toFixed(2) : value
    return (
      <div
        key={dataIndex + dataKey}
        className={`title ${definitions?.[dataKey]?.classList}`}
      >
        <StyledLabel>{definitions?.[dataKey]?.labelKey}</StyledLabel>

        <span className='value'>{parsedValue + ' ' + unitValue}</span>
      </div>
    )
    // eg: isHighAlert : High Alert or Low Alert
  } else if (
    definitions[dataKey] &&
    definitions[dataKey].dataType === 'boolean'
  ) {
    const value = data[definitions[dataKey].dataKey]
      ? definitions[dataKey].trueValue
      : definitions[dataKey].falseValue

    return (
      <div
        key={dataIndex + dataKey}
        className={`title ${definitions?.[dataKey]?.classList}`}
      >
        <StyledLabel>{definitions?.[dataKey]?.labelKey}</StyledLabel>
        <span className='value'>{value}</span>
      </div>
    )
  } else if (
    // eg: coordinate: londitude, latitude
    definitions[dataKey] &&
    definitions[dataKey].dataType === '_thisDependent'
  ) {
    const value = definitions[dataKey]?.dataKey?.map((key: string) => data[key])
    return (
      <div
        key={dataIndex + 'dependent'}
        className={`title ${definitions?.[dataKey]?.classList}`}
      >
        <StyledLabel>{definitions?.[dataKey]?.labelKey}</StyledLabel>
        <span className='value'>{value.join()}</span>
      </div>
    )
  } else if (definitions[dataKey].dataType === '_thisComponent') {
    // phone number : icon 90000334343 - format
    const setHtmlData = definitions[dataKey]?.html

    return (
      <div
        style={{ display: 'flex' }}
        key={dataIndex + dataKey}
        className={`title ${definitions?.[dataKey]?.classList}`}
      >
        {definitions?.[dataKey]?.labelKey && (
          <StyledLabel>{definitions?.[dataKey]?.labelKey}</StyledLabel>
        )}
        <span className='value' style={{ display: 'inline' }}>
          {setHtmlData({
            value: data?.[definitions[dataKey]?.dataKey]
          })}
        </span>
      </div>
    )
  } else if (definitions[dataKey].dataType === 'component') {
    return popupCustomComponent?.[dataKey]({ selectedData: data })
  }
  return <Fragment key={dataIndex + dataKey} />
}

// to find location on click of popup(called only once )
const Location = ({
  latlngObj,
  google,
  data,
  dataIndex,
  labelKey,
  dataKey,
  classList
}: any) => {
  // modify data once you get location,by putting actual location
  const [_data, setData] = useState(data)
  // initially data will not be there that time dont show location,once finder gives it update location feild
  const [showLocation, setShowLocation] = useState(false)
  useEffect(() => {
    // find the geo location by geocoder finder
    latlngObj &&
      getGeoLocation(latlngObj, google, _data, setData, setShowLocation)
  }, [])
  return showLocation ? (
    <div key={dataIndex + 'location'} className={classList}>
      <StyledLabel>{labelKey}</StyledLabel>
      <span className='value'>{_data[dataKey]}</span>
    </div>
  ) : null
}

const LeafletInfowindow = (props: any) => {
  const infowindowStructure = props?.structures
  const infoWindow = infowindowStructure?.[props.popupRef]
  const permissions = props.popupRef && infoWindow?.permissions
  const popupCustomComponent = props?.popupCustomComponent

  const definitions = props.popupRef && infoWindow?.definitions
  // if lat lng object available and wants to show _thisLocation on tooltip then only caluclate location
  console.log('LeafletInfowindow.tsx',props);
  return (
    <Fragment>
      {props.popupRef &&
        permissions &&
        permissions.map((dataKey: string, dataIndex: number) => {
          return (
            <Fragment key={`${dataKey}_${dataIndex}`}>
              {definitions[dataKey].dataType === '_thisLocation' ? (
                <Location
                  latlngObj={props?.latlngObj}
                  google={props?.google}
                  data={props?.data}
                  dataIndex={dataIndex}
                  labelKey={definitions[dataKey]?.labelKey}
                  dataKey={dataKey}
                  classList={definitions[dataKey]?.classList}
                />
              ) : (
                getValue(
                  props?.data,
                  definitions,
                  dataKey,
                  dataIndex,
                  popupCustomComponent
                )
              )}
            </Fragment>
          )
        })}
    </Fragment>
  )
}

export default React.memo(LeafletInfowindow)
