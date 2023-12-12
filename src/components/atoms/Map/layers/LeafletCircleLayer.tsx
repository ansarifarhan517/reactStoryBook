import { GoogleAPI } from 'google-maps-react'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import React, { Fragment } from 'react'
import { ICircle, IEditedData } from '../interfaces.d'
import LeafletCircleEditLayer from './LeafletCircleEditLayer'
import LeafletCirclePlottingLayer from './LeafletCirclePlotting'

export interface ILeafletCircleLayer extends ILeafletShapeLayer {
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent?: ({ map }: any) => React.ReactNode
  onEdit?: (data: IEditedData) => void
}
export interface ILeafletShapeLayer {
  circle: ICircle
  popupRef: any
  google: GoogleAPI
}

const LeafletCircleLayer = ({
  circle,
  createShape,
  setCreateShape,
  editPopUpComponent,
  popupRef,
  google,
  onEdit
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
        />
      )}
      <LeafletCirclePlottingLayer
        circle={circle}
        popupRef={popupRef} // object to map popupRef
        google={google}
      />
    </Fragment>
  )
}

export default LeafletCircleLayer
