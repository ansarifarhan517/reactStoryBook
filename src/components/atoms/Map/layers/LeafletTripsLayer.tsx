// The layer which displays a trip - markers + trip path both

import React from 'react'
import AntPath from 'react-leaflet-ant-path'
import ILeafletMapProps from '../interfaces.d'
import GoogleRouteContainer from '../utils/GoogleIntegration/googleRoute'
import LeafletMarkerLayer from './LeafletMarkerLayer'
import HereMapsRouteContainer from '../utils/HereMapsIntegration/heremapsRoute'

interface ILeafletTripsLayer extends ILeafletMapProps {
  showModal: boolean
  heatMap: boolean
  focusSearchPlace: boolean
}

const LeafletTripsLayer = (props: ILeafletTripsLayer) => {
  const {
    popupRef,
    iconsRef,
    showModal,
    google,
    //  heatMap,
    focusSearchPlace
  } = props
  // if back to hub property is on, then append the first child again to the trip
  const wayPoints: any[] = []
  props.trips.data.forEach((trip: any) => wayPoints.push(...trip.waypoints))
  //  const positions = (props.trips?.config?.backToStart
  //     ? [wayPoints, wayPoints[0]]
  //     : wayPoints )?.map((point: any) => {
  //       return point.position
  //     });
  const latLngArr: any[] = []
  props.trips.data.forEach((trip: any) => {
    latLngArr.push(...trip.waypoints.map((e: any) => e.position))
  })
  const colorsList = props.trips.data.map((trip: any) => {
    return trip.color
  })

  const tripMarkerProps = {
    ...props,
    markers: {
      permission: true,
      entities: ['trips'],
      entitiesMap: {
        trips: {
          legends: ['hub', 'PickupLocation', 'DeliverLocation'],
          legendsMap: {
            hub: {
              value: 'hub',
              permission: true,
              id: 'hub',
              iconRef: 'hub',
              popupRef: 'hub',
              connect: true
            },
            PickupLocation: {
              value: 'PickupLocation',
              permission: true,
              id: 'PickupLocation',
              iconRef: 'pickupLocation',
              popupRef: 'pickupLocation',
              connect: true
            },
            DeliverLocation: {
              value: 'DeliverLocation',
              permission: true,
              id: 'DeliverLocation',
              iconRef: 'deliverLocation',
              popupRef: 'deliverLocation',
              connect: true
            }
          },
          permission: true,
          markers: {
            list: wayPoints,
            metaData: props.trips.metaData
          }
        }
      }
    }
  }

  console.log(
    'props.trips?.config?.mode',
    props.trips?.config?.mode,
    'props',
    props
  )
  return (
    <React.Fragment>
      {props.trips?.permission && props?.trips?.data?.length > 0 && (
        <React.Fragment>
          <LeafletMarkerLayer
            marker={tripMarkerProps.markers}
            popupRef={popupRef}
            iconsRef={iconsRef}
            showModal={showModal}
            google={google}
            heatMap={false}
            focusSearchPlace={focusSearchPlace}
            legendModel={false}
            ignoreMarkerPermission
            showLegendWrapper={false}
            showSequenceWrapperBox
          />
          {props?.modeOfTravel === 'Truck' && props?.trips?.data?.length < 250 && (
            <HereMapsRouteContainer
              {...props}
              positions={latLngArr}
              color={colorsList}
            />
          )}

          {props.trips?.config?.mode === 'aerial' &&
            props?.modeOfTravel !== 'Truck' &&
            props?.trips?.data?.length < 250 && (
              <AntPath
                positions={latLngArr}
                options={{
                  ...props.trips?.config,
                  hardwareAccelerated: true,
                  color: { color: colorsList }
                }}
              ></AntPath>
            )}

          {props.trips?.config?.mode === 'google' &&
            props?.modeOfTravel !== 'Truck' &&
            props?.trips?.data?.length < 250 && (
              //  props.trips.data.map((trip:any)=>{
              //    if(trip?.waypoints && trip.waypoints?.length){
              //     const positions = trip.waypoints.map((e:any) =>e.position);
              //     const color = trip.color;

              //    }
              //    return null;
              //  })
              <GoogleRouteContainer
                {...props}
                positions={latLngArr}
                color={colorsList}
              />
            )}

          {/* <div className='tripSequencer'>Hello man</div> */}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default LeafletTripsLayer
