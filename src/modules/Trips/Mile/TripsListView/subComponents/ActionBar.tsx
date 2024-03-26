import React, { useEffect, useState } from 'react'
import { Box, ISelectedRows, Tooltip, IconButton } from 'ui-library'
import { IMongoField } from '../../../../../utils/mongo/interfaces'
import { IActionCallback } from '../TripsListView.model'
import CreateActionBarButton from '../../../../common/ActionBar/CreateActionBarButton'


interface IActionBarButtons {
    [key: string]: IMongoField;
}
interface Props {
    actionBarButtons: IActionBarButtons,
    selectedRows: ISelectedRows,
    dynamicLabels: Record<string, string>,
    isEditMode: boolean
    handleActionBarButtonClick: (id: IActionCallback) => void
}

export const ActionBar = ({ actionBarButtons, dynamicLabels, selectedRows, handleActionBarButtonClick, isEditMode }: Props) => {
    const [reviseETAEnabled, setReviseETAEnabled] = useState(true);
    const isValueNotStarted = (element: any) => element?.tripStatus !== "STARTED";
    useEffect(() => {
        (Object.values(selectedRows)?.some(isValueNotStarted) ? setReviseETAEnabled(true) : setReviseETAEnabled(false));

    }, [selectedRows])
    

    return (
        <div>

            <Box display='flex' horizontalSpacing='10px'>
                {isEditMode ?
                    (<>
                        <Tooltip message={`${dynamicLabels.save} ${dynamicLabels.trip}`} hover>
                            <IconButton
                                intent='table'
                                id='listView-actionBar-save'
                                iconVariant='icomoon-save'
                                onClick={() => handleActionBarButtonClick('save')}
                                disabled={!Object.keys(selectedRows).length}
                            >
                                {dynamicLabels.save}
                            </IconButton>

                        </Tooltip>
                        <Tooltip message={`${dynamicLabels.cancel} ${dynamicLabels.trip}`} hover>
                            <IconButton
                                intent='table'
                                id='listView-actionBar-cancel'
                                iconVariant='icomoon-close'
                                onClick={() => handleActionBarButtonClick('cancel')}
                                disabled={!Object.keys(selectedRows).length}
                            >
                                {dynamicLabels.cancel}
                            </IconButton>

                        </Tooltip>
                        <CreateActionBarButton
                            key={'startTrip'}
                            actionBarButton={actionBarButtons['startTrip']}
                            buttonKey={'startTrip'}
                            buttonToolTipTextList={dynamicLabels['startTrip'] ? dynamicLabels['startTrip'] : actionBarButtons['startTrip'].label}
                            selectedRows={selectedRows}
                            handleActionBarButtonClick={handleActionBarButtonClick}
                            buttonIndex={2}
                            isButtonDisabled={!Object.values(selectedRows).find((row: any) => row.tripStatus == 'NOTSTARTED')}
                        />
                    </>

                    ) :
                    (Object.keys(actionBarButtons).map((buttonKey, buttonIndex) => {

                        if (buttonKey != 'advancedSearch' && buttonKey != 'more') {
                            switch (buttonKey) {
                                case 'delete': {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels['clickHereToDeleteSelected'] ? (dynamicLabels['clickHereToDeleteSelected'] + ' ' + dynamicLabels['trips']) : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                    />
                                }

                                case 'update':
                                case 'startTrip': {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels[buttonKey] ? (buttonKey === 'update' ? dynamicLabels['clickHereToUpdateSelected'] + ' ' + dynamicLabels['trips'] : dynamicLabels[buttonKey]) : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                        isButtonDisabled={!Object.values(selectedRows).find((row: any) => row.tripStatus == 'NOTSTARTED')}
                                    />
                                }
                                case 'stopTrip': {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels[buttonKey] ? dynamicLabels[buttonKey] : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                        isButtonDisabled={!Object.values(selectedRows).find((row: any) => row.tripStatus == 'STARTED')}
                                    />
                                }
                                case 'showdrs': {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels[buttonKey] ? dynamicLabels[buttonKey] : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                        isButtonDisabled={Object.keys(selectedRows).length > 1}
                                    />
                                }
                                case 'reviseETA': {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels[buttonKey] ? dynamicLabels[buttonKey] : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                        isButtonDisabled={reviseETAEnabled}
                                    />
                                }

                                default: {
                                    return <CreateActionBarButton
                                        key={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonKey={buttonKey}
                                        buttonToolTipTextList={dynamicLabels[buttonKey] ? dynamicLabels[buttonKey] : actionBarButtons[buttonKey].label}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        buttonIndex={buttonIndex}
                                    />
                                }
                            }
                        } else {
                            return undefined;
                        }

                    }))}
            </Box>
        </div>
    )
}
