import { IClientProperty, IClientPropertyActions } from './interfaces';


const ClientPropertiesReducer = (state: Record<string, IClientProperty> = {}, action: IClientPropertyActions) => {
  switch (action.type) {
    case '@@clientProperties/SET_PROPERTIES':
      const properties: Record<string, IClientProperty> = {}
      action.payload.forEach((property) => {
        properties[property.propertyKey] = property
      })

      return {
        ...state,
        ...properties,
      }
      return 

    default:
      return state
  }
}

export default ClientPropertiesReducer