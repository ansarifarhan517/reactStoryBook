import React, { useState, Dispatch, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {

  Card,
  Grid,
  Box,
  BreadCrumb,
  IconButton,
  IListViewColumn,
  ListView,
  IFetchDataOptions,
  useToast,
  ISelectedRows,
  ModalHeader,
  Modal,
  Tooltip
} from "ui-library";
import { ReactTooltipCustom as ReactTooltip } from "../../../../../utils/layouts/ReactTooltipCustom";
import { UserManagementActions } from "./UserManagement.actions";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { StyledGrid } from "./styles";
import { ColumnInstance } from "react-table";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { sendGA } from "../../../../../utils/ga";
import { any } from "prop-types";
import CreateActionBarButton from "./SubComponent/changePasswordButton/Button";
import ChangePassword from "./SubComponent/popups/ChangePassword";
import DeleteModel from "./SubComponent/popups/DeleteModel";
import { IRowData } from "./UserManagement.models";
import HandOverModal from "./SubComponent/popups/HandOverModal";

import DownloadUsersReport from "./UserManagementListViewIconBar"

const UserManagementListView = () => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.users);
  const toast = useToast();
  const history = useHistory();
  const columnsStructure = useTypedSelector(
    (state) => state.settings.userManagement.listView.structure.columns
  );
  const UserManagementListData = useTypedSelector(
    (state) => state.settings.userManagement.listView.data.results
  );
  const pageLabels = useTypedSelector((state) => state.pageLabels.user);
  const rowsLoading = useTypedSelector(
    (state) => state.settings.userManagement.listView.listLoading.rows
  );
  const columnsLoading = useTypedSelector(
    (state) => state.settings.userManagement.listView.listLoading.columns
  );
  const structure = useTypedSelector(
    (state) => state.settings.userManagement.listView.structure
  );
  const totalRowsSelector = useTypedSelector(
    (state) => state.settings.userManagement.listView.data.totalCount
  );
  const actionBarButtons = useTypedSelector(
    (state) => state.settings.userManagement.listView.structure.buttons
  );
  const viewMode = useTypedSelector(
    (state) => state.settings.userManagement.listView.viewMode
  );
  const emptyData = useTypedSelector(
    (state) => state.settings.userManagement.listView.emptyData
  );

  // States
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({ pageSize: 50, pageNumber: 1 });
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [userActivationRequest, setUserActivationRequest] = useState<
    | {
      activeRequest: boolean;
      userIds: Record<number, boolean>;
      failureCallback?: React.Dispatch<React.SetStateAction<boolean>>;
    }
    | undefined
  >();
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showHandOverModal, setShowHandOverModal] = useState<boolean>(false);
  const [handOverData, setHandOverData] = useState<any>();
  const pageName="user_management"
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);



  // Dispatcher
  const dispatch = useDispatch<Dispatch<UserManagementActions>>();

  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "userAccessConfiguration",
        label: dynamicLabels.userAccessConfiguration,
        disabled: true,
      },
      {
        id: "userManagementList",
        label: dynamicLabels.userManagementList,
        disabled: true,
      },
    ],
    [pageLabels, dynamicLabels]
  );

  const onSortChange = React.useCallback(() => { }, []);

  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis,
    }: IFetchDataOptions) => {
      dispatch({
        type: "@@userManagement/SET_DATA",
        payload: {
          key: "listLoading",
          value: {
            rows: true,
            columns: false,
          },
        },
      });
      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });

      dispatch({
        type: "@@userManagement/FETCH_DATA",
        payload: {
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder,
          },
        },
      });
    },
    []
  );

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columnsPreferences = { ...columnsStructure };
      Object.keys(columnsPreferences).forEach((columnKey) => {
        columnsPreferences[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columnsPreferences,
      };
      dispatch({
        type: "@@userManagement/SET_DATA",
        payload: {
          key: "listLoading",
          value: {
            rows: false,
            columns: true,
          },
        },
      });

      sendGA("Event New", "userManagement  - Save & Apply column preferences");

      try {
        const {
          data: { message },
        } = await axios.put(
          apiMappings.userManagement.listView.structure,
          payload
        );
        message && toast.add(message, "check-round", false);
        dispatch({
          type: "@@userManagement/SET_DATA",
          payload: {
            key: "listLoading",
            value: {
              rows: false,
              columns: false,
            },
          },
        });
      } catch (error) {
        dispatch({
          type: "@@userManagement/SET_DATA",
          payload: {
            key: "listLoading",
            value: {
              rows: false,
              columns: false,
            },
          },
        });
      }
    },
    [columnsStructure]
  );

  const onApplyColumnPreferences = React.useCallback(() => {
    sendGA("Event New", "userManagement -  Apply column preferences");
  }, []);

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case "delete":
        setShowDeletionConfirmation(true);
        break;

      case "changePwd":
        setShowChangePassword(true);
        break;
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "@@userManagement/FETCH_STRUCTURE" });
    dispatch({
      type: "@@userManagement/SET_DATA",
      payload: {
        key: "userId",
        value: any,
      },
    });
    handleFetchData(fetchOptions);
  }, []);

  useEffect(() => {
    const mongoStructure = columnsStructure;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "userList",
        cellCallbackMapping,
        "userId"
      );
      setColumns(newColumns);
    }
  }, [columnsStructure]);

  // Select Row
  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  const handleDelete = async () => {

    const fetchDataSilenty = () => {
      const {
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions: filter,
      } = fetchOptions;
      let searchText = filter?.searchText;
      let payload: any = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filter?.searchBy || "",
        searchText: searchText || "",
        sortBy: sortOptions?.sortBy || "",
        sortOrder: sortOptions?.sortOrder || "",
        isLoading: false,
        isTotalCountLoading: false,
      };
      dispatch({
        type: "@@userManagement/FETCH_DATA",
        payload,
      });
    };
    const handOverEmails = Object.values(selectedRows).filter((row: any) => {
      if (row?.handOverEnabled && !row.isHandOverComplete) {
        return row
      }
    });
    setShowDeletionConfirmation(false);
    if (handOverEmails.length > 0) {
      const msg = `Handover process is incomplete for the user(s) ${Object.values(handOverEmails).map((row: any) => row.userName).join(", ")}. Please complete the handover process before deleting the user(s).`
      return toast.add(msg, 'warning', false)
    }
    dispatch({ type: "@@userManagement/SET_LOADING", payload: true });
    try {
      const {
        data: { message, status },
      } = await axios.post(`${apiMappings.userManagement.listView.deleteUser}?isValidate=true`,
        Object.values(selectedRows).map((row: any) => Number(row.userId)),
      );
      if (status === 200) {
        toast.add(message, "check-round", false);
        fetchOptions.apis?.resetSelection();
        setSelectedRows({});
        fetchDataSilenty();
        dispatch({
          type: "@@userManagement/SET_LOADING",
          payload: false,
        });
        return;
      }
      throw message;
    } catch (errorMessage: any) {
      dispatch({
        type: "@@userManagement/SET_LOADING",
        payload: false,
      });
      toast.add(errorMessage?.response?.data?.message || dynamicLabels.somethingWendWrong, "warning", false);
    }
  };



  const handleIsActiveFlChange = (
    isChecked: boolean,
    { userId, persona, userGroupId, name, emailAddress, handOverEnabled }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const userIds = {
      [userId]: true,
    };
    setUserActivationRequest({
      activeRequest: isChecked,
      userIds,
      failureCallback,
    });
    setHandOverData({
      persona: persona,
      userGroupId: userGroupId,
      name: name,
      emailAddress: emailAddress,
      userId: userId,
      handOverEnabled: handOverEnabled,
      activeRequest: isChecked
    });
  };

  const cellCallbackMapping = {
    isActiveFl: handleIsActiveFlChange,
  };

  const handleUserActivation = async () => {
    if (!userActivationRequest) {
      return;
    }
    setUserActivationRequest(undefined);
    if (Object.keys(userActivationRequest.userIds).length === 1) {
      const userId = Number(Object.keys(userActivationRequest.userIds)[0]);
      try {
        if (!userActivationRequest.activeRequest && handOverData && handOverData?.handOverEnabled) {
          setShowHandOverModal(true);
          return;
        } else {
          const {
            data: { message, status },
          } = await axios.put(
            apiMappings.userManagement.listView.toggleProfileActive,
            {
              id: userId,
              isActiveFl: userActivationRequest.activeRequest,
            }
          );
          if (status === 200) {
            toast.add(message, "check-round", false);
            setSelectedRows({});
            setHandOverData(undefined);
            handleFetchData(fetchOptions);
            fetchOptions.apis?.resetSelection();
            return;
          }
          throw message;
        }
      } catch (errorMessage) {
        setHandOverData(undefined)
        userActivationRequest.failureCallback &&
          userActivationRequest.failureCallback(
            !userActivationRequest.activeRequest
          );
        toast.add(
          typeof errorMessage === "string"
            ? errorMessage
            : dynamicLabels.somethingWendWrong,
          "",
          false
        );
      }
    }
  };

  const handleRetryHandOverModal = () => {
    Object.keys(selectedRows)?.map((userId) => {
      if (selectedRows[userId]?.isHandOverComplete) {
        toast.add("Handover process has been completed successfully for this user.", "warning", false);
        return
      } else {
        setHandOverData({
          persona: selectedRows[userId]?.persona,
          userGroupId: selectedRows[userId]?.userGroupId,
          name: selectedRows[userId]?.name,
          emailAddress: selectedRows[userId]?.emailAddress,
          userId: selectedRows[userId]?.userId,
          handOverEnabled: selectedRows[userId]?.handOverEnabled,
          handOverId: selectedRows[userId]?.handOverReferenceId,
          toUserId: selectedRows[userId]?.toUserId,
          activeRequest: selectedRows[userId]?.isActiveFl
        })
        setShowHandOverModal(true)
      }
    })
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
          marginTop: "15px",
        }}
        px="15px"
        pb="15px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          py="15px"
        >
          <BreadCrumb options={breadCrumbOptions} />

          <Box
            display="flex"
            justifyContent="space-evenly"
            horizontalSpacing="10px"
          >
            {pageLabels?.buttons.add && (
              <>
                <IconButton
                id = {`${pageName}--actionbar--add`}
                  intent="page"
                  data-tip
                  data-for="tt-user"
                  iconVariant="icomoon-add"
                  onClick={() => {
                    history.push({ pathname: "/addUser" });
                  }}
                >
                  {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                </IconButton>
                <ReactTooltip
                  id="tt-user"
                  type="info"
                  effect="solid"
                  place="bottom"
                >
                  {`${dynamicLabels.clickHereToAdd} ${dynamicLabels.userManagementList}`}
                </ReactTooltip>
              </>
            )}
          </Box>
        </Box>
        <StyledGrid
          container
          spacing={5}
          style={{
            boxShadow: viewMode === "listview" ? "0 2px 20px -10px #000" : "",
          }}
        >
          {!emptyData ? (
            <>
              <Grid
                className="grid-customised-scroll-bar"
                item
                md={viewMode === "listview" ? 12 : 4}
                style={{ display: "flex", overflow: "hidden" }}
              >
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    backgroundColor: "#fff",
                    overflow: "hidden",
                    width: "100%",
                    paddingRight: 0,
                    paddingBottom: 0,
                  }}
                >
                  {columns.length > 0 && (
                    <ListView
                      rowIdentifier="userId"
                      style={{ height: "100%", overflow: "visible" }}
                      columns={columns}
                      data={UserManagementListData}
                      onFetchData={handleFetchData}
                      hasRowSelectionWithEdit={true}
                      hasSelectAllRows={false}
                      // hasRowSelection={true}
                      onSortChange={onSortChange}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      onApply={onApplyColumnPreferences}
                      totalRows={totalRowsSelector}
                      loading={rowsLoading}
                      isColumnLoading={columnsLoading}
                      onRowEditClick={(row) => {
                        history.push({ 'pathname': `updateUser/${row.userId}` });
                      }}
                      onRowSelect={onRowSelect}
                    >
                      {{
                        IconBar:
                          <Box display="flex" style={{ position: 'relative' }}>
                            <Tooltip
                              message={`${dynamicLabels?.download} ${dynamicLabels?.user} ${dynamicLabels?.report}`}
                              arrowPlacement='center'
                              messagePlacement='end'
                              hover={true}
                            >
                              <IconButton
                                 id='user--actionbar--download'
                                iconVariant="icomoon-download"
                                iconSize={16}
                                onlyIcon
                                style={{ color: 'inherit' }}
                                onClick={() => setShowDownloadModal(true)}
                              />
                            </Tooltip>
                          </Box>,
                        ActionBar: (
                          <Box display="flex" horizontalSpacing="10px">
                            {Object.keys(actionBarButtons).map(
                              (buttonKey, index) => {
                                switch (buttonKey) {
                                  default: {
                                    return (
                                      <CreateActionBarButton
                                        buttonKey={buttonKey}
                                        actionBarButton={
                                          actionBarButtons[buttonKey]
                                        }
                                        buttonIndex={index}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={
                                          handleActionBarButtonClick
                                        }
                                        handleRetryHandOverModal={handleRetryHandOverModal}
                                        isButtonDisabled={
                                          !Object.keys(selectedRows).length &&
                                          actionBarButtons[buttonKey].permission
                                        }
                                        buttonToolTipTextList={
                                          buttonKey === "changePwd"
                                            ? `${dynamicLabels.changePassword}`
                                            : buttonKey === "delete"
                                              ? `${dynamicLabels.Delete}`
                                              : `tt_${actionBarButtons[buttonKey].label}`
                                        }
                                        userName={localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')['userName']}
                                      />
                                    );
                                  }
                                }
                              }
                            )}
                          </Box>
                        ),
                      }}
                    </ListView>
                  )}
                </Card>
              </Grid>
            </>
          ) : undefined}
        </StyledGrid>
      </Box>
      {showChangePassword && (
        <ChangePassword
          setShowChangePassword={setShowChangePassword}
          showChangePassword={showChangePassword}
          selectedRows={selectedRows}
        />
      )}

      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal open={!!userActivationRequest} onToggle={() => {}} size="md">
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant="icomoon-close"
              handleClose={() => {
                userActivationRequest?.failureCallback &&
                  userActivationRequest?.failureCallback(
                    !userActivationRequest.activeRequest
                  );
                setUserActivationRequest(undefined);
              }}
            />
          ),

          content: (
            <>
              <div style={{ fontSize: "14px" }}>
                {userActivationRequest?.activeRequest
                  ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                  : dynamicLabels.areYouSureYouWantToMarkAsInactive}
              </div>
            </>
          ),
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
              <IconButton
                id={`${userActivationRequest?.activeRequest
                  ? 'MarkAsAcitve'
                  : 'MarkAsInactive'}--Modal-Confirm`}
                iconVariant="icomoon-tick-circled"
                primary
                onClick={handleUserActivation}
              >
                {dynamicLabels.confirm}
              </IconButton>
              <IconButton
                id={`${userActivationRequest?.activeRequest
                  ? 'MarkAsAcitve'
                  : 'MarkAsInactive'}--Modal-Cancel`}
                iconVariant="icomoon-close"
                iconSize={11}
                onClick={() => {
                  userActivationRequest?.failureCallback &&
                    userActivationRequest?.failureCallback(
                      !userActivationRequest.activeRequest
                    );
                  setUserActivationRequest(undefined);
                }}
              >
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>

      {showChangePassword && (
        <ChangePassword
          setShowChangePassword={setShowChangePassword}
          showChangePassword={showChangePassword}
          selectedRows={selectedRows}
        />
      )}

      {/* Delete User */}
      {showDeletionConfirmation && (
        <DeleteModel
          showDeletionConfirmation={showDeletionConfirmation}
          setShowDeletionConfirmation={(value: boolean) =>
            setShowDeletionConfirmation(value)
          }
          deleteSelectedRows={handleDelete}
        />
      )}

      {/*This will onlt be used for internal users for handover process.*/}
      {showHandOverModal && <HandOverModal
        showHandOverModal={showHandOverModal}
        setShowHandOverModal={(value: boolean) => setShowHandOverModal(value)}
        setHandOverData={(value: any) => setHandOverData(value)}
        handOverData={handOverData}
        fetchOptions={fetchOptions}
        handleFetchData={handleFetchData}
        setSelectedRows={setSelectedRows}
      />}

      <DownloadUsersReport usersDynamicLabels={dynamicLabels} showDownloadModal={showDownloadModal} setShowDownloadModal={setShowDownloadModal} fetchOptions={fetchOptions} />
    </>
  );
};
export default UserManagementListView;


