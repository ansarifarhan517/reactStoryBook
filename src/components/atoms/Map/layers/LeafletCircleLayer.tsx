import { GoogleAPI } from 'google-maps-react'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import React, { Fragment } from 'react'
import { FeatureGroup } from 'react-leaflet'
import { ICircle, IEditedData } from '../interfaces.d'
import LeafletCircleEditLayer from './LeafletCircleEditLayer'
import LeafletCirclePlottingLayer from './LeafletCirclePlotting'

export interface ILeafletCircleLayer extends ILeafletShapeLayer {
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent?: ({ map }: any) => React.ReactNode
  onEdit?: (data: IEditedData) => void
  setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
}
export interface ILeafletShapeLayer {
  circle: ICircle
  popupRef: any
  google: GoogleAPI
  popupCustomComponent: any
}

const LeafletCircleLayer = ({
  circle,
  createShape,
  setCreateShape,
  editPopUpComponent,
  popupRef,
  google,
  onEdit,
  setFeatureGroupProps,
  popupCustomComponent
}: ILeafletCircleLayer) => {
  return (
    <Fragment>
      {(circle?.editLayer || circle.createPermission) && (
        <LeafletCircleEditLayer
          onChange={(data: any) => onEdit && onEdit(data)}
          createShape={createShape}
          setCreateShape={setCreateShape}
          editPopUpComponent={editPopUpComponent}
          circle={circle}
          setFeatureGroupProps={setFeatureGroupProps}
        />
      )}
      <LeafletCirclePlottingLayer
        circle={circle}
        popupRef={popupRef} // object to map popupRef
        google={google}
        popupCustomComponent={popupCustomComponent}
      />
    </Fragment>
  )
}

export default LeafletCircleLayer
