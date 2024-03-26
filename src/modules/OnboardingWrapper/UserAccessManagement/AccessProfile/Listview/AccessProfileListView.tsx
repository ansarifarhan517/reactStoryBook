import React, { Dispatch, useState, useEffect } from 'react';
import { AccessProfileActions } from './AccessProfile.actions'
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { ColumnInstance } from 'react-table';
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView';
import { StyledGrid } from './styles'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import iconsMapping from '../../../../../utils/mongo/ListView/actionBarIcons.mapping'
import { IRowData } from './AccessProfile.models'
import {
  Box,
  IconButton,
  BreadCrumb,
  Tooltip,
  Modal,
  TextInput,
  Position,
  ModalHeader,
  IFetchDataOptions,
  ISelectedRows,
  Card,
  ListView,
  IListViewColumn,
  useToast,
  Grid
} from "ui-library";
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import DeleteConfirmationModal from '../../../../../utils/components/DeleteConfirmationModal'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

const AccessProfileListView = () => {

  interface IAddFormData {
    accessProfileId: number
    accessProfileName: string
    accessProfileDesc: string
  }

  const dispatch = useDispatch<Dispatch<AccessProfileActions>>();
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.accessProfile)
  const structure = useTypedSelector(state => state.accessProfile.listView.structure);
  const columnsSelector = useTypedSelector(state => state.accessProfile.listView.structure.columns);
  const rowsSelector = useTypedSelector(state => state.accessProfile.listView.data.results);
  const totalRowsSelector = useTypedSelector(state => state.accessProfile.listView.data.totalCount);
  const rowsLoading = useTypedSelector(state => state.accessProfile.listView.listLoading.rows);
  const columnsLoading = useTypedSelector(state => state.accessProfile.listView.listLoading.columns);
  const actionBarButtons = useTypedSelector(state => state.accessProfile.listView.structure.buttons)
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
  const [showOrganizationDetailsPopup, setShowOrganizationDetailsPopup] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false)
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [orgRolecolumns, setOrgRolecolumns] = useState<IListViewColumn[]>([]);
  const [accessProfileActivationRequest, setAccessProfileActivationRequest] = useState<
    { activeRequest: boolean, accessProfileId: Number, attachedUserGroups: Number, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const formInstance = useForm<IAddFormData>({
    mode: 'all', shouldUnregister: false
  })
  const [showClonePopup, setShowClonePopup] = useState<boolean>(false);
  const history = useHistory();
  const [accessProfileId,setAccessProfileId] = useState<number>(0);
  const organizationDetais = useTypedSelector(state=>state.accessProfile.listView.orgRoleData.results);


  const handleToggle = (isChecked: boolean, { accessProfileId, attachedUserGroups }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {

    setAccessProfileActivationRequest({ activeRequest: isChecked, accessProfileId: accessProfileId, attachedUserGroups: attachedUserGroups, failureCallback });

    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: true,
        title: dynamicLabels?.statusConfirmation,
        content: (
            accessProfileActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive
        ),
        footer: (
          <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end'>
            <IconButton id={`${accessProfileActivationRequest?.activeRequest ? 'MarkAsAcitve' : 'MarkAsInactive'}--Modal--Ok`} iconVariant='icomoon-tick-circled' primary onClick={() => handleAccessProfileActivation(isChecked, accessProfileId, attachedUserGroups)}>{dynamicLabels.ok}</IconButton>
            <IconButton id={`${accessProfileActivationRequest?.activeRequest ? 'MarkAsAcitve' : 'MarkAsInactive'}--Modal--Cancel`}  iconVariant='icomoon-close' iconSize={11}
              onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        )
      }
    })
  }





  const handleAccessProfileActivation = async (isChecked: boolean, accessProfileId: number, attachedUserGroups: number) => {
    try {
      if (attachedUserGroups > 0) {
        toast.add(dynamicLabels?.ACCESSPROFILE_ACTIVE_FAIL_ORGROLE_ATTACHED || "Failed to update Access Profile status due to organization roles attached", 'warning', false);
        return
      } else {
        const { data: response } = await axios.put(apiMappings.accessProfile.listView.active, {
          accessProfileId: accessProfileId,
          activeFl: isChecked
        });

        if (response.status === 200) {
          toast.add(response.message, 'check-round', false);
          globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
          handleFetchData(fetchOptions)
          fetchOptions.apis?.resetSelection();
          return;
        }
        throw response.message
      }
    } catch (errorMsg) {
      toast.add(errorMsg, 'warning', false)
    } finally {
      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
    }
  }


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

  const openOrganizationRoleDetails = async (id: any) => {
    const accessProfileId = id.accessProfileId;
    try {
      fetchPersona();
      fetchLanding();
      const { data: data } = await axios.get(apiMappings.accessProfile.listView.orgRoleStructure);
      const mongoStructure = data.columns;
      if (Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(mongoStructure, 'organizationRolePopup');
        setAccessProfileId(accessProfileId)
        setOrgRolecolumns(newColumns)
      }
    } catch (error) {
    } finally {
      setShowOrganizationDetailsPopup(true)
    }
  }


  const handleOrgRoleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }: IFetchDataOptions) => {
   
    dispatch({
      type: '@@organizationRole/SET_DATA',
      payload: {
          key: 'orgRoleCountListLoading',
          value: {
              rows: true,
              columns: false
          }
      }
  })

    dispatch({
        type: '@@organizationRole/FETCH_DATA',
        payload: {
            params: {
                accessProfileId: accessProfileId,
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder,
            },
        }
    })
}, [accessProfileId])



  const cellCallbackMapping = {
    attachedUserGroups: openOrganizationRoleDetails,
    activeFl: handleToggle
  }


  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@accessProfile/SET_DATA',
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
      type: '@@accessProfile/FETCH_DATA',
      payload: {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder
        }
      }
    })
  }, [])

  const onSortChange = React.useCallback(() => { }, []);

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columnsPreferences = { ...columnsSelector }
    Object.keys(columnsPreferences).forEach((columnKey) => {
      columnsPreferences[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columnsPreferences
    }
    dispatch({
      type: '@@accessProfile/SET_DATA',
      payload: {
        key: 'listLoading',
        value: {
          rows: false,
          columns: true
        }
      }
    })

    try {
      const { data: { message } } = await axios.put(apiMappings.accessProfile.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
      dispatch({
        type: '@@accessProfile/SET_DATA',
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
        type: '@@accessProfile/SET_DATA',
        payload: {
          key: 'listLoading',
          value: {
            rows: false,
            columns: false
          }
        }
      })
      console.log(error, error?.response)
    }
  }, [columnsSelector])

  useEffect(() => {
    dispatch({ type: '@@accessProfile/FETCH_STRUCTURE' })
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'accessProfile', cellCallbackMapping);
      setColumns(newColumns)
    }
  }, [columnsSelector])



  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      { id: 'USER_ACCESS', label: dynamicLabels?.USER_ACCESS || "User and Access Management", disabled: true },
      { id: 'accessProfileList', label: dynamicLabels?.accessProfileList || "Access Profiles", disabled: true },
    ];
    return list
  }, [dynamicLabels])

  const handleAddAccessProfile = () => {
    history.push({ pathname: '/addProfile' })
  }


  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const handleActionBarButtonClick = (id: String) => {
    switch (id) {
      case 'delete':
        setShowDeletionConfirmation(true);
        break;
      case 'cloneAccessProfile':
        setShowClonePopup(true)
        break;
    }
  }

  const deleteSelectedRows = async () => {
    setShowDeletionConfirmation(false);
    try {
      const {
        data: data
      } = await axios.put(apiMappings.accessProfile.listView.delete + '?accessProfileId=' + Object.values(selectedRows).map(row => Number(row.accessProfileId)))
      if (data.status === 200) {
        toast.add(`${data?.message}`, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw data?.message;
    } catch (errorMsgs) {
      toast.add(errorMsgs, 'warning', false);
    }
  }

  const handleCloneCancel = () => {
    setShowClonePopup(false)
    formInstance.setValue('accessProfileName',undefined)
    formInstance.setValue('accessProfileDesc',undefined)
  }

  const onSubmit = async (data: IAddFormData) => {
    setIsFormLoading(true)
    try {
      const accessProfileId = Object.values(selectedRows).map(row => Number(row.accessProfileId))
      const { data: response } = await axios.post(apiMappings.accessProfile.listView.clone, {
        accessProfileId: accessProfileId[0],
        accessprofileDesc: data.accessProfileDesc,
        accessprofileName: data.accessProfileName
      })

      if (response.status === 200) {
        toast.add(`${response?.message}`, 'check-round', false)
        setSelectedRows({});
        setShowClonePopup(false);
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw response?.message;
    } catch (error) {
      toast.add(error, 'warning', false);
    } finally {
      setIsFormLoading(false);
      setShowClonePopup(false);
      formInstance.reset()
    }
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' style={{ width: '100%', paddingTop: '15px' }} px='15px' pb='0px'>
        <div>
          <BreadCrumb
            options={breadCrumbOptions}
            width='260px'
          />
        </div>
        <Box display='flex' justifyContent='space-evenly' horizontalSpacing='0px'>
          <Tooltip message={dynamicLabels?.addAccessProfileToolTip} hover={true} messagePlacement={'end'}>
            <IconButton
              id="access_profile--actionbar--add"
              intent='page'
              iconVariant='icomoon-add'
              onClick={handleAddAccessProfile}
            >
              {'Add'}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: '100%', height: '83vh', position: 'relative' }}
        p="1em" 
        mt="5px"
      >
        <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
          <Grid
            className='grid-customised-scroll-bar'
            item
            style={{ display: 'flex', overflow: 'hidden' }}
          >
            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, minHeight: "400px", }}>
              {columns.length > 0 &&
                <ListView
                  rowIdentifier='accessProfileId'
                  style={{ height: '100%', overflow: 'visible' }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  onSortChange={onSortChange}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  onRowSelect={onRowSelect}
                  totalRows={totalRowsSelector}
                  hasRowSelectionWithEdit={true}
                  hasSelectAllRows={false}
                  loading={rowsLoading}
                  onRowEditClick={row => {
                    history.push({ 'pathname': `updateAccessProfile/${row.accessProfileId}` });
                  }}
                  isColumnLoading={columnsLoading}>
                  {{
                    ActionBar: (
                      <Box display='flex' horizontalSpacing='10px'>
                        {
                          Object.keys(actionBarButtons).map(
                            (buttonKey) => (
                              <Tooltip message={`${actionBarButtons[buttonKey].label} `}
                                hover
                                messagePlacement={'start'}
                              >
                                <IconButton
                                  key={buttonKey}
                                  disabled={!(Object.keys(selectedRows).length === 1)}
                                  intent='table'
                                  iconVariant={iconsMapping[buttonKey]}
                                  id={`listView-actionBar-${buttonKey}`}
                                  onClick={() => {
                                    handleActionBarButtonClick(buttonKey)
                                  }}
                                >
                                  {actionBarButtons[buttonKey].label}
                                </IconButton>
                              </Tooltip>
                            ))
                        }
                      </Box>
                    )
                  }}
                </ListView>
              }
            </Card>
          </Grid>
        </StyledGrid>
      </Box>

      {/* Delete Popup */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />




      <Modal
        open={showClonePopup}
        onToggle={value => {
          setShowClonePopup(value)
        }}
        width='600px'
        children={{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.cloneAccessProfileDesc}
              handleClose={() => setShowClonePopup(false)}
              imageVariant='icomoon-close'
              width='600px'
              headerStyle={{ fontSize: '15px' }}
            />
          ),
          content: (
            <Position type='relative'>
              <TextInput
                id='accessProfileName'
                name='accessProfileName'
                ref={formInstance.register({ required: true })}
                required
                error={!!formInstance.errors.accessProfileName}
                errorMessage={dynamicLabels?.accessProfilNameMandatory}
                label={dynamicLabels?.accessprofilename}
                placeholder={dynamicLabels?.accessprofilename}
                fullWidth
              />

              <TextInput
                id='accessProfileDesc'
                name='accessProfileDesc'
                ref={formInstance.register({ required: false })}
                label={dynamicLabels?.accessprofileDesc}
                placeholder={dynamicLabels?.accessprofileDesc}
                fullWidth
              />
            </Position>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='AccessProfile--clone-modal-save' iconVariant='icomoon-save' primary disabled={isFormLoading} onClick={formInstance.handleSubmit(onSubmit)}>
                {dynamicLabels.save}
              </IconButton>
              <IconButton id='AccessProfile--clone-modal-cancel' iconVariant='icomoon-close' iconSize={11} onClick={handleCloneCancel}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      />



      <Modal
        open={showOrganizationDetailsPopup}
        onToggle={value => {
          setShowOrganizationDetailsPopup(value)
        }}
        width='1260.7px'
        children={{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.ORGANIZATION_ROLE_DETAILS}
              handleClose={() => setShowOrganizationDetailsPopup(false)}
              imageVariant='icomoon-close'
              width='1260.7px'
              headerStyle={{ fontSize: '15px' }}
            />
          ),
          content: (
            <ListView
              style={{ height: '250px', overflow: 'visible' }}
              columns={orgRolecolumns}
              data={organizationDetais}
              onFetchData={handleOrgRoleFetchData}
              hideRefresh hideColumnSettings hidePaginationBar
            />
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setShowOrganizationDetailsPopup(false)}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      />
    </>
  )
}

export default AccessProfileListView
