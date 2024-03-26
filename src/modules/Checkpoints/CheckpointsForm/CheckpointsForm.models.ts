import { ICircle, IPolygon } from "../../../utils/components/Map/interface";

export interface IFormFields {
    [key: string]: any
}

export interface IDropdownData {
    options: any;
    mapping: Object;
}

export interface IShiftTimingsObject {
    id?: string;
    fromValue?: Date;
    toValue?: Date;
}

export interface IMapState {
    circle: ICircle;
    polygon: IPolygon;
  }
  
  export interface ICircleEditData {
    position: [number, number];
    radius: number;
  }
  
  export interface IPolygonEditData {
    coordinates: IPolygonPayload[];
    area: number;
  }
  
  export enum MapShapes {
    CIRCLE = "CIRCLE",
    POLYGON = "POLYGON",
  }
  
  export interface IPolygonPayload {
    latitude: number;
    longitude: number;
  }
  
  export type TSelectedDrawType = MapShapes.CIRCLE | MapShapes.POLYGON | "";

  export interface IGeocodingError {
    lat: boolean;
    lng: boolean;
  }
  