import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { IUserData } from '../Form/UserForm.model';
import  { sendGA } from '../../../../../utils/ga'
import { useHistory } from 'react-router-dom'



export const generateUserFormData = (data: IUserData) => {

  const {
    clientId,
    distributionCenter,
    userGroupId,
    country,
    clientName,
    clientBranchName,
    userGroupName,
    countryName,
    canonicalId,
    gmtoffset,
    parentUserId,
    reportingManager
  } = data

  return {
    ...data,
    clientId: clientId ? {
      id: clientId,
      name: clientName
    } : undefined,
    distributionCenter: distributionCenter ? {
      id: distributionCenter,
      name: clientBranchName
    } : undefined,
    userGroupId: userGroupId ? {
      id: userGroupId,
      name: userGroupName
    } : undefined,
    userTimeZone: {
      id: canonicalId,
      name: gmtoffset
    },
    country: country ? {
      id: country,
      name: countryName
    } : undefined,
    parentUserId: parentUserId ? {
      id: parentUserId,
      name: reportingManager
    } : undefined
  }



}


export const useGoogleAnalytics = () => {
  const history = useHistory();
  const isEditMode = useTypedSelector(state => state.settings.userManagement.form.isEditMode)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const gaOnSubmit = () => {

    sendGA('Form Actions',`Button Click - ${isEditMode ? 'Update' : 'Save'}`); 
  }

  const gaOnCancel = (formInstance: UseFormMethods<Record<string, any>>) => {

    sendGA('Form Actions','Button Click - Cancel'); 


    if (!formInstance.formState.isDirty) {
      history.push({ pathname: '/' });

    } else {
      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (
            <>
              <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                history.push({ pathname: '/' });
              }}>{dynamicLabels.ok}</IconButton>
              <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
            </>
          )
        }
      })
    }


  }

  return { gaOnSubmit, gaOnCancel }
}

export const useBreadCrumbs = (formInstance: UseFormMethods<Record<string, any>>) => {
  const history = useHistory();



  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const isEditMode = useTypedSelector(state => state.settings.userManagement.form.isEditMode)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()


  const breadCrumbOptions = React.useMemo(() => [

    { id: 'userAccessConfiguration', label: dynamicLabels.userAccessConfiguration, disabled: true },

    { id: 'userManagementList', label: dynamicLabels.userManagementList, disabled: false },

    { id: 'user', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.user}`, disabled: true }
  ], [dynamicLabels])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'userManagementList':
        if (!formInstance.formState.isDirty) {
          history.push({ pathname: '/' });

        } else {
          globalPopupDispatch({
            type: '@@globalPopup/SET_PROPS',
            payload: {
              isOpen: true,
              title: dynamicLabels.navigationConfirmation,
              content: dynamicLabels.dataLostWarningMsg,
              footer: (
                <>
                  <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
                    globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                    history.push({ pathname: '/' });
                  }}>{dynamicLabels.ok}</IconButton>
                  <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                </>
              )
            }
          })
        }
        break
    }
  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}