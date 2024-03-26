import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { IUserData } from './ItemConfiguration.model';
import  { sendGA } from '../../../../../utils/ga'
import { useHistory } from 'react-router-dom'



export const generateItemFormData = (data: IUserData) => {

  const {
    prepTime,
    temperatureCategoryCd
  } = data

  delete data?.temperatureCategoryCd 
  
  return {
    ...data,
    preparationTime:prepTime,
    temperatureCategory:  {
        label: temperatureCategoryCd,
        value: temperatureCategoryCd,
        name: temperatureCategoryCd,
        id: temperatureCategoryCd
      }
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
  const isEditMode = useTypedSelector(state => state.itemConfiguration.form.isEditMode)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()


  const breadCrumbOptions = React.useMemo(() => [

    { id: 'itemConfiguration', label: `${dynamicLabels.item_s} Configuration`, disabled: true },
    { id: 'item', label: `${isEditMode ? "Update" : dynamicLabels.add} ${dynamicLabels?.item_s}`, disabled: true }
  ], [dynamicLabels, isEditMode])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'itemConfiguration':
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