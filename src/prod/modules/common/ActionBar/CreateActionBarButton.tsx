import React, { ReactElement } from 'react'
import {
    IconButton,
    ISelectedRows,
    IconDropdown,
    Tooltip,
} from 'ui-library';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import { IMongoField } from '../../../utils/mongo/interfaces';
'../../../../utils/mongo/ListView/actionBarIcons.mapping';
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
import { createButtonDropdownOptions } from './actionBarButtonCreation';
// import { createButtonDropdownOptions } from './actionBarButtonCreation';

interface IActionBarButton {
    pageName: string,
    actionBarButton: IMongoField,
    buttonKey: string,
    buttonToolTipTextList: string,
    selectedRows: ISelectedRows,
    isButtonDisabled?: boolean,
    handleActionBarButtonClick: (action: string) => void,
    buttonIndex?: number,
    id?: any
}

export default function CreateActionBarButton({
    pageName,
    actionBarButton,
    buttonKey,
    buttonToolTipTextList,
    selectedRows,
    handleActionBarButtonClick,
    isButtonDisabled,
    buttonIndex
}: IActionBarButton): ReactElement {

    const MoreButtonOptionList = React.useMemo(() => {
        if (actionBarButton?.childNodes && Object.values(actionBarButton?.childNodes)?.length) {
            const temp = createButtonDropdownOptions(actionBarButton)
            console.log('CreateActionBarButton.tsx ==>temp', temp)
            return temp;
        } else {
            return;
        }


    }


        , [])

    return (
        actionBarButton?.permission ?
            (actionBarButton?.childNodes && Object.values(actionBarButton?.childNodes)?.length ?
                (
                    <IconDropdown
                        id={`${pageName}--actionBar--${buttonKey}`}
                        key={buttonKey}
                        intent='table'
                        variant={'multilevel-button-dropdown'}
                        optionList={MoreButtonOptionList}
                        tooltipMessage={`${actionBarButton?.tooltipLabel
                            ? actionBarButton?.tooltipLabel
                            : buttonToolTipTextList
                                ? buttonToolTipTextList
                                : buttonKey
                            }`}
                        iconButtonDetails={[
                            'icomoon-funnel-options',
                            actionBarButton?.label,
                            'icomoon-angle-bottom',
                        ]}
                        // if no selection or in selected rows  intransit status there then only disable
                        disabled={
                            (Object.keys(selectedRows).length === 0 || isButtonDisabled)
                        }
                        handleClick={handleActionBarButtonClick}
                        // handleClick={(event: any) => handleActionBarButtonClick(event.target)}
                        isSingleClickOption
                    />
                ) : (
                    <Tooltip
                        messagePlacement={(((buttonIndex === 0)) || buttonKey === 'update' || buttonKey === 'cloneRole') ? 'start' : 'center'}
                        hover
                        message={`${actionBarButton?.tooltipLabel
                            ? actionBarButton?.tooltipLabel
                            : buttonToolTipTextList
                                ? buttonToolTipTextList
                                : buttonKey
                            }`}
                        key={buttonKey}
                    >
                        <IconButton
                            key={buttonKey}
                            // if no selection or in selected rows intransit there then only disable
                            disabled={(Object.keys(selectedRows).length === 0) || (isButtonDisabled)
                            }
                            intent='table'
                            iconVariant={iconsMapping[buttonKey]}
                            id={`listView-actionBar-${buttonKey}`}
                            onClick={() => handleActionBarButtonClick(buttonKey)}
                        >
                            <TextOverflowEllipsis>{actionBarButton?.label}</TextOverflowEllipsis>
                        </IconButton>
                    </Tooltip>
                )) : <></>
    )
}
