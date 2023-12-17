import React, { ReactElement } from 'react'
import { UseFormMethods } from 'react-hook-form';
import styled from 'styled-components'
import { Grid } from 'ui-library'
import FormField from "./FormField";
import { ICircle, tSearchFieldAddressInfo } from '../Map/interface';
import { IMongoField } from '../../mongo/interfaces';
import MapDefault from "../Map/MapDefault";
import { Map } from "leaflet"

interface IAddressGeocodingProps {
    childNodes: Record<string, IMongoField>
    setMapSearched: (value: boolean) => void
    setAddressFieldsTouched?: Function
    formInstance: UseFormMethods<Record<string, any>>
    setPosition: (latLogObj: any) => any
    position: number[]
    searchText: string
    googleApiKey: string
    populateMapAddress?: Function
    type: string
    settingAPIParam:string
    isEditMode?:boolean
    legendConfig?: any
    isVisibleSetting?:boolean
    sx?:any,
    getCountryChange?:any
    setCountryState?:any
    countryKey?:string
    setCurrentCordinates?: (value:Array<number>) => void
    circle?: ICircle
    setMapProps?: React.Dispatch<React.SetStateAction<Map>>
    updateShapeBasedOnPosition?: boolean
}

export const AddressFieldsContainer = styled.div`
  width: 50%;
  padding: 0;
  display: block;
  > div {
    display: inline-block!important;
  }
`

export const MapContainer = styled.div`
  border-radius: 2px !important;
  box-shadow: 0px 2px 20px -10px #000 !important;
  background: #fff !important;
  padding: 2px;
  overflow: hidden;
  width: 100%;
  height: 350px;
  margin-top: -15px;

  #map_longitude + button {
    display: none;
  }
`;

export default function AddressGeocodingComponent(
    {
        childNodes,
        setMapSearched,
        setAddressFieldsTouched,
        formInstance,
        setPosition,
        position,
        searchText,
        googleApiKey,
        populateMapAddress,
        type,
        settingAPIParam,
        isEditMode,
        legendConfig,
        sx = {},
        isVisibleSetting = true,
        getCountryChange,
        setCountryState,
        countryKey,
        setCurrentCordinates = () => {},
        circle,
        setMapProps,
        updateShapeBasedOnPosition
    }: IAddressGeocodingProps): ReactElement {

    return (
        <>
            <AddressFieldsContainer>
                {Object.entries(childNodes).map(([key, value], index) => {

                    return (
                        index % 1 === 0 &&
                        <Grid key={key} container xs={12} sm={6} md={6} className="address-fields" spacing='0px 15px 0px 0px' style={{ width: '50%', marginRight: 0, padding: 0, display: 'iniine-block', alignItems: 'center' }}>
                            <Grid spacing='15px' item key={key} xs={12} sm={6} md={6} className='grid-item'>
                                <FormField name={key} meta={value} formInstance={formInstance} onChange={() => {
                                    if(countryKey === key && getCountryChange){
                                        getCountryChange(formInstance.getValues(value.id))
                                        // setCountryState(formInstance.getValues(value.id))
                                    }
                                    setMapSearched(false); 
                                    setAddressFieldsTouched && setAddressFieldsTouched(true) }} />
                            </Grid>
                        </Grid>
                    );
                })}
            </AddressFieldsContainer>
            <Grid container xs={12} sm={6} md={6} style={{ ...sx, width: '50%' }} >
                <MapContainer>
                    <MapDefault
                        type={type}
                        settingAPIParam={settingAPIParam}
                        geocoding={true}
                        getPositions={setPosition}
                        position={position}
                        searchTextData={searchText}
                        googleApiKey={googleApiKey}
                        sendLocationOutside={(address: tSearchFieldAddressInfo) => populateMapAddress && populateMapAddress(address)}
                        isEditMode={isEditMode}
                        legendConfig={legendConfig}
                        isVisibleSetting={isVisibleSetting}
                        getLatLong={setCurrentCordinates}
                        circle={circle}
                        setMapProps={setMapProps}
                        updateShapeBasedOnPosition={updateShapeBasedOnPosition}
                    />


                </MapContainer>
            </Grid>
        </>
    )
}
