export interface IClientProperty {
  clientId: number,
  clientPropertyId: number,
  createdByUserId: number,
  createdOnDt: number,
  isActiveFl: boolean
  isDeleteFl: 'Y' | 'N'
  propertyKey: string
  propertyType: string
  propertyValue: any
  updatedByUserId: number
  updatedOnDt: number
}

/** Actions */
export interface ISetClientPropertiesAction {
  readonly type: '@@clientProperties/SET_PROPERTIES'
  payload: IClientProperty[]
}

export type IClientPropertyActions =
  | ISetClientPropertiesAction