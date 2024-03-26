import L from 'leaflet';
import React, { useEffect, useRef } from 'react'
import { Box, Tooltip } from "ui-library"
import { ShapeButton } from '../CheckpointsListView/CheckpointsListViewStyledComponent';
import { Circle, Polygon } from './ShapeSVG';
import { MapShapes, TSelectedDrawType } from '../CheckpointsForm/CheckpointsForm.models';
import { ISelectedMapTypeProps } from '../CheckpointsListView/CheckpointsListView.models';

const SelectMapType = ({ selectedShape, setSelectedShape, drawActive, enableDraw, deleteShape }: ISelectedMapTypeProps) => {
  const circleBtn = useRef<HTMLDivElement | null>(null);
  const PolygonBtn = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    //disable click propagation from shape selection buttons to map
    L.DomEvent.disableClickPropagation(circleBtn.current as HTMLElement);
    L.DomEvent.disableClickPropagation(PolygonBtn.current as HTMLElement);
  },[]);

  const handleClick = (id: string) => {
    setSelectedShape(id as TSelectedDrawType);
    if(!drawActive) {
      deleteShape();
      enableDraw();
    }
  };

    return (
      <>
      <Tooltip message={"Polygon"} hover={true} align="right" arrowPlacement="center" messagePlacement="center" tooltipDirection="left">
        <Box className="leaflet-bar" style={{ marginBottom: "15px" }}>
          <ShapeButton ref={PolygonBtn} id={`checkpoints-draw-${selectedShape?.toLowerCase()}-button`} onClick={() => handleClick(MapShapes.POLYGON)} drawActive={selectedShape === MapShapes.POLYGON && drawActive}>
            <Polygon isActive={selectedShape === MapShapes.POLYGON && drawActive} />
          </ShapeButton>
        </Box>
      </Tooltip>
      <Tooltip message={"Circle"} hover={true} align="right" arrowPlacement="center" messagePlacement="center" tooltipDirection="left">
        <Box className="leaflet-bar">
          <ShapeButton ref={circleBtn}  id={`checkpoints-draw-${selectedShape?.toLowerCase()}-button`} onClick={() => handleClick(MapShapes.CIRCLE)} drawActive={selectedShape === MapShapes.CIRCLE && drawActive}>
              <Circle isActive={selectedShape === MapShapes.CIRCLE && drawActive} />
          </ShapeButton>
        </Box>
      </Tooltip>
      </>
    
    )

}

export default SelectMapType