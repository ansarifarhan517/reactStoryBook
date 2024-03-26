import React, { Dispatch } from 'react'
import { Box, Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, AccordionContent } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import OrganizationAlertProfiles from './OrganizationAlertProfiles'
import { PageHeader, StyledCard } from '../styles'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { fullHeightStyle, isShipper } from '../utils/constants'


const AlertProfiles = () => {
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  // const columnsStructure = useTypedSelector(state => state.settings.alertProfilesMaster.listStructure.columns)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()

  React.useEffect(() => {
    dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_READONLY_MODE', payload: isShipper || false })

    // if (!Object.keys(columnsStructure).length) {
      dispatch({ type: '@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE' })
    // }
  }, [])

  React.useEffect(() => {
    if (profileType !== 'ORGANIZATION') {
      if (profileType === 'BRANCH') {
        dispatch({ type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_BRANCH_LOOKUP' })
      } else {
        dispatch({ type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_SHIPPER_LOOKUP' })
        dispatch({type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_ALERTCAT_LOOKUP'})
      }
    }
  }, [profileType])

  const profileComponent = React.useMemo(() => {
    switch (profileType) {
      case 'ORGANIZATION':
        return <OrganizationAlertProfiles />

      case 'BRANCH':
        return <OrganizationAlertProfiles />

      case 'SHIPPER':
        return <OrganizationAlertProfiles />

      default:
        return <div />
    }
  }, [profileType])

  return <Box display='flex' flexDirection='column' alignItems='stretch' style={fullHeightStyle}>
    <PageHeader>{currentStep.stepNameLabel}</PageHeader>
    <Box flexGrow={1}>
      <StyledCard>
        {currentStep?.questions?.map(({ questionIdentifier, questionLabel, questionDescLabel }) => (<Accordion key={questionIdentifier} expanded id={questionIdentifier} >
          {{
            header: <><AccordionHeaderTitle>{questionLabel}</AccordionHeaderTitle>
              <AccordionHeaderSubTitle>{questionDescLabel}</AccordionHeaderSubTitle>
            </>,
            content: <AccordionContent style={{ backgroundColor: '#fafafa' }}>
              {/* <OrganizationAlertProfiles /> */}
              <Box pt='3px' pb='8px'>{profileComponent}</Box>
            </AccordionContent>
          }}
        </Accordion>))}
      </StyledCard>
    </Box>
  </Box>
}

export default AlertProfiles