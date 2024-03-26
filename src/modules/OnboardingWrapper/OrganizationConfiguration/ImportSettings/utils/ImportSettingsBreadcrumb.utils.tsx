import React, { Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from "ui-library";
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { useHistory } from 'react-router-dom';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';

export const useBreadCrumbs = (currentRoute : any) => {
    const history = useHistory();

    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'importSettings', label: dynamicLabels.importSettings, disabled: false },

        currentRoute,
    ], [dynamicLabels, currentRoute]);

    const handleBreadCrumbClick = (id: string, isChangedValues : boolean) => {
        switch (id) {
            case "importSettings": {
                const handleClose = () => {
                    globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });
                }
        
                const handleOk = () => {
                    handleClose();
                    history.push({ pathname: "/" });
                }
                
                if (!isChangedValues) {
                    history.push({ pathname: "/" });
                } else {
                    globalPopupDispatch({
                        type: '@@globalPopup/SET_PROPS',
                        payload: {
                        isOpen: true,
                        title: dynamicLabels.navigationConfirmation,
                        content: dynamicLabels.dataLostWarningMsg,
                        footer: (
                            <>
                                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleOk}>
                                    {dynamicLabels.ok}
                                </IconButton>
                                <IconButton iconVariant='icomoon-close' onClick={handleClose}>
                                    {dynamicLabels.cancel}
                                </IconButton>
                            </>
                        )}
                    });
                }
                break;
            }
            default:
                break;
        }
    }

    return { breadCrumbOptions, handleBreadCrumbClick };
}