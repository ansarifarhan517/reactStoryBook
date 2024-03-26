import { GoogleAPI } from 'google-maps-react'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import React, { Fragment } from 'react'
import { FeatureGroup } from 'react-leaflet'
import { IEditedData, IPolygon } from '../interfaces.d'
import LeafletPolygonEditLayer from './LeafletPolygonEditLayer'
import LeafletPolygonPlottingLayer from './LeafletPolygonPlottingLayer'

export interface ILeafletPolygonLayer extends ILeafletShapeLayer {
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent: any
  onEdit?: (data: IEditedData) => void
  setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
}
export interface ILeafletShapeLayer {
  polygon: IPolygon
  popupRef: any
  google: GoogleAPI
  popupCustomComponent: any
}

const LeafletPolygonLayer = ({
  polygon,
  createShape,
  setCreateShape,
  editPopUpComponent,
  popupRef,
  google,
  onEdit,
  popupCustomComponent,
  setFeatureGroupProps
}: ILeafletPolygonLayer) => {
  return (
    <Fragment>
      {(polygon?.editLayer || polygon.createPermission) && (
        <LeafletPolygonEditLayer
          editLayer={polygon?.editLayer}
          createPermission={polygon.createPermission || false}
          orinalCoordinatesKey={polygon?.editLayer?.orinalCoordinatesKey}
          onChange={(data: any) => onEdit && onEdit(data)}
          createShape={createShape}
          setCreateShape={setCreateShape}
          editPopUpComponent={editPopUpComponent}
          polygon={polygon}
          setFeatureGroupProps={setFeatureGroupProps}
        />
      )}
      <LeafletPolygonPlottingLayer
        polygon={polygon}
        popupRef={popupRef} // object to map popupRef
        google={google}
        popupCustomComponent={popupCustomComponent}
      />
    </Fragment>
  )
}

export default LeafletPolygonLayer
