import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { ManifestTemplateConfigActions } from "./ManifestTemplateConfiguration.actions";
import {
  IListViewColumn,
  Card,
  ListView,
  ISelectedRows,
  useToast,
  IListViewRow,
  Box,
  IFetchDataOptions,
  withToastProvider,
  withPopup,
  BreadCrumb,
  Tooltip,
  IconButton,
  Grid,
  Modal,
  ModalHeader,
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { IRowData } from "./ManifestTemplateConfiguration.models";
import { ColumnInstance } from "react-table";
import CreateActionBarButton from "../../common/ActionBar/CreateActionBarButton";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import withRedux from "../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../utils/theme";
import { debounce } from "../../../utils/commonFunctions/lodashFunctions";

import {
  AddButtonWrapper,
  ListGridWrapper,
  StyledGrid,
} from "./StyledManifestTemplateConfiguration";
import ManifestTemplateConfigurationForm from "./ManifestTemplateConfigurationForm";
import { sendGA } from "../../../utils/ga";
export interface IManifestTemplateConfigurationProp {
  navigateToList?: boolean;
}

const ManifestTemplateConfiguration = ({
  navigateToList,
}: IManifestTemplateConfigurationProp) => {
  const dispatch = useDispatch<Dispatch<ManifestTemplateConfigActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.manifestTemplateConfiguration
  );
  const toast = useToast();
  const pageLabels = useTypedSelector(
    (state) => state.pageLabels.manifestTemplateConfiguration
  );
  const { structure, loading, data } = useTypedSelector(
    (state) => state.manifestTemplateConfiguration
  );

  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [
    manifestTemplateActivationRequest,
    setManifestTemplateActivationRequest,
  ] = useState<
    | {
        activeRequest: boolean;
        templateIds: Record<number, boolean>;
        failureCallback?: React.Dispatch<React.SetStateAction<boolean>>;
      }
    | undefined
  >();
  const [pageType, setPageType] = useState<string>("list");

  const breadCrumbOptions = useMemo(
    () => [
      {
        id: "manifestTemplateConfiguration",
        label: dynamicLabels.MANIFEST_TEMPLATE_CONFIGURATION
          ? dynamicLabels.MANIFEST_TEMPLATE_CONFIGURATION
          : "Manifest Configuration",
      },
    ],
    [dynamicLabels]
  );

  useEffect(() => {
    dispatch({
      type: "@@manifestTemplateConfig/SET_COLUMNS_LOADING",
      payload: { columns: true },
    }),
      dispatch({ type: "@@manifestTemplateConfig/FETCH_STRUCTURE" });
    dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
  }, []);

  useEffect(() => {
    const mongoStructure = structure.columns;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "manifestTemplateConfiguration",
        cellCallbackMapping
      );
      setColumns(newColumns);
    }
  }, [structure.columns]);

  useEffect(() => {
    toastDispatch({
      type: "@@globalToast/clear",
    });
    window.scrollTo(0, 0);
    if (pageType === "list") {
      handleFetchData({});
    }
  }, [pageType]);

  useEffect(() => {
    setPageType("list");
  }, [navigateToList]);

  const handleActiveFlChange = (
    isChecked: boolean,
    { templateId }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const templateIds = {
      [templateId]: true,
    };
    setManifestTemplateActivationRequest({
      activeRequest: isChecked,
      templateIds,
      failureCallback,
    });
  };

  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange,
  };

  const onCancel = () => {
    setPageType("list");
  };

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  const onSaveColumnPreferences = useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...structure.columns };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });
      const payload = {
        ...structure,
        columns,
      };
      try {
        const {
          data: { message },
        } = await axios.put(
          apiMappings.manifestTemplateConfiguration.listView.structure,
          payload
        );
        message && toast.add(message, "check-round", false);
      } catch (error) {
        console.log(error, "An error occured");
      }
    },
    [structure.columns]
  );

  //handleFetchData() fetches the data of the listView.
  const handleFetchData = useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      dispatch({
        type: "@@manifestTemplateConfig/SET_DATA_LOADING",
        payload: { listView: true },
      });

      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });

      dispatch({
        type: "@@manifestTemplateConfig/FETCH_DATA",
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

  //handleManifestTemplateConfigActivation() handles active/inactive functionality of toggle.
  const handleManifestTemplateConfigActivation = async () => {
    if (!manifestTemplateActivationRequest) {
      return;
    }
    setManifestTemplateActivationRequest(undefined);

    let payload = {};

    if (
      Object.keys(manifestTemplateActivationRequest.templateIds).length === 1
    ) {
      const templateId = Number(
        Object.keys(manifestTemplateActivationRequest.templateIds)[0]
      );
      dispatch({
        type: "@@manifestTemplateConfig/CHANGE_STATUS",
        payload: {
          templateId,
          isActiveFl: manifestTemplateActivationRequest.activeRequest,
        },
      });
      payload = {
        type: "MANIFEST_TEMPLATE",
        templateId: templateId,
      };
    }

    try {
      const {
        data: { message, status },
      } = await axios.put(
        apiMappings.manifestTemplateConfiguration.listView.activationRequest +
          `?isActive=${manifestTemplateActivationRequest.activeRequest}`,
        payload
      );
      if (status === 200) {
        toast.add(
          manifestTemplateActivationRequest.activeRequest
            ? `${
                dynamicLabels?.manifestTemplateActivatedSuccessfully || message
              }`
            : `${
                dynamicLabels?.manifestTemplateInactivatedSuccessfully ||
                message
              }`,
          "check-round",
          false
        );
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        return;
      }
      throw message;
    } catch (errorMessage) {
      manifestTemplateActivationRequest.failureCallback &&
        manifestTemplateActivationRequest.failureCallback(
          !manifestTemplateActivationRequest.activeRequest
        );
      toast.add(
        typeof errorMessage === "string"
          ? errorMessage
          : dynamicLabels.somethingWendWrong,
        "",
        false
      );
    }
  };

  //onRowEditClick() redirects the page to form. Selected HTML template can be edited through this.
  const onRowEditClick = (row: IListViewRow) => {
    if (row.clientId !== 0) {
      dispatch({
        type: "@@manifestTemplateConfig/SET_DATA",
        payload: {
          key: "isEditManifestTemplate",
          value: row,
        },
      });
      setSelectedRows({});
      setPageType("form");
    } else {
      toast.add(dynamicLabels.cannotEditLNDefTemplate, "warning", false);
    }
  };

  //setAsFavourite() allows the selected template to be marked as favourite. The template marked favourite will be set as deafult in the Print Manifest Modal.
  const setAsFavourite =debounce( async (row: ISelectedRows) => {
    dispatch({
      type: "@@manifestTemplateConfig/SET_DATA_LOADING",
      payload: { listView: true },
    });
    try {
      const isActiveFl = Object.values(row)?.map((row) =>
        Boolean(row.isActiveFl)
      )?.[0];
      if (!isActiveFl) {
        toast.add(
          dynamicLabels?.manifestMarkAsFavouriteInactiveMessage,
          "warning",
          false
        );
        dispatch({
          type: "@@manifestTemplateConfig/SET_DATA_LOADING",
          payload: { listView: false },
        });
        return;
      }
      let payload = {
        type: "MANIFEST_TEMPLATE",
        templateId: `${
          Object.keys(row).map((rowId: string) => Number(rowId))[0]
        }`,
      };
      const {
        data: { message, status },
      } = await axios.put(
        `${apiMappings.manifestTemplateConfiguration.listView.setFavourite}`,
        payload
      );
      if (status === 200) {
        toast.add(
          dynamicLabels?.manifestTemplatemarkedAsFavourite || message,
          "check-round",
          false
        );

        setSelectedRows && setSelectedRows({});
        dispatch({
          type: "@@manifestTemplateConfig/SET_DATA_LOADING",
          payload: { listView: false },
        });
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw message;
    } catch (errorMessage) {
      dispatch({
        type: "@@manifestTemplateConfig/SET_DATA_LOADING",
        payload: { listView: false },
      });
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }

  } ,500)

  //handleAddManifestTemplate() redirects the page to form. New HTML template can be added through this form.
  const handleAddManifestTemplate = () => {
    sendGA("Navigation", "Manifest Configuration - Add button");
    setPageType("form");
  };

  return (
    <>
      <div id="toast-inject-here"></div>
      {pageType === "list" ? (
        <Box
          display="flex"
          flexDirection="column"
          style={{ width: "100%", height: "100%" }}
          px="15px"
          pb="15px"
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <BreadCrumb options={breadCrumbOptions} onClick={() => {}} />
            {/* Page Action Buttons */}
            {pageLabels?.buttons.add && (
              <AddButtonWrapper className="add-button-wrapper">
                <Tooltip
                  tooltipDirection="bottom"
                  arrowPlacement="center"
                  messagePlacement="end"
                  message={`${dynamicLabels.clickHereToAdd} ${
                    dynamicLabels?.manifestTemplate || "Manifest Template Label"
                  }.`}
                  hover={true}
                >
                  <IconButton
                   id='manifestConfiguration-actionBar-add'
                    intent="page"
                    iconVariant="icomoon-add"
                    onClick={handleAddManifestTemplate}
                  >
                    {dynamicLabels?.[pageLabels?.buttons.add] ||
                      dynamicLabels.add}
                  </IconButton>
                </Tooltip>
              </AddButtonWrapper>
            )}
          </Box>

          {/* LIST VIEW CONTAINER */}
          <ListGridWrapper
            className="list-grid-wrapper"
            container
            spacing={5}
            style={{ marginTop: "20px" }}
          >
            <Grid item md={12} style={{ display: "flex", overflow: "hidden" }}>
              <StyledGrid
                container
                spacing={15}
                style={{ boxShadow: "0 2px 20px -10px #000" }}
              >
                <Grid
                  className="grid-customised-scroll-bar"
                  item
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
                    <ListView
                      rowIdentifier="templateId"
                      hasRowSelectionWithEdit={true}
                      columns={columns}
                      data={data?.results}
                      totalRows={data?.totalCount}
                      onFetchData={handleFetchData}
                      onRowSelect={onRowSelect}
                      loading={loading?.listView || false}
                      isColumnLoading={loading?.columns}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      hasSelectAllRows={false}
                      onRowEditClick={onRowEditClick}
                      style={{ height: "90vh" }}
                      showFavouriteStar={true}
                    >
                      {{
                        ActionBar: (
                          <Box display="flex" horizontalSpacing="10px">
                            {structure.buttons &&
                              Object.keys(structure?.buttons).map(
                                (buttonKey, index) => {
                                  return (
                                    <CreateActionBarButton
                                      id="manifestConfiguration-actionBar-{{buttonKey}}"
                                      buttonKey={buttonKey}
                                      buttonIndex={index}
                                      actionBarButton={
                                        structure?.buttons[buttonKey]
                                      }
                                      buttonToolTipTextList={
                                        structure?.buttons[buttonKey].label
                                      }
                                      selectedRows={selectedRows}
                                      handleActionBarButtonClick={() =>
                                        setAsFavourite(selectedRows)
                                      }
                                      isButtonDisabled={
                                        (Object.keys(selectedRows).length !==
                                          1 &&
                                          structure?.buttons[buttonKey]
                                            .permission) ||
                                        (Object.keys(selectedRows).length
                                          ? selectedRows[
                                              Object.keys(selectedRows)[0]
                                            ]?.isFavourite
                                          : false)
                                      }
                                    />
                                  );
                                }
                              )}
                          </Box>
                        ),
                      }}
                    </ListView>
                  </Card>
                </Grid>
              </StyledGrid>
            </Grid>
          </ListGridWrapper>
        </Box>
      ) : (
        <ManifestTemplateConfigurationForm onFormCancel={onCancel} />
      )}

      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal
        open={!!manifestTemplateActivationRequest}
        onToggle={() => {}}
        size="md"
      >
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant="icomoon-close"
              handleClose={() => {
                manifestTemplateActivationRequest?.failureCallback &&
                  manifestTemplateActivationRequest?.failureCallback(
                    !manifestTemplateActivationRequest.activeRequest
                  );
                setManifestTemplateActivationRequest(undefined);
              }}
            />
          ),
          content: (
            <>
              <div style={{ fontSize: "14px" }}>
                {manifestTemplateActivationRequest?.activeRequest
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
                id={`ManifestConfiguration-${manifestTemplateActivationRequest?.activeRequest
                  ? 'MarkAsAcitve'
                  : 'MarkAsInactive'}-Modal-Ok`}
                iconVariant="icomoon-tick-circled"
                primary
                onClick={handleManifestTemplateConfigActivation}
              >
                {dynamicLabels.ok}
              </IconButton>
              <IconButton
                id={`ManifestConfiguration-${manifestTemplateActivationRequest?.activeRequest
                  ? 'MarkAsAcitve'
                  : 'MarkAsInactive'}-Modal-cancel`}
                iconVariant="icomoon-close"
                iconSize={11}
                onClick={() => {
                  manifestTemplateActivationRequest?.failureCallback &&
                    manifestTemplateActivationRequest?.failureCallback(
                      !manifestTemplateActivationRequest.activeRequest
                    );
                  setManifestTemplateActivationRequest(undefined);
                }}
              >
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
    </>
  );
};

export default withThemeProvider(
  withToastProvider(
    withRedux(withPopup(ManifestTemplateConfiguration)),
    "toast-inject-here"
  )
);
