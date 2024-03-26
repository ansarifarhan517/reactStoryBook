import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { IOrganizationRoleData } from './OrganizationRoleForm.model';
import { sendGA } from '../../../../../utils/ga'
import { useHistory } from 'react-router-dom'
import { string } from 'prop-types';
import store from '../../../../../utils/redux/store';
import {internalPersonEnum} from '../../UserManagement.utilis';

export const generateOrganizationFormData = (data: IOrganizationRoleData) => {

  let accessProfileList = store.getState().settings.organizationRole.form.accessprofiledata


  const
    {
      orgRoleLandingPage,
      persona,
      orgRoleAccessProfile,
      isSSOMandatoryFl,
    } = data


  var accessprofdata = accessProfileList?.filter(function (o1) {
    return orgRoleAccessProfile?.some(function (o2) {
      if (o1.accessProfileRefId === o2.accessProfileReferenceId)
        return o1;
      else
        return undefined;
    });
  });

  var acessprofilenamelist = new Array();
  accessprofdata?.forEach(function (arrayItem) {
    var accessprofilename = arrayItem.accessprofileName;
    acessprofilenamelist.push(accessprofilename);
  });
  var acessprofileDesclist = new Array();
  accessprofdata?.forEach(function (arrayItem) {
    var accessprofileDesc = arrayItem.accessprofileDesc;
    acessprofileDesclist.push(accessprofileDesc);
  });

  var orgRoleLandngPage = orgRoleLandingPage
    switch (orgRoleLandingPage) {
      case 'trip':
        orgRoleLandngPage = 'Trip List View';
        break;
      case 'live':
        orgRoleLandngPage = 'Live Dashboard';
        break;
      case 'order':
        orgRoleLandngPage = 'Orders List View';
        break;
      case 'home/mile':
        orgRoleLandngPage = 'Control Tower Dashboard';
        break;
      case 'admindashboard':
        orgRoleLandngPage = 'Dashboard';
        break;
      case 'userManagement':
        orgRoleLandngPage = 'Users List View';
        break;
      default: break;
    }
  return {
    ...data,

    accessProfileIds: orgRoleAccessProfile?.map((l, index) => ({ ...l, id: acessprofilenamelist[index],name:acessprofilenamelist[index],description:acessprofileDesclist[index],_id: l.accessProfileReferenceId })),

    isSSOMandatoryFl: isSSOMandatoryFl === true ? 'Y' : 'N',

    persona: persona ? {
      id: string,
      name: internalPersonEnum[persona] || persona
    } : undefined,

    orgRoleLandingPage: orgRoleLandingPage ? {
      id: string,
      name: orgRoleLandngPage
    } : undefined,

  }
}

export const useGoogleAnalytics = () => {
  const isEditMode = useTypedSelector(state => state.settings.organizationRole.form.isEditMode)
  const history = useHistory();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const gaOnSubmit = () => {
    sendGA('Form Actions', `Button Click - ${isEditMode ? 'Update' : 'Save'}`)
    history.push({ pathname: '/' })
  }

  const gaOnCancel = (formInstance: UseFormMethods<Record<string, any>>) => {
    sendGA('Form Actions', 'Button Click - Cancel')
    if (!formInstance.formState.isDirty) {

      history.push({ pathname: '/' })
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
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const isEditMode = useTypedSelector(state => state.settings.organizationRole.form.isEditMode)

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'userAccessConfiguration', label: dynamicLabels.userAccessConfiguration, disabled: true },
    { id: 'organizationRoles', label: dynamicLabels.organizationRoles, disabled: false },
    { id: 'addOrgHeader', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.addOrgHeader}`, disabled: true },
  ], [dynamicLabels])

  const handleBreadCrumbClick = (id: string) => {

    switch (id) {
      case 'organizationRoles':
        if (!formInstance.formState.isDirty) {
          history.push({ pathname: '/' })
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
      case 'addOrganizationRole':
        break
    }
  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}