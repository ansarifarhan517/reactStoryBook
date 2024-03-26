import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal, ModalHeader, Box, IconButton, ListView, /*IFetchDataOptions, ISelectedRows, useToast,*/ IListViewColumn } from "ui-library";
// import { ColumnInstance } from 'react-table';
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { useDispatch } from "react-redux";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { MobileTemplateRolesListViewWrapper } from "../../MobileTemplateStyledComponents";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { IMobileTemplateActions } from "../../MobileTemplate.actions";
// import axios from '../../../../../utils/axios';
// import apiMappings from '../../../../../utils/apiMapping';

interface IMobileRolesListViewModalProps {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
}

const MobileRolesListViewModal = ({ isOpen, onClose }: IMobileRolesListViewModalProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();
    /* internal state */

    const [columns, setColumns] = useState<IListViewColumn[]>([]);

    /* Redux Selectors */
    const columnsSelector = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.mobileRolesListView.structure.columns);

    const isColumnLoading = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.mobileRolesListView.isColumnLoading);
    const isListViewLoading = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.mobileRolesListView.isListViewLoading);
    const totalRowsCount = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.mobileRolesListView.data.totalCount);
    const rowSelector = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.mobileRolesListView.data.results);

    const accessProfileId = useTypedSelector((state) => state.settingScreen.mobileTemplates.accessProfileId);

    useEffect(() => {
        dispatch({ type: '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE' });
    }, [])


    /* Listview structure customization */
    const cellCallbackMapping = {};

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'mobileTemplateRoles', cellCallbackMapping);
            setColumns(newColumns);
        }
    }, [columnsSelector]);

    const handleFetchData = React.useCallback(
        ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
            dispatch({
                type: '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID',
                payload: {
                    accessProfileId: accessProfileId,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder,
                },
            });
        },
        [accessProfileId]
    );

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width='800px'>
            {{
                header: <ModalHeader width="800px" handleClose={() => onClose(false)} headerTitle={dynamicLabels.mobileRoleDetails} />,
                content: <>{columns.length > 0 ? (
                    <MobileTemplateRolesListViewWrapper>
                        <ListView
                            rowIdentifier='accessProfileId'
                            hasRowSelectionWithEdit={false}
                            columns={columns}
                            data={rowSelector}
                            totalRows={totalRowsCount}
                            onFetchData={handleFetchData}
                            loading={isListViewLoading}
                            isColumnLoading={isColumnLoading}
                            hasSelectAllRows={false}
                            className="mobileRolesListView"
                            style={{ height: '50vh', width: '99%' }}
                            hideRefresh={true}
                            hideColumnSettings={true}
                            hidePaginationBar={true}
                        />
                    </MobileTemplateRolesListViewWrapper>
                ) : null} </>,
                footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-close'
                        onClick={() => onClose(false)}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            }}
        </Modal>
    )
}

export default MobileRolesListViewModal;