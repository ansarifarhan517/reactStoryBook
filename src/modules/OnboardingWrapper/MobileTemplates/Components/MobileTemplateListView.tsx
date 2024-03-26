import React, { Dispatch, useState, useEffect } from "react";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { ColumnInstance } from 'react-table';
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import axios from '../../../../utils/axios';
import { useDispatch } from "react-redux";
import apiMappings from '../../../../utils/apiMapping';
import { useHistory } from "react-router-dom";
import { IListViewColumn, ISelectedRows, useToast, IFetchDataOptions, ListView, Box, Button, FontIcon } from "ui-library";
import { IMobileTemplateActions } from "../MobileTemplate.actions";
import { MobileTemplateListViewWrapper, ButtonContainerWithTooltip } from "../MobileTemplateStyledComponents";
import ConfirmationModal from "../../../../utils/components/Confirmation/ConfirmationModal";
import CloneMobileTemplateModal from "./SubComponents/CloneMobileTemplateModal";
import MobileRolesListViewModal from "./SubComponents/MobileRolesListViewModal";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { IMobileTemplateListViewRowData, IFormInputs } from "../MobileTemplate.models";
import { sendGA } from '../../../../utils/ga';
import { debounce } from "../../../../utils/commonFunctions/lodashFunctions";

