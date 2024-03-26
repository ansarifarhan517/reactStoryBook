import React from 'react'
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from './AlertProfilesMaster.actions'
import { Dispatch } from 'redux'
import { tAlertProfilesMasterProfileType, ICurrentStep } from './AlertProfilesMaster.models'
import { withReactOptimized } from '../../../utils/components/withReact'
import AlertSettings from './components/AlertSettings'
import AlertLists from './components/AlertLists'
import AlertProfiles from './components/AlertProfile'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import { AlertProfilesMasterContainer } from './styles'

// export const basename = '/settings/alertProfiles'
export const basename = ''

interface IAlertProfilesMasterEntryProps {
  currentStep: ICurrentStep
  queryParams: {
    module: string
    subModule: tAlertProfilesMasterProfileType
  }
}
const AlertProfilesMasterEntry = ({ queryParams: { subModule }, currentStep }: IAlertProfilesMasterEntryProps) => {

  const history = useHistory()
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.alertProfilesMaster)

  React.useEffect(() => {
    /** Navigate to Profile page, when User changes subModule from the side bar */
    dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_TYPE', payload: subModule })
    history.push('/')

  }, [subModule])

  React.useEffect(() => {
    dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_CURRENT_STEP', payload: currentStep })
  }, [currentStep])

  React.useEffect(() => {
    // console.log('Entry mounting....')
    // history.push('/1/23', {
    //   profileName: 'Default',
    //   alertName: 'Delivery'
    // })
    return () => {
      // console.log('Destroying Entry...')
    }
  }, [])

  return <AlertProfilesMasterContainer className='grid-customised-scroll-bar'>
    <Switch>
      <Route path={`${basename}/:profileId/:alertMasterId`}><AlertSettings /></Route>
      <Route path={`${basename}/:profileId`}><AlertLists /></Route>
      <Route path={`${basename}/`}><AlertProfiles /></Route>
      <Route path='/'><AlertProfiles /></Route>
    </Switch>
  </AlertProfilesMasterContainer>
}

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }


export default withReactOptimized(withMemoryRouter(AlertProfilesMasterEntry))