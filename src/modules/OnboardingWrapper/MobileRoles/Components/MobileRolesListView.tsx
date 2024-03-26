import React, { Dispatch, useState, useEffect } from "react";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { ColumnInstance } from 'react-table';
import { useHistory } from "react-router-dom";
import { IListViewColumn, ISelectedRows, useToast, IFetchDataOptions, ListView } from "ui-library";
import axios from '../../../../utils/axios';
import { useDispatch } from "react-redux";
import apiMappings from '../../../../utils/apiMapping';
import { Box, Button, FontIcon } from "ui-library";
import { MobileRolesListViewWrapper, ButtonContainerWithTooltip } from "../MobileRolesStyledComponents"
import { IMobileRolesActions } from "../MobileRoles.actions";
import { IFormInputs, IMobileRoleListViewListViewRowProps } from "../MobileRoles.models";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import ConfirmationModal from "../../../../utils/components/Confirmation/ConfirmationModal";
import CloneMobileRoleModal from "./SubComponents/CloneMobileRoleModal";
import { sendGA } from '../../../../utils/ga';
import MobileRolesListViewModal from "./SubComponents/MobileRolesListViewModal";
import { debounce } from "../../../../utils/commonFunctions/lodashFunctions";

const MobileRolesListView = () => {
  /** General Hooks */
  const toast = useToast();
  const history = useHistory();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileRoles);

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IMobileRolesActions>>();

  /* internal state */
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [activeFl, setActiveFl] = useState<boolean>(false);
  const [toggleRow, setToggleRow] = useState<IMobileRoleListViewListViewRowProps | undefined>(undefined);

  const [isDeleteConfirmationModalOpen, setDeleteConfirmationModelOpen] = useState<boolean>(false);

  const [isCloneConfirmationModalOpen, setCloneConfirmationModalOpen] = useState<boolean>(false);

  /* Redux Selectors */
  const columnsSelector = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.structure.columns);
  const buttonSelector = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.structure.buttons);
  const structure = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.structure);

  const isColumnLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.isColumnLoading);
  const isListViewLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.isListViewLoading);
  const totalRowsCount = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.data.totalCount);
  const rowSelector = useTypedSelector((state) => state.settingScreen.mobileRoles.listview.data.results);
  
  const [isMobileRoleModalOpen, setMobileRoleModalOpen] = useState<boolean>(false);


  /* initial API calls */
  useEffect(() => {
    dispatch({ type: '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE' });
  }, [])

  /* callbacks */
  const handleActiveInactiveToggle = async (value: boolean, row: IMobileRoleListViewListViewRowProps) => {
    setToggleRow(row);
    setActiveFl(value);
    setConfirmationModalOpen(true);
  }

  const handleActiveInactiveToggleStatus = async () => {
    
    const payload = {
      orgRoleId: toggleRow?.orgRoleId,
      activeFl: activeFl
    }
    
    sendGA('Event New',`Mobile Roles List View- Active/Inactive Role ${toggleRow?.orgRoleId}`)

    try {
      const { data: { message, hasError } } = await axios.put(apiMappings.settingScreen.mobileRoles.listview.status+"?roleType=MOBILE", payload);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
      }
      dispatch({
        type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST',
        payload: {
          pageNumber: fetchOptions.pageNumber,
          pageSize: fetchOptions.pageSize,
          searchBy: fetchOptions?.filterOptions?.searchBy,
          searchText: fetchOptions?.filterOptions?.searchText,
          sortBy: fetchOptions?.sortOptions?.sortBy,
          sortOrder: fetchOptions?.sortOptions?.sortOrder,
        },
      });
    } catch (error) {
      console.log(error, error?.response);
    }
    setConfirmationModalOpen(false);
  }

  
  const onRowSelect = React.useCallback((selectedRow: ISelectedRows) => {
    setSelectedRows(selectedRow);
  }, []);

  const deleteMobileRole = debounce(React.useCallback(async () => {
    const orgRoleId = Object.keys(selectedRows)[0];

    sendGA('Event New',`Mobile Roles List View - Delete Role ${toggleRow?.orgRoleId}`)

    try {
      const { data: { message, hasError } } = await axios.put(apiMappings.settingScreen.mobileRoles.listview.delete + `?orgRoleId=${orgRoleId}&roleType=MOBILE`);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        dispatch({
          type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST',
          payload: {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText,
            sortBy: fetchOptions?.sortOptions?.sortBy,
            sortOrder: fetchOptions?.sortOptions?.sortOrder,
          },
        });
      }
    } catch (error) {
      console.log(error, error?.response)
    }
    setDeleteConfirmationModelOpen(false);
  }, [selectedRows]),500)

  const cloneMobileRole = React.useCallback(async (fields: IFormInputs) => {
    const { orgRoleId } = selectedRows[Number(Object.keys(selectedRows)[0])]
    const { orgRoleName, orgRoleDescription } = fields;
    const payload = {
      orgRoleId: orgRoleId,
      orgRoleName: orgRoleName,
      orgRoleDescription: orgRoleDescription
    }

    sendGA('Event New',`Mobile Roles List View - Clone Role ${toggleRow?.orgRoleId}`)

    try {
      const { data: { message, hasError } } = await axios.post(apiMappings.settingScreen.mobileRoles.listview.clone, payload);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        dispatch({
          type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST',
          payload: {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText,
            sortBy: fetchOptions?.sortOptions?.sortBy,
            sortOrder: fetchOptions?.sortOptions?.sortOrder,
          },
        });
      }
    } catch (error) {
      console.log(error, error?.response)
    }
    setCloneConfirmationModalOpen(false);
  }, [selectedRows]);

  /* Listview structure customization */
  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'mobileRoles', cellCallbackMapping);
      setColumns(newColumns);
    }
  }, [columnsSelector]);


  const handleNumberOfUsers = (row: ISelectedRows) => {
    const { orgRoleId } = row;
    const payload = Number(orgRoleId);
    dispatch({ type:'@@mobileRoles/SET_ORG_ROLE_ID', payload })
    setMobileRoleModalOpen(true);
  }

  const cellCallbackMapping = {
    activeFl: handleActiveInactiveToggle,    
    attachedUserCount: handleNumberOfUsers
  };

  const onRowEditClick = React.useCallback((row: IMobileRoleListViewListViewRowProps) => {
    const { orgRoleId } = row;
    dispatch({ type: '@@mobileRoles/GET_MOBILE_ROLE_BY_ID', payload: orgRoleId });
    dispatch({ type: '@@mobileRoles/SET_EDIT_MODE', payload: true });
    dispatch({ type: '@@mobileRoles/SET_VIEW_TYPE', payload: 'add-form-view' });
    history.push({pathname: `/updateMobileRole/${orgRoleId}`});
  }, [history]);


  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => { columns[columnKey].permission = !!visibleColumns[columnKey]; });
      const payload = { ...structure, columns };
      try {
        const { data: { message } } = await axios.put(apiMappings.settingScreen.mobileRoles.listview.structure, payload);
        message && toast.add(message, 'check-round', false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );

  const handleFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });
      dispatch({
        type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST',
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
        },
      });
    },
    []
  );

  return (
    <>
      {columns.length > 0 ? (
        <MobileRolesListViewWrapper>
          <ListView
            rowIdentifier='orgRoleId'
            hasRowSelectionWithEdit={true}
            columns={columns}
            data={rowSelector}
            totalRows={totalRowsCount}
            onFetchData={handleFetchData}
            onRowSelect={onRowSelect}
            loading={isListViewLoading}
            isColumnLoading={isColumnLoading}
            onSaveColumnPreferences={onSaveColumnPreferences}
            onRowEditClick={onRowEditClick}
            hasSelectAllRows={false}
            className="mobileRolesListView"
            style={{ height: '90vh', width: '99%' }}
          >
            {{
              ActionBar: (
                <Box display='flex' pt='5px'>
                  {buttonSelector?.delete && (
                    <ButtonContainerWithTooltip title={buttonSelector?.delete?.label}>
                      <Button id='mobileRolesList-delete' disabled={Object.keys(selectedRows).length !== 1} onClick={() => setDeleteConfirmationModelOpen(true)}>
                        <FontIcon size={12} variant="icomoon-delete-empty" /> {buttonSelector?.delete?.label}
                      </Button>
                    </ButtonContainerWithTooltip>
                  )}
                  {buttonSelector?.cloneRole && (
                    <ButtonContainerWithTooltip title={buttonSelector?.cloneRole?.label}>
                      <Button id='mobileRolesList-clone' disabled={Object.keys(selectedRows).length !== 1} onClick={() => setCloneConfirmationModalOpen(true)}>
                        {buttonSelector?.cloneRole?.label}
                      </Button>
                    </ButtonContainerWithTooltip>
                  )}
                </Box>
              ),
            }}
          </ListView>
        </MobileRolesListViewWrapper>
      ) : null}
      <ConfirmationModal isOpen={isConfirmationModalOpen} confirmationMessage={activeFl ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive} title={dynamicLabels.confirmation} onSubmit={handleActiveInactiveToggleStatus} onClose={setConfirmationModalOpen} isDeleteModal={false} />
      <ConfirmationModal isOpen={isDeleteConfirmationModalOpen} confirmationMessage={dynamicLabels.delete_Confirmation_Warning} title={dynamicLabels.deleteConfirmation} onSubmit={deleteMobileRole} onClose={setDeleteConfirmationModelOpen} isDeleteModal={true} />
      <CloneMobileRoleModal isOpen={isCloneConfirmationModalOpen} onClose={setCloneConfirmationModalOpen} onSubmit={cloneMobileRole} />
      <MobileRolesListViewModal isOpen={isMobileRoleModalOpen} onClose={setMobileRoleModalOpen} />
    </>
  )
}
export default MobileRolesListView;