import React, { useState, Dispatch } from 'react'
import { Loader, IFilterOptions, IconButton, IListViewColumn, ListView, Toggle, BreadCrumb, Box, useToast, Accordion, AccordionContent, AccordionHeaderTitle, AccordionHeaderSubTitle } from 'ui-library'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useBreadcrumbsAlertLists } from '../utils/useBreadcrumbs'
import { fullHeightStyle } from '../utils/constants'
import { StyledCard } from '../styles'
import { IAlertListData, IAlertProfileDetails, IAlertDetailsSummary, IAlertProfileMasterRouteParams } from '../AlertProfilesMaster.models'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView'
import { IDynamicLabelsAction } from '../../../common/DynamicLabels/dynamicLabels.actions'
import { tGlobalPopupAction } from '../../../common/GlobalPopup/GlobalPopup.reducer'
import { sendGA } from '../../../../utils/ga'

const AlertsListView = ({ category }: { category: string }) => {
  const alertListData = useTypedSelector(state => state.settings.alertProfilesMaster.alertListData)
  const columnsStructure = useTypedSelector(state => state.settings.alertProfilesMaster.listStructure.columns)
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const [flag, setFlag] = useState<boolean>(false)

  React.useEffect(() => {
    if (Object.keys(columnsStructure).length) {
      const newColumns = transformMongoListViewToColumns(columnsStructure, 'alertProfilesMaster_AlertsList', {})
      newColumns[newColumns.length - 1].width = 140
      if (category !== 'ORDER' && category !== 'MMORDER') {
        newColumns.splice(newColumns.findIndex(col => col.accessor === 'alertCategory'), 1)
      }

      setColumns(newColumns)
    }
  }, [columnsStructure])

  const handleFilterDataWrapper = React.useCallback((listCategory: string) => {
    if (flag) {
      setFlag(false)
      return
    }
    function handleFilterData(combinedFilters: IFilterOptions) {
      dispatch({
        type: '@@ALERT_PROFILES_MASTER/ALERT_LISTS_FILTER_HANDLING', payload: {
          listCategory, searchBy: combinedFilters?.searchBy || '', searchText: combinedFilters?.searchText || ''
        }
      })
    }

    return handleFilterData
  }, [flag])

  return <ListView
    columns={columns}
    data={alertListData?.[category]}

    style={{ height: Math.min(alertListData?.[category].length * 25 + 140, 400) }}
    // style={{ height: 400 }}
    hideToolbar
    hideColumnSettings
    heightBuffer={10}
    rowIdentifier='alertMasterId'
    onFilterChange={handleFilterDataWrapper(category)}
    paginationPageSize={100}
  />
}
const AlertLists = () => {
  const { profileId } = useParams<IAlertProfileMasterRouteParams>()
  const location = useLocation<IAlertProfileDetails>()
  const history = useHistory()
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadcrumbsAlertLists()
  const toast = useToast()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const readOnlyMode = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)

  const alertListDataFromAPI = useTypedSelector(state => state.settings.alertProfilesMaster.alertListDataFromAPI)
  const alertListSavePayload = useTypedSelector(state => state.settings.alertProfilesMaster.alertListSavePayload)
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [expandedId, setExpandedId] = useState<string>()
  const [isGroupOrderAlert, setIsGroupOrderAlert] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()


  const dynamicLabelsDispatch = useDispatch<Dispatch<IDynamicLabelsAction>>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const alertCategories = React.useMemo(() => Object.keys(alertListDataFromAPI), [alertListDataFromAPI])

  React.useEffect(() => {

    setIsGroupOrderAlert(location.state.isGroupOrderAlert)
    fetchAlertDetails()

    return () => {
      dispatch({ type: '@@ALERT_PROFILES_MASTER/RESET_ALERT_LIST_MODIFIED_DATA' })
      dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST', payload: {} })
    }
  }, [])

  const handleAccordionToggle = React.useCallback((id: string, isExpanded?: boolean) => {
    setExpandedId(isExpanded ? id : '')
  }, [setExpandedId])

  const isSaveDisabled = React.useMemo(() => {
    return (alertListSavePayload.length === 0 && isGroupOrderAlert === location.state.isGroupOrderAlert)
      || isSaving || readOnlyMode
  }, [alertListSavePayload, isGroupOrderAlert])

  const handleSave = () => {
    const processSave = async () => {
      setIsSaving(true)
      const payload = {
        profileId: Number(profileId),
        isGroupOrderAlert,
        alertMappingList: alertListSavePayload
      }
      console.log({ payload })

      try {
        const { data: response } = await axios.put<ILogiAPIResponse<{}>>(apiMappings.settings.alertProfiles.saveAlertListData, payload)

        if (response.hasError) {
          throw response
        }

        history.push('/')
        toast.add(response.message, 'check-round', false)
      } catch (errorResponse) {
        toast.add(errorResponse?.response?.data?.message || errorResponse?.message || dynamicLabels.somethingWendWrong, '', false)
      }
    }

    let alertProfileName = ''
    let alertProfileImpact = ''

    switch (profileType) {
      case 'BRANCH':
        alertProfileName = dynamicLabels.ALERT_PROFILES_BRANCH_s
        alertProfileImpact = `${dynamicLabels.branch_p} linked to the ${alertProfileName}`
        break
      case 'SHIPPER':
        alertProfileName = dynamicLabels.ALERT_PROFILES_SHIPPER_s
        alertProfileImpact = `${dynamicLabels.shipper_p} linked to the ${alertProfileName}`
        break
      case 'ORGANIZATION':
        alertProfileName = dynamicLabels.ALERT_PROFILES_ORGANIZATION_s
        alertProfileImpact = dynamicLabels.organization
        break
    }

    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: true,
        title: dynamicLabels.navigationConfirmation,
        content: (<>
          <div>{`Any changes made to the ${alertProfileName} will impact the ${alertProfileImpact}.`}</div>
          <br />
          <div>{dynamicLabels.areYouSureContinue}</div>
        </>),
        footer: (<>
          <IconButton iconVariant='icomoon-tick-circled' primary
            onClick={() => {
              globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
              processSave()
            }}>{dynamicLabels.ok}</IconButton>
          <IconButton iconVariant='icomoon-close'
            onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
        </>)
      }
    })

    sendGA('Settings > Alert Profiles Master' , `Button Click Edit Alert Profile - Save`)
  }

  const handleCancel = () => {
    const handleClose = () => {
      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
    }

    const handleOk = () => {
      handleClose()
      history.push('/')
    }


    if (isSaveDisabled) {
      history.push('/')
    } else {
      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (<>
            <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleOk}>{dynamicLabels.ok}</IconButton>
            <IconButton iconVariant='icomoon-close' onClick={handleClose}>{dynamicLabels.cancel}</IconButton>
          </>)
        }
      })
    }

    sendGA('Settings > Alert Profiles Master' , `Button Click Edit Alert Profile - Cancel`)
  }

  const fetchAlertDetails = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<ILogiAPIResponse<IAlertListData>>(apiMappings.settings.alertProfiles.getAlertListData, {
        params: { profileId }
      })

      if (data.hasError) {
        throw data
      }

      const alertCategories = Object.keys(data.data)

      const labelString: string[] = [];

      alertCategories.forEach((category) => {
        data.data[category] = data.data[category].map((row: IAlertDetailsSummary) => {
          labelString.push(`${row?.alertName}${category === 'MMORDER' ? '_MM' : ''}_description`)
          return ({ ...row, category })
        })
      })

      if (labelString.length) {
        dynamicLabelsDispatch({ type: '@@dynamicLabels/FETCH_DATA', payload: labelString.join(',') })
      }

      dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST', payload: data.data })

      let alertCategoriesMetaLabelKeys: string[] = []

      alertCategoriesMetaLabelKeys = alertCategories.filter((category) => !dynamicLabels[`ALERTSLIST_${category}_TITLE`] || !dynamicLabels[`ALERTSLIST_${category}_DESC`])
        .reduce((previousValue, category) => ([...previousValue, `ALERTSLIST_${category}_TITLE`, `ALERTSLIST_${category}_DESC`]), alertCategoriesMetaLabelKeys)

      if (alertCategoriesMetaLabelKeys.length) {
        dynamicLabelsDispatch({ type: '@@dynamicLabels/FETCH_DATA', payload: alertCategoriesMetaLabelKeys.join(',') })
      }


    } catch (errorResponse) {
      toast.add(errorResponse?.response?.data?.message || errorResponse?.message || dynamicLabels.somethingWendWrong, '', false)
    } finally {
      setLoading(false)
    }
  }

  const renderAccordions = React.useMemo(() => {
    return alertListDataFromAPI && alertCategories.map((category, index) => {

      return alertListDataFromAPI?.[category] &&
        <Accordion
          id={category} key={category}
          expanded={(expandedId === undefined && index === 0) || expandedId === category}
          onToggle={handleAccordionToggle}>
          {{
            header: <>
              <AccordionHeaderTitle>{dynamicLabels[`ALERTSLIST_${category}_TITLE`]}</AccordionHeaderTitle>
              <AccordionHeaderSubTitle>{dynamicLabels[`ALERTSLIST_${category}_DESC`]}</AccordionHeaderSubTitle>
            </>,
            content: <AccordionContent style={{ paddingRight: 0 }}>
              <AlertsListView category={category} />
            </AccordionContent>
          }}
        </Accordion>
    })
  }, [alertListDataFromAPI, expandedId, dynamicLabels, alertCategories])

  return <Box style={fullHeightStyle} display='flex' flexDirection='column' alignItems='stretch'>

    <Box my='20px'>
      <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
    </Box>

    <Box flexGrow={1} pb='15px'>
      <StyledCard>
        {(loading || isSaving) && <Loader center fadeBackground />}
        <Box display='flex' flexDirection='column' fullHeight>
          <Box flexGrow={1} fullWidth>
            {/* GROUP ALERT TOGGLE  */}
            <Accordion id='groupAlert' expanded={false} hideChevron>
              {{
                header: <Box display='flex' alignItems='center'>
                  <Box flexGrow={1}>
                    <AccordionHeaderTitle>{dynamicLabels.ALERTSLIST_GROUPORDER_TITLE}</AccordionHeaderTitle>
                    <AccordionHeaderSubTitle>{JSON.parse(localStorage.getItem('userAccessInfo')).superType == 'MIDDLEMILE' ? dynamicLabels.ALERTSLIST_ALLMILE_GROUPORDER_DESC : dynamicLabels.ALERTSLIST_FMLM_GROUPORDER_DESC}</AccordionHeaderSubTitle>
                  </Box>
                  <Box>
                    <Toggle
                      id='groupAlertToggle'
                      disabled={readOnlyMode}
                      checked={isGroupOrderAlert}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsGroupOrderAlert(e.target.checked)}
                    />
                  </Box>
                </Box>,
                content: <></>
              }}
            </Accordion>

            {/* INDIVIDUAL ALERTS ACCORDION */}
            {renderAccordions}
          </Box>
          <Box horizontalSpacing='10px' display='flex' justifyContent='flex-start' pt='15px' fullWidth>
            <IconButton id='alert_profiles--actionbar--save' iconVariant='icomoon-save' primary
              // disabled={isSaveDisabled}
              onClick={isSaveDisabled ? handleCancel : handleSave}>
              {dynamicLabels.save}
            </IconButton>
            <IconButton id='alert_profiles--actionbar--cancel' iconVariant='icomoon-close' iconSize={11} onClick={handleCancel}>
              {dynamicLabels.cancel}
            </IconButton>
          </Box>

        </Box>
      </StyledCard>
    </Box>
  </Box >
}

export default AlertLists