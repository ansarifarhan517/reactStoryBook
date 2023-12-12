// The marker layer which will display all the markers and marker clusters

import React, { useState, useRef } from 'react'
import { useLeaflet } from 'react-leaflet'
import Checkbox from '../../Checkbox'
import { CheckBoxLabel } from '../../Checkbox/Checkbox.styled'
import { convertArrayToObject } from '../helperMethods'
import MarkerComponent from '../SubComponent/Marker'
import { LegendsWrapper, SequenceIcon } from './../utils/Legends/StyledLegends'
import {
  SequenceWrapper,
  TripIconWrapper
} from './../utils/GoogleIntegration/StyledSequenceBar'
// import { ReactComponent as Right , } from '../../../../assets/map/right.svg'
import FontIcon from '../../FontIcon'

interface IMarkerLayer {
  legendModel?: any
  popupRef: any
  iconsRef: any
  marker: any
  showModal: boolean
  updateMarkers?: (marker: any) => void
  google: any
  focusMarkerId?: string
  heatMap: boolean
  geocoding?: any
  focusSearchPlace: boolean
  ignoreMarkerPermission?: boolean
  handleCallback?: any
  showLegendWrapper?: boolean
  showSequenceWrapperBox?: boolean
}

const htmlDecode = (input: string) => {
  var e = document.createElement('div')
  e.innerHTML = input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
}
interface ILegendWrapperBox {
  map: any
  entitiesMap: any
  entity: any
  setLegendModel: any
  heatMap: boolean
  updateMarkers: any
  iconsRef: any
}

interface ISequenceWrapperBox {
  markers: Array<{
    iconRef: string
    id: string
    popupRef: string
    position: Array<Number>
    title: string
    type: string
    sequence: Number
    icon: {
      iconLocation: string
      iconAnchor: [number, number]
      divIcon: boolean
      html: string
    }
  }>
}

