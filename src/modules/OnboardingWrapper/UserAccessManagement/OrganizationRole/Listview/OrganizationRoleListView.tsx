import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast, IconButton, ModalHeader, ISelectedRows, TextInput, Modal, IListViewColumn, IFetchDataOptions, BreadCrumb, Box, ListView, Grid } from 'ui-library'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../../../src/modules/common/DynamicLabels/useDynamicLabels';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { ReactTooltipCustom as ReactTooltip } from '../../../../../utils/layouts/ReactTooltipCustom';
import { OrganizationRoleActions } from './OrganizationRole.actions'
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView'
import { ColumnInstance } from 'react-table';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import ga from '../../../../../utils/ga';
import { any } from 'prop-types';
import { IRowData } from './OrganizationRole.models';
import CreateActionBarButton from '../../../../common/ActionBar/CreateActionBarButton';
import { StyledGrid } from './OrganizationRole.Styled'
import OrganizationModal from './OrganizationModal';
import { useHistory } from 'react-router-dom'
import DeleteConfirmationModal from '../../../../../utils/components/DeleteConfirmationModal';
import { WhiteCard } from '../../UserManagement/ListView/styles';



const OrganizationRoleListView = () => {
  const username = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userName;
  const userId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userId;

  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.organizationRole)

  /** Redux Hooks */
  const toast = useToast();
  const pageLabels = useTypedSelector(state => state.pageLabels.user)
  const OranizationRoleListData = useTypedSelector(state => state.settings.organizationRole.listView.data.results);
  const columnStructure = useTypedSelector(state => state.settings.organizationRole.listView.structure.columns);
  const dispatch = useDispatch<Dispatch<OrganizationRoleActions>>()
  const structure = useTypedSelector(state => state.settings.organizationRole.listView.structure);
  const totalRowsSelector = useTypedSelector(state => state.settings.organizationRole.listView.data.totalCount);
  const actionBarButtons = useTypedSelector(state => state.settings.organizationRole.listView.structure.buttons);
  const rowsLoading = useTypedSelector(state => state.settings.organizationRole.listView.listLoading.rows);
  const columnsLoading = useTypedSelector(state => state.settings.organizationRole.listView.listLoading.columns);
  const viewMode = useTypedSelector(state => state.settings.organizationRole.listView.viewMode);
  const emptyData = useTypedSelector(state => state.settings.organizationRole.listView.emptyData);
  const history = useHistory();

  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [isEditMode] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [organizationRoleActivationRequest, setOrganizationRoleActivationRequest] = useState<{ activeRequest: boolean, orgRoleIds: Record<number, boolean>, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
  const [showCloneConfirmation, setShowCloneConfirmation] = useState<boolean>(false);
  const [markFavourite, setMarkFavourite] = useState<{ favRequest: boolean, userGrpId: Record<number, boolean>, selectedPersona?: string, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [orgRoleName, setOrgRoleName] = useState<string>('');
  const [orgRoleDescription, setOrgRoleDescription] = useState<string>('');

  /** Variables */
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'userAccessConfiguration', label: dynamicLabels.userAccessConfiguration, disabled: true },
    { id: 'organizationRoles', label: dynamicLabels.organizationRoles, disabled: true },
  ], [pageLabels, dynamicLabels])

  const onSortChange = React.useCallback(() => { }, [])

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columnsPreferences = { ...columnStructure }
    Object.keys(columnsPreferences).forEach((columnKey) => {
      columnsPreferences[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columnsPreferences
    }
    dispatch({
      type: '@@organizationRole/SET_DATA',
      payload: {
        key: 'listLoading',
        value: {
          rows: false,
          columns: true
        }
      }
    })

    ga.event({
      category: 'Event New',
      action: 'organizationRole  - Save & Apply column preferences',
      label: `${userId}${username}`
    });

    try {
      const { data: { message } } = await axios.put(apiMappings.organizationRole.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
      dispatch({
        type: '@@organizationRole/SET_DATA',
        payload: {
          key: 'listLoading',
          value: {
            rows: false,
            columns: false
          }
        }
      })
    } catch (error) {
      dispatch({
        type: '@@organizationRole/SET_DATA',
        payload: {
          key: 'listLoading',
          value: {
            rows: false,
            columns: false
          }
        }
      })
    }


  }, [columnStructure])

  const onApplyColumnPreferences = React.useCallback(() => {
    ga.event({
      category: 'Event New',
      action: 'organizationRole -  Apply column preferences',
      label: `${userId}${username}`
    });
  }, [])

  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@organizationRole/SET_DATA',
      payload: {
        key: 'listLoading',
        value: {
          rows: true,
          columns: false
        }
      }
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })

    dispatch({
      type: '@@organizationRole/FETCH_DATA',
      payload: {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder
        },
      }
    })
  }, [])


  // on getStructure
  useEffect(() => {
    fetchPersona();
    fetchLanding();
    dispatch({ type: '@@organizationRole/FETCH_STRUCTURE' });
    dispatch({
      type: '@@organizationRole/SET_DATA', payload: {
        key: 'orgRoleId',
        value: any
      }
    })
    handleFetchData(fetchOptions);
  }, [])

  useEffect(() => {
    const mongoStructure = columnStructure;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'organizationRole', cellCallbackMapping, 'orgRoleId');
      setColumns(newColumns)
    }
  }, [columnStructure])

  const fetchPersona = async () => {
    try {
      const data = await axios.get(
        apiMappings.organizationRole.listView.persona, {
        data: {},
        params: {},
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (data.status === 200) {
        dispatch({ type: '@@organizationRole/SET_PERSONA', payload: data.data });
        return;
      }
    } catch (errorMessage) {
      const message = errorMessage?.response?.data?.message;
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false);
    }
  }

  const fetchLanding = async () => {
    const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
    try {
      const data = await axios.get(
        apiMappings.organizationRole.listView.orgRoleLandingPage + userAccessInfo['modelType'], {
        data: {},
        params: {},
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (data.status === 200) {
        dispatch({ type: '@@organizationRole/SET_LANDINGPAGE', payload: data.data });
        return;
      }
    }
    catch (errorMessage) {
      const message = errorMessage?.response?.data?.message;
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false);
    }
  }

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'delete':
        if (Object.values(selectedRows)[0].locked || Object.values(selectedRows)[0].defaultAccess) {
          toast.add(`${dynamicLabels.cannotDeleteDefaultRole}`, 'warning', false)
          break
        }
        if (Object.values(selectedRows)[0].activeFl) {
          toast.add(`${dynamicLabels.cannotDeleteActiveRole}`, 'warning', false)
          break
        }
        setShowDeletionConfirmation(true);
        break;

      case 'cloneRole':
        if (!Object.values(selectedRows)[0].activeFl) {
          toast.add(`${dynamicLabels.cannotCloneInactiveRole}`, 'warning', false)
          break
        }
        setShowCloneConfirmation(true);
        break;
    }
  }, [selectedRows]);


  const handleOrganizationRoleActivation = async () => {
    if (!organizationRoleActivationRequest) {
      return
    }
    setOrganizationRoleActivationRequest(undefined)

    if (Object.keys(organizationRoleActivationRequest.orgRoleIds).length === 1) {
      const orgRoleId = Number(Object.keys(organizationRoleActivationRequest.orgRoleIds)[0])
      try {
        const { data: { message, status } } = await axios.put(apiMappings.organizationRole.listView.toggleRoleStatus, {

          orgRoleId: orgRoleId,
          activeFl: organizationRoleActivationRequest.activeRequest

        });
        if (status === 200) {
          toast.add(message, 'check-round', false)
          handleFetchData(fetchOptions)
          setSelectedRows({})
          fetchOptions.apis?.resetSelection()
          return
        }
        throw message
      } catch (errorMessage) {
        organizationRoleActivationRequest.failureCallback && organizationRoleActivationRequest.failureCallback(!organizationRoleActivationRequest.activeRequest)
        toast.add(typeof (errorMessage) === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
    }
  }

  const handleMarkFavourite = async () => {
    if (!markFavourite) {
      return
    }
    setMarkFavourite(undefined);
    if (Object.keys(markFavourite.userGrpId).length === 1) {
      const userGrpId = Number(Object.keys(markFavourite.userGrpId)[0])
      try {
        const { data: { message, status } } = await axios.post(apiMappings.organizationRole.listView.toggleFavouriteStatus + userGrpId, {
        });
        if (status === 200) {
          toast.add(message, 'check-round', false)
          handleFetchData(fetchOptions)
          setSelectedRows({})
          fetchOptions.apis?.resetSelection()
          return
        }
        throw message
      } catch (errorMessage) {
        markFavourite.failureCallback && markFavourite.failureCallback(!markFavourite.favRequest)
        toast.add(typeof (errorMessage) === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
    }

  }

  const handleActiveFlChange = (isChecked: boolean, {activeFl, orgRoleId, defaultAccess, persona }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (defaultAccess && activeFl) {
      toast.add(`${dynamicLabels.markOtherRoleErrorMessage} ${persona}`, 'warning', false)
      return
    }
    const orgRoleIds = {
      [orgRoleId]: true
    }
    setOrganizationRoleActivationRequest({ activeRequest: isChecked, orgRoleIds, failureCallback })
  }

  const handleFavChange = (isChecked: boolean, { orgRoleId, activeFl, persona, defaultAccess }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!activeFl) {
      toast.add(`${dynamicLabels.cannotMarkInactiveRoleAsDefault} ${persona}`, 'warning', false)
      return
    }
    if (defaultAccess) {
      toast.add(`${dynamicLabels.markOtherRoleErrorMessage} ${persona}`, 'warning', false)
      return
    }
    const userGrpId = {
      [orgRoleId]: true
    }
    const selectedPersona = persona;
    setMarkFavourite({ favRequest: isChecked, userGrpId, selectedPersona, failureCallback })
  }

  const cellCallbackMapping = {
    activeFl: handleActiveFlChange,
    defaultAccess: handleFavChange,
    attachedAccessProfileCount: (_value: number, row: IRowData) => {
      dispatch({ type: '@@organizationRole/SET_NO_OF_ACCESSPROFILE_MODAL', payload: { activeRequest: true, customOrgRoleId: row.orgRoleId } }) 
    },
    attachedUserCount: (_value: number, row: IRowData) => {
      dispatch({ type: '@@organizationRole/SET_NO_OF_USERS_MODAL', payload: { activeRequest: true, customOrgRoleId: row.orgRoleId } })
    }

  }

  /** Delete Request */
  const deleteSelectedRow = async () => {
    setShowDeletionConfirmation(false);
    try {
      const { data: data } = await axios.put(apiMappings.organizationRole.listView.deleteRole + Object.values(selectedRows)[0].orgRoleId);
      console.log(data);
      if (data.status === 200) {
        toast.add(data.message, 'check-round', false);
        setSelectedRows({});
        handleFetchData(fetchOptions);
        fetchOptions.apis?.resetSelection();
        return
      }
      if(data.status ===400){
        toast.add(data.message, 'check-round', false);
        return
      }
    } catch (errorMessage) {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }
  };

  /*Clone*/
  const handleClone = async () => {
    if (isDisable) {
      toast.add(`${dynamicLabels.orgRoleNameCannotbeEmpty}`, 'warning', false)
      return
    }
    setOrgRoleName('');
    setOrgRoleDescription('');
    setShowCloneConfirmation(false);
    setIsDisable(false);
    try {
      const { data: data } = await axios.post(apiMappings.organizationRole.listView.cloneRole, {
        orgRoleId: Object.values(selectedRows)[0].orgRoleId,
        orgRoleName: orgRoleName,
        orgRoleDescription: orgRoleDescription
      }, {});
      if (data.status === 200) {
        toast.add(data.message, 'check-round', false)
        setSelectedRows({})
        handleFetchData(fetchOptions)
        fetchOptions.apis?.resetSelection();
        return
      }
      if(data.status === 400){
        toast.add(data.message, 'check-round', false);
        return
      }
    } catch (errorMessage) {
      toast.add(`${dynamicLabels.somethingWendWrong}`, 'warning', false);
    }

  }

  return (
    <>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh', paddingTop: '10px' }} px='10px' pb='15px'>
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
          {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
          <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />

          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='0px'>
            {pageLabels?.buttons.add &&
              <>
                <IconButton id='organizationRoles-actionBar-add'
                  intent='page'
                  data-tip
                  data-for='add_profile'
                  iconVariant='icomoon-add'
                  onClick={() => {
                    history.push({ pathname: '/organizationRoles' })
                  }}>
                  {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                </IconButton>
                <ReactTooltip id='add_profile' type='info' effect='solid' place='bottom'>
                  {`${dynamicLabels.clickHereToAddOrganizationRole}`}
                </ReactTooltip>
              </>}
          </Box>
        </Box>

        {/* LIST VIEW CONTAINER */}
        <StyledGrid container spacing={5} style={{ boxShadow: '0 2px 20px -10px #000' }}>
          {!emptyData ?
            <>
              <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                <WhiteCard>
                  {columns.length > 0 && (
                    <ListView
                      rowIdentifier='orgRoleId'
                      style={{ height: '100%', overflow: 'visible' }}
                      columns={columns}
                      data={OranizationRoleListData}
                      onFetchData={handleFetchData}
                      hasRowSelectionWithEdit={true}
                      onRowSelect={onRowSelect}
                      onSortChange={onSortChange}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      onApply={onApplyColumnPreferences}
                      totalRows={totalRowsSelector}
                      loading={rowsLoading}
                      isEditMode={isEditMode}
                      hasSelectAllRows={false}
                      isColumnLoading={columnsLoading}
                      onRowEditClick={(row) => {
                        history.push({ 'pathname': `updateorganizationRole/${row.orgRoleId}` });

                      }}
                    >
                      {viewMode === 'listview' ?
                        {
                          ActionBar: (
                            <Box display='flex' horizontalSpacing='10px'>
                              {isEditMode ? (
                                <>
                                </>
                              ) : (
                                Object.keys(actionBarButtons).map(
                                  (buttonKey, index) => {
                                    switch (buttonKey) {
                                      default: {
                                        return <CreateActionBarButton
                                          buttonKey={buttonKey}
                                          actionBarButton={actionBarButtons[buttonKey]}
                                          buttonIndex={index}
                                          selectedRows={selectedRows}
                                          handleActionBarButtonClick={handleActionBarButtonClick}
                                          isButtonDisabled={Object.keys(selectedRows).length >= 2 && actionBarButtons[buttonKey].permission}
                                          buttonToolTipTextList={buttonKey === 'delete' ? `${dynamicLabels.clickHereToDeleteOrganizationRole}` : buttonKey === 'cloneRole' ? `${dynamicLabels.clickheretoclonetheselectedOrganizationRoles}` : ``} />
                                      }
                                    }
                                  }
                                ))}
                            </Box>
                          )
                        }
                        : undefined}
                    </ListView>
                  )}
                </WhiteCard>
              </Grid>
            </> : undefined
          }
        </StyledGrid>
      </Box>



      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal open={!!organizationRoleActivationRequest} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={dynamicLabels?.statusConfirmation}
            imageVariant='icomoon-close'
            handleClose={() => {
              organizationRoleActivationRequest?.failureCallback &&
                organizationRoleActivationRequest?.failureCallback(!organizationRoleActivationRequest.activeRequest);
              setOrganizationRoleActivationRequest(undefined);
            }}
          />,

          content: (
            <>
              <div style={{ fontSize: '14px' }}>
                {organizationRoleActivationRequest?.activeRequest
                  ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                  : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
            </>),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id={`${organizationRoleActivationRequest?.activeRequest ? 'MarkAsAcitve': 'MarkAsInactive'}--Modal-OK`} iconVariant='icomoon-tick-circled' primary onClick={handleOrganizationRoleActivation}>{dynamicLabels.ok}</IconButton>
              <IconButton id={`${organizationRoleActivationRequest?.activeRequest ? 'MarkAsAcitve': 'MarkAsInactive'}--Modal-Cancel`} iconVariant='icomoon-close' iconSize={11}
                onClick={() => {
                  organizationRoleActivationRequest?.failureCallback &&
                    organizationRoleActivationRequest?.failureCallback(!organizationRoleActivationRequest.activeRequest);
                  setOrganizationRoleActivationRequest(undefined);
                }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          )
        }}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRow}
      />

      {/* FAVOURITE CONFIRMATION MODAL */}
      <Modal open={!!markFavourite} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={dynamicLabels?.statusConfirmation}
            imageVariant='icomoon-close'
            handleClose={() => {
              markFavourite?.failureCallback &&
                markFavourite?.failureCallback(!markFavourite.favRequest);
              setMarkFavourite(undefined);
            }}
          />,

          content: (
            <>
              <div style={{ fontSize: '14px' }}>
                {markFavourite?.favRequest
                  ? dynamicLabels.areYouSureYouWantToMarkAsDefault + markFavourite?.selectedPersona + " will be overridden by this one"
                  : undefined}</div>
            </>),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleMarkFavourite}>{dynamicLabels.ok}</IconButton>
              <IconButton iconVariant='icomoon-close' iconSize={11}
                onClick={() => {
                  markFavourite?.failureCallback &&
                    markFavourite?.failureCallback(!markFavourite.favRequest);
                  setMarkFavourite(undefined);
                }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          )
        }}
      </Modal>

      {/* CLONE MODAL */}
      <Modal
        open={showCloneConfirmation}
        onToggle={value => {
          setShowCloneConfirmation(value);
        }}
        width='600px'
        children={{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.cloneOrganizationRole}
              handleClose={() => setShowCloneConfirmation(false)}
              imageVariant='icomoon-close'
              headerStyle={{ fontSize: '15px' }}
            />
          ),

          content: (
            <div style={{ fontSize: '14px' }}>
              <TextInput
                id='orgRoleName'
                name='organization-role-name'
                value={orgRoleName}
                onChange={(e: { target: { value: any } }) => {
                  e.target.value !== "" ? setIsDisable(false) : setIsDisable(true);
                  setOrgRoleName(e.target.value)
                }}
                required={true}
                label={'Organization Role Name'}
                labelColor={'text.inputLabel.default'}
                placeholder={dynamicLabels?.OrganizationRoleName}
                errorMessage={dynamicLabels?.orgRoleNameCannotbeEmpty}
                fullWidth={true}
              />

              <TextInput
                id='orgRoleDescription'
                name='organization-role-description'
                //className='someClassName'
                value={orgRoleDescription}
                onChange={(e: { target: { value: any } }) => {
                  setOrgRoleDescription(e.target.value)
                }}
                label={'Organization Role Description'}
                labelColor={'text.inputLabel.default'}
                placeholder={'Organization Role Description'}
                fullWidth={true}
              />


            </div>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='clone-modal-save' iconVariant='icomoon-save' primary onClick={handleClone}>
                {dynamicLabels.save}
              </IconButton>
              <IconButton id='clone-modal-close' iconVariant='icomoon-close' iconSize={11} onClick={() => setShowCloneConfirmation(false)}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      />
      <OrganizationModal />
    </>
  )
}

export default OrganizationRoleListView;

