import React, { Dispatch } from 'react'
import { UseFormMethods } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import { IconButton } from 'ui-library';
import { IAddFormData } from './AccessProfileForm.models'


export const useBreadCrumbs = (formInstance: UseFormMethods<IAddFormData>, isEditMode: boolean) => {
  const history = useHistory();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.accessProfile)


  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      { id: 'USER_ACCESS', label: dynamicLabels?.USER_ACCESS || "User and Access Management", disabled: true },
      { id: 'accessProfileList', label: dynamicLabels?.accessProfileList || "Access Profiles", disabled: false },
      { id: 'accessProfileForm', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.accessProfileList}`, disabled: true },
    ];
    return list
  }, [dynamicLabels])


  const handleBreadCrumbClick = (id: string) => {

    switch (id) {
      case 'accessProfileList':
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
      case 'accessProfileForm':
        break
    }
  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}