import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal, ModalHeader, Box, IconButton, ListView, /*IFetchDataOptions, ISelectedRows, useToast,*/ IListViewColumn } from "ui-library";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { useDispatch } from "react-redux";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { MobileRolesUsersListViewWrapper } from "../../MobileRolesStyledComponents";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { IMobileRolesActions } from "../../MobileRoles.actions";

interface IMobileRolesListViewModalProps {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
}

const MobileRolesListViewModal = ({ isOpen, onClose }: IMobileRolesListViewModalProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileRoles);
    const dispatch = useDispatch<Dispatch<IMobileRolesActions>>();
    /* internal state */

    const [columns, setColumns] = useState<IListViewColumn[]>([]);

    /* Redux Selectors */
    const columnsSelector = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.mobileRolesListView?.structure?.columns);

    const isColumnLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.mobileRolesListView?.isColumnLoading);
    const isListViewLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.mobileRolesListView?.isListViewLoading);
    const totalRowsCount = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.mobileRolesListView?.data?.totalCount);
    const rowSelector = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.mobileRolesListView?.data?.results);

    const orgRoleId = useTypedSelector((state) => state.settingScreen.mobileRoles.orgRoleId);
    useEffect(() => {
        dispatch({ type: '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE' });
    }, [])


    /* Listview structure customization */
    const cellCallbackMapping = {};

    useEffect(() => {
        const mongoStructure = columnsSelector || {};
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'mobileRoles', cellCallbackMapping);
            setColumns(newColumns);
        }
    }, [columnsSelector]);

    const handleFetchData = React.useCallback(
        ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
            dispatch({
                type: '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID',
                payload: {
                    orgRoleId: orgRoleId,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder,
                },
            });
        },
        [orgRoleId]
    );

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width='800px'>
            {{
                header: <ModalHeader handleClose={() => onClose(false)} width="800px" headerTitle={dynamicLabels.mobileRoleDetails} />,
                content: <>{columns.length > 0 ? (
                    <MobileRolesUsersListViewWrapper>
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
                            hidePaginationBar={false}
                        />
                    </MobileRolesUsersListViewWrapper>
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