const MobileTemplateListView = () => {
  /** General Hooks */
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
  const history = useHistory();

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();

  /* Redux Selectors */
  const columnsSelector = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.structure.columns);
  const buttonSelector = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.structure.buttons);
  const structure = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.structure);

  const isColumnLoading = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.isColumnLoading);
  const isListViewLoading = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.isListViewLoading);
  const totalRowsCount = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.data.totalCount);
  const rowSelector = useTypedSelector((state) => state.settingScreen.mobileTemplates.listview.data.results);

  /* internal state */
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [activeFl, setActiveFl] = useState<boolean>(false);
  const [toggleRow, setToggleRow] = useState<IMobileTemplateListViewRowData | undefined>(undefined);
  const [isDeleteConfirmationModalOpen, setDeleteConfirmationModelOpen] = useState<boolean>(false);
  const [isCloneConfirmationModalOpen, setCloneConfirmationModalOpen] = useState<boolean>(false);
  const [isMobileRoleModalOpen, setMobileRoleModalOpen] = useState<boolean>(false);

  /* initial API calls */
  useEffect(() => {
    dispatch({ type: '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE' });
    dispatch({ type: "@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE" })
  }, [])

  /* callbacks */

  const handleActiveInactiveToggle = (value: boolean, row: IMobileTemplateListViewRowData) => {
    setToggleRow(row);
    setActiveFl(value);
    setConfirmationModalOpen(true);
  }

  const handleActiveInactiveToggleStatus = async () => {
    if(!activeFl && toggleRow?.attachedUserGroups && toggleRow?.attachedUserGroups > 0){
      toast.add(dynamicLabels?.ACCESSPROFILE_ACTIVE_FAIL_ROLE_ATTACHED || "Failed to update Access Profile status due to roles attached", 'warning', false);
      setConfirmationModalOpen(false);
      return;
    }
    
    const payload = {
      accessProfileId: toggleRow?.accessProfileId,
      activeFl: activeFl
    }

    sendGA('Event New',`Mobile Templates List View - Active/Inactive ${toggleRow?.accessProfileId}`)

    try {
      const { data: { message, hasError } } = await axios.put(apiMappings.settingScreen.mobileTemplates.listview.status, payload);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
      }
      dispatch({
        type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST',
        payload: {
          pageNumber: fetchOptions.pageNumber,
          pageSize: fetchOptions.pageSize,
          searchBy: fetchOptions?.filterOptions?.searchBy,
          searchText: fetchOptions?.filterOptions?.searchText,
          sortBy: fetchOptions?.sortOptions?.sortBy,
          sortOrder: fetchOptions?.sortOptions?.sortOrder
        },
      })
    } catch (error) {
      console.log(error, error?.response);
    }
    setConfirmationModalOpen(false);
  }

  const handleNumberOfUsers = (row: ISelectedRows) => {
    const { accessProfileId } = row;
    sendGA('Event New',`Mobile Templates List View - Roles Popup ${accessProfileId}`)
    const payload = Number(accessProfileId);
    dispatch({ type: '@@mobileTemplates/SET_ACCESS_PROFILE_ID', payload })
    setMobileRoleModalOpen(true);
  }

  /* Listview structure customization */
  const cellCallbackMapping = {
    activeFl: handleActiveInactiveToggle,
    attachedUserGroups: handleNumberOfUsers
  };

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'mobileTemplates', cellCallbackMapping);
      setColumns(newColumns);
    }
  }, [columnsSelector]);

  const onRowEditClick = React.useCallback((row: any) => {
    const {accessProfileId} = row;
    dispatch({ type: '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID', payload: accessProfileId });
    dispatch({ type: '@@mobileTemplates/SET_EDIT_MODE', payload: true });
    dispatch({ type: '@@mobileTemplates/SET_VIEW_TYPE', payload: 'add-form-view' });
    dispatch({ type: '@@mobileTemplates/SET_ACCESS_PROFILE_ID', payload: accessProfileId });
    history.push(`/updateMobileTemplate/${accessProfileId}`);    
  }, [history]);

  const onRowSelect = React.useCallback((selectedRow: ISelectedRows) => {
    setSelectedRows(selectedRow);
  }, []);

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => { columns[columnKey].permission = !!visibleColumns[columnKey]; });
      const payload = { ...structure, columns };
      try {
        const { data: { message } } = await axios.put(apiMappings.settingScreen.mobileTemplates.listview.structure, payload);
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
        type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST',
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

  const deleteMobileTemplate = debounce (React.useCallback(async () => {
    const accessProfileId = Object.keys(selectedRows)[0];
    sendGA('Event New',`Mobile Templates List View - Delete ${accessProfileId}`)
    try {
      const { data: { message, hasError } } = await axios.put(apiMappings.settingScreen.mobileTemplates.listview.delete + `?accessProfileId=${accessProfileId}`);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        dispatch({
          type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST',
          payload: {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText,
            sortBy: fetchOptions?.sortOptions?.sortBy,
            sortOrder: fetchOptions?.sortOptions?.sortOrder
          },
        });
      }
    } catch (error) {
      console.log(error, error?.response)
    }
    setDeleteConfirmationModelOpen(false);
  }, [selectedRows]),500)

  const cloneMobileTemplate = React.useCallback(async (fields: IFormInputs) => {
    const { accessprofileName, accessprofileDesc } = fields;
    const accessProfileId = Object.keys(selectedRows)[0];

    sendGA('Event New',`Mobile Templates List View - Clone ${accessProfileId}`)

    const payload = {
      accessProfileId: accessProfileId,
      accessprofileName: accessprofileName,
      accessprofileDesc: accessprofileDesc,
      accessProfileType: "MOBILE"
    }
    try {
      const { data: { message, hasError } } = await axios.post(apiMappings.settingScreen.mobileTemplates.listview.clone, payload);
      if (hasError) {
        message && toast.add(message, 'warning', false);
      } else {
        message && toast.add(message, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        dispatch({
          type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST',
          payload: {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText,
            sortBy: fetchOptions?.sortOptions?.sortBy,
            sortOrder: fetchOptions?.sortOptions?.sortOrder
          },
        });
      }
    } catch (error) {
      console.log(error, error?.response)
    }
    setCloneConfirmationModalOpen(false);
  }, [selectedRows])

  return (
    <>
      {columns.length > 0 ? (
        <MobileTemplateListViewWrapper>
          <ListView
            rowIdentifier='accessProfileId'
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
            className="mobileTemplateListView"
            style={{ height: '90vh', width: '99%' }}
          >
            {{
              ActionBar: (
                <Box display='flex' pt='5px'>
                  {buttonSelector?.delete && (
                    <ButtonContainerWithTooltip title={buttonSelector?.delete?.label}>
                      <Button id="clientMobileTemplates-actionBar-delete" disabled={Object.keys(selectedRows).length !== 1} onClick={() => setDeleteConfirmationModelOpen(true)}>
                        <FontIcon size={12} variant="icomoon-delete-empty" /> {buttonSelector?.delete?.label}
                      </Button>
                    </ButtonContainerWithTooltip>
                  )}
                  {buttonSelector?.cloneAccessProfile && (
                    <ButtonContainerWithTooltip title={buttonSelector?.cloneAccessProfile?.label}>
                      <Button id="clientMobileTemplates-actionBar-clone" disabled={Object.keys(selectedRows).length !== 1} onClick={() => setCloneConfirmationModalOpen(true)}>
                        {buttonSelector?.cloneAccessProfile?.label}
                      </Button>
                    </ButtonContainerWithTooltip>
                  )}
                </Box>
              ),
            }}
          </ListView>
        </MobileTemplateListViewWrapper>
      ) : null}

      <ConfirmationModal isOpen={isConfirmationModalOpen} confirmationMessage={activeFl ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive} title={dynamicLabels.confirmation} onSubmit={handleActiveInactiveToggleStatus} onClose={setConfirmationModalOpen} isDeleteModal={false} />
      <ConfirmationModal isOpen={isDeleteConfirmationModalOpen} confirmationMessage={dynamicLabels.delete_Confirmation_Warning} title={dynamicLabels.deleteConfirmation} onSubmit={deleteMobileTemplate} onClose={setDeleteConfirmationModelOpen} isDeleteModal={true} />
      <CloneMobileTemplateModal isOpen={isCloneConfirmationModalOpen} onClose={setCloneConfirmationModalOpen} onSubmit={cloneMobileTemplate} />
      <MobileRolesListViewModal isOpen={isMobileRoleModalOpen} onClose={setMobileRoleModalOpen} />
    </>
  )
}
export default MobileTemplateListView;