const ShowMarkerIcon = (props: any) => {
  const { icon, lastIndex } = props
  const html = icon.html ? icon.html : htmlDecode(icon)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: lastIndex ? '5px' : '0 5px'
      }}
    >
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      {!lastIndex && (
        <div style={{ marginLeft: '5px' }}>
          {/* <Right width='20px' opacity='0.5' className='marker-connector' /> */}
          <div style={{ width: '20px', opacity: '0.5' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='24px'
              viewBox='0 0 24 24'
              width='24px'
              fill='#000000'
            >
              <path d='M0 0h24v24H0V0z' fill='none' />
              <path d='M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z' />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
const LegendWrapperBox = ({
  map,
  entitiesMap,
  entity,
  setLegendModel,
  heatMap,
  updateMarkers,
  iconsRef
}: ILegendWrapperBox) => {
  const ref = useRef(null)
  const [refNew, setRefNew] = useState(ref)
  // console.log(
  //   map,
  //   entitiesMap,
  //   entity,
  //   setLegendModel,
  //   heatMap,
  //   updateMarkers,
  //   iconsRef,
  //   ref
  // )
  React.useEffect(() => {
    setRefNew(ref)
  }, [ref])

  const scroll = (scrollOffset: number) => {
    if (refNew && refNew.current !== null) {
      const newObj: any = { ...refNew }
      newObj.current.scrollLeft = newObj.current.scrollLeft + scrollOffset
      console.log(newObj.current.scrollLeft, 'newObj.current.scrollLeft')
      setRefNew(newObj)
    }
  }

  const eligibleEntities = entitiesMap?.[entity]?.legends?.filter(function (
    _legendName: any,
    index: number
  ) {
    if (index >= 4) {
      return false // skip
    }
    return true
  })
  return (
    <LegendsWrapper
      onClick={() => {
        // disable zoom option when u click on legend
        map?.doubleClickZoom.disable()
        map?.boxZoom.disable()
        map?.scrollWheelZoom.disable()
        map?.dragging.disable()
      }}
    >
      <div onClick={() => scroll(-20)}>
        <FontIcon variant='angle-left-thin' size='xs' color='black' />
      </div>
      <div className='legend-wrapper' ref={refNew}>
        {eligibleEntities.map((legendName: any, index: number) => {
          const entry = entitiesMap?.[entity]?.legendsMap[legendName]
          const isConnect = entry?.connect
          const showLegendIcon = entry?.icon || iconsRef?.iconRef
          return entry?.permission ? (
            isConnect && showLegendIcon?.html_sequence ? (
              <ShowMarkerIcon
                entry={entry}
                icon={showLegendIcon}
                key={index}
                lastIndex={eligibleEntities.length - 1 === index}
              />
            ) : (
              <div
                key={entry.id}
                title={`${entry.value} ${
                  entry?.extraInfo ? `(${entry?.extraInfo})` : ''
                }`}
                style={{
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  marginRight: '10px',
                  marginTop: '5px',
                  textOverflow: 'ellipsis'
                }}
              >
                <Checkbox
                  id={entry.value}
                  onChange={(_e) =>
                    legendToggled(
                      entry.id,
                      !entry.checked,
                      Object.values(entitiesMap?.[entity]?.legendsMap),
                      setLegendModel,
                      updateMarkers,
                      map
                    )
                  }
                  customStyle='border-radius:2px;'
                  disabled={!!entry.disabled}
                  checked={!!entry.checked}
                  labelComponent={
                    <>
                      <CheckBoxLabel
                        style={{
                          fontSize: '13px',
                          marginBottom: '0.5em',
                          color: '#000'
                        }}
                        htmlFor={entry.value}
                      >
                        {`${entry.value}
                      ${entry?.extraInfo ? `(${entry?.extraInfo})` : ''}`}
                      </CheckBoxLabel>
                    </>
                  }
                  checkboxSize='md'
                  color={heatMap ? '#979797' : entry?.color}
                />
              </div>
            )
          ) : null
        })}
      </div>
      <div onClick={() => scroll(20)}>
        <FontIcon variant='angle-right-thin' size='xs' color='black' />
      </div>
    </LegendsWrapper>
  )
}

const SequenceWrapperBox = ({ markers }: ISequenceWrapperBox) => {
  const seqRef = useRef(null)
  const [sequenceRef, setSequenceRef] = useState(seqRef)
  React.useEffect(() => {
    setSequenceRef(seqRef)
  }, [seqRef])
  //left button
  const LeftButton = () => (
    <div onClick={() => scroll(-20)} style={{ alignSelf: 'center' }}>
      <FontIcon variant='angle-left-thin' size='xs' color='black' />
    </div>
  )
  //right button
  const RightButton = () => (
    <div onClick={() => scroll(20)} style={{ alignSelf: 'center' }}>
      <FontIcon variant='angle-right-thin' size='xs' color='black' />
    </div>
  )
  // callback
  const scroll = (scrollOffset: number) => {
    if (sequenceRef && sequenceRef.current !== null) {
      const newObj: any = { ...sequenceRef }
      newObj.current.scrollLeft = newObj.current.scrollLeft + scrollOffset
      console.log(newObj.current.scrollLeft, 'newObj.current.scrollLeft')
      setSequenceRef(newObj)
    }
  }

  const handleCallBack = (id: string) => {
    console.log('handleCallBack', id)
    // document.getElementsByClassName(id)?.click();
  }

  return (
    <SequenceWrapper>
      <LeftButton />
      <TripIconWrapper ref={sequenceRef}>
        {markers.map((marker, index) => {
          return (
            <SequenceIcon onClick={() => handleCallBack(marker.id)}>
              <ShowMarkerIcon
                icon={marker.icon}
                lastIndex={index === markers.length - 1}
                sequenceBox={true}
                sequence={marker.sequence}
              ></ShowMarkerIcon>
            </SequenceIcon>
          )
        })}
      </TripIconWrapper>

      <RightButton />
    </SequenceWrapper>
  )
}

// function called whenever a legend is toggled
const legendToggled = (
  checkboxId: any,
  checked: boolean,
  checkOptions: any,
  setLegendModel: any,
  updateMarkers: any,
  _map: any
) => {
  const newModelArray = checkOptions.map((opn: any) => {
    const newOpn = opn
    newOpn.checked = opn.id === checkboxId ? checked : newOpn.checked
    return newOpn
  })
  // dewanshs code
  // const newCheckOptions: any = {}
  // checkOptions.forEach((item: any) => {
  //   if (!item.disabled && checkboxId === item.id) {
  //     newCheckOptions[item.id] = { ...item, checked: checked }
  //   } else {
  //     newCheckOptions[item.id] = item
  //   }
  // })
  const legendObj = convertArrayToObject(newModelArray, 'id')
  setLegendModel(legendObj)
  // send updated legend list in array

  updateMarkers(newModelArray)
}
// The layer with actual markers and marker clustering
const LeafletMarkerLayer = (props: IMarkerLayer) => {
  const {
    marker,
    iconsRef,
    popupRef,
    updateMarkers,
    heatMap,
    showModal,
    geocoding,
    focusSearchPlace,
    ignoreMarkerPermission,
    showLegendWrapper = true,
    showSequenceWrapperBox = false
  } = props
  // the actual model of legends in this marker layer, when user toggled on legend on map this legend model gets changed
  const [legendModel, setLegendModel] = useState(props.legendModel)
  const entities = marker?.entities
  const entitiesMap = marker?.entitiesMap
  const { map } = useLeaflet()
  console.log('LeafletMarkerLayer.tsx ===>', props)
  React.useEffect(() => {
    // on toggle of a legend, update the marker layers
    // todo: proper optimized support of multiple entities in 1 map
    // todo: memoization of markers/layers which have not changed
    setLegendModel(props.legendModel) // whenever it gets trigger from settings, this value will force to update legend on map as well
  }, [props.legendModel])

  // if heatmap or marker map show legendWrapperbox (settingbox modal should be closed)
  // cluster we are showing only in marker map
  // for heatmap we have seperate heatlayer
  return (
    <React.Fragment>
      {marker?.permission || heatMap
        ? marker?.entities?.map((entity: string, i: number) => {
            console.log('LeafletMarkerLayer.tsx', entity, entitiesMap)
            return (
              entitiesMap?.[entity].permission && (
                <React.Fragment key={i}>
                  {/* The marker group which has clustering on. if heatmap enable then dont show cluster */}
                  {console.log(
                    'LeafletMarkerLayer.tsx',
                    entity,
                    entitiesMap,
                    heatMap
                  )}
                  {!heatMap && (
                    <MarkerComponent
                      entities={entities}
                      entitiesMap={entitiesMap}
                      iconsRef={iconsRef}
                      popupRef={popupRef}
                      legendModel={legendModel}
                      google={google}
                      focusMarkerId={props.focusMarkerId}
                      geocoding={geocoding}
                      focusSearchPlace={focusSearchPlace}
                      ignoreMarkerPermission={ignoreMarkerPermission}
                    />
                  )}

                  {/* Legends box which controls which markers to show, show only if setting is not open */}
                  {!showModal && showLegendWrapper && (
                    <LegendWrapperBox
                      map={map}
                      entitiesMap={entitiesMap}
                      entity={entity}
                      setLegendModel={setLegendModel}
                      heatMap={heatMap}
                      updateMarkers={updateMarkers}
                      iconsRef={iconsRef}
                    />
                  )}

                  {!showModal && showSequenceWrapperBox && (
                    <SequenceWrapperBox
                      markers={entitiesMap?.[entity]?.markers?.list}
                    />
                  )}
                </React.Fragment>
              )
            )
          })
        : undefined}
    </React.Fragment>
  )
}

export default LeafletMarkerLayer
