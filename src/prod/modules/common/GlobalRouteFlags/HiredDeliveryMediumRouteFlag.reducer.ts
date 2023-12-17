interface IRouteFlagProps{
    isThroughHiredDA?: boolean
}

export type IGlobalRouteFlagProps = undefined | IRouteFlagProps

export interface IHiredDMRouteFlagAction {
    readonly type: '@@hiredDMRouteFlag/SET_HIREDDM_ROUTEFLAG',
    payload?: IGlobalRouteFlagProps
  }

  export type tGlobalRouteFlagAction = IHiredDMRouteFlagAction

  export const GlobalRouteFlagReducer = (state: IRouteFlagProps = { isThroughHiredDA : false}, action: tGlobalRouteFlagAction) => {
    switch (action.type) {
      case '@@hiredDMRouteFlag/SET_HIREDDM_ROUTEFLAG':
        return action.payload
  
      default:
        return state
    }
}