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
  Tooltip,
} from "ui-library";
import { ReactTooltipCustom as ReactTooltip } from "../../../../utils/layouts/ReactTooltipCustom";
import { ItemConfigurationActions } from "./ItemConfiguration.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { StyledGrid } from "./styles";
import { ColumnInstance } from "react-table";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { sendGA } from "../../../../utils/ga";
import { any } from "prop-types";
import UploadExcel from '../../../../utils/wrapper/uploadExcel';
import CreateActionBarButton from "../../../common/ActionBar/CreateActionBarButton";
import FileSaver from "file-saver";
import { preparePOSTData } from './utils'
import capacityConversion from '../../../Vehicle/VehicleListView/utils/capacityConversion';
import { getBaseCurrency } from "../../../../utils/core";
import DeleteConfirmationModal from "../../../../utils/components/DeleteConfirmationModal";
import DownloadMessage from "../../../../utils/components/DownloadMessage";
const columnsToBeConverted = ['itemLength', 'itemBreadth', 'itemHeight', 'itemWeight', 'itemVolume']
const conversionObjectMapping = {
  itemLength: 'dimension',
  itemBreadth: 'dimension',
  itemHeight: 'dimension',
  itemWeight: 'weight',
  itemVolume: 'volume'
}

const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const prepareConvertedData = (filterOptions: any, systemMetric: any) => {
  const columns = filterOptions?.searchBy?.split('#@#')
  const values = filterOptions?.searchText?.split('#@#')

  const ConversionMetricObj = {
    'dimension': systemMetric?.find((obj: any) => obj?.name === 'dimension'),
    'weight': systemMetric?.find((obj: any) => obj?.name === 'weight'),
    'volume': systemMetric?.find((obj: any) => obj?.name === 'volume')
  }

  const newConvertedValue = columns?.map((key: string, index: number) => {
    if (columnsToBeConverted?.indexOf(key) === -1) {
      return values[index]
    } else {
      const converstionfactor = ConversionMetricObj[conversionObjectMapping[key]]?.conversionFactor
      return values?.[index] ? capacityConversion(
        parseFloat(values[index]),
        "POST",
        converstionfactor
      ).toFixed(4) : values[index]
    }

  })

  return {
    ...filterOptions,
    searchBy: filterOptions?.searchBy,
    searchText: newConvertedValue?.join('#@#')
  }

}


const ItemConfigurationListView = () => {
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.settings.itemConfiguration},${currencySymbol}`)

  const toast = useToast();
  const history = useHistory();

  const columnsStructure = useTypedSelector(
    (state) => state.itemConfiguration.listView.structure.columns
  );
  const ItemConfigurationListData = useTypedSelector(
    (state) => state.itemConfiguration.listView.data.results
  );
  const pageLabels = useTypedSelector((state) => state.pageLabels.itemMaster);
  const rowsLoading = useTypedSelector(
    (state) => state.itemConfiguration.listView.listLoading.rows
  );
  const columnsLoading = useTypedSelector(
    (state) => state.itemConfiguration.listView.listLoading.columns
  );
  const structure = useTypedSelector(
    (state) => state.itemConfiguration.listView.structure
  );

  const totalRowsSelector = useTypedSelector(
    (state) => state.itemConfiguration.listView.data.totalCount
  );
  const actionBarButtons = useTypedSelector(
    (state) => state.itemConfiguration.listView.structure.buttons
  );

  const updateFlag = useTypedSelector(
    (state) => state.itemConfiguration.listView.allowUpdate
  );

  const viewMode = useTypedSelector(
    (state) => state.itemConfiguration.listView.viewMode
  );
  const emptyData = useTypedSelector(
    (state) => state.itemConfiguration.listView.emptyData
  );
  const systemMetric = useTypedSelector(state => state.itemConfiguration.listView.systemMetric);

  // States
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [
    isDownloadReportDisabled,
    setDownloadReportDisabled,
  ] = useState<boolean>(false);

  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState<boolean>(false);

  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);

  // Dispatcher
  const dispatch = useDispatch<Dispatch<ItemConfigurationActions>>();

  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "itemConfiguration",
        label: `${dynamicLabels.item_s} Configuration`,
        disabled: true,
      }
    ],
    [pageLabels, dynamicLabels]
  );

  const handleDownloadReport = async () => {

    sendGA('Item action button', 'Item List View Download Report')
    setShowDownloadModal(true)
    setDownloadReportDisabled(true);

    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      searchBy: fetchOptions.filterOptions?.searchBy,
      searchText: fetchOptions.filterOptions?.searchText,
      sortBy: fetchOptions.sortOptions?.sortBy,
      sortOrder: fetchOptions.sortOptions?.sortOrder

    }
    sendGA('Event New', 'alertHistory - Download');

    try {
      await axios.post(apiMappings.itemConfiguration.listView.itemListExcelDownload, null, {
        responseType: 'arraybuffer',
        params: payload
      }).then((response) => {
        FileSaver.saveAs(new Blob([response.data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.item_s} List.xlsx`);
        setDownloadReportDisabled(false);
      })

    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }
  };

  const ItemConfigurationListDataConverted = ItemConfigurationListData?.length > 0 && systemMetric ? ItemConfigurationListData?.map((obj: any) => {
    let data = preparePOSTData(obj, "GET", systemMetric)
    return data
  }) : ItemConfigurationListData

  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis,
    }: IFetchDataOptions) => {

      if ( systemMetric && systemMetric?.length > 0) {
        dispatch({
          type: "@@itemConfiguration/SET_DATA",
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

        const filterOptionsCoverted = filterOptions && systemMetric?.length > 0 ? prepareConvertedData(filterOptions, systemMetric) : filterOptions

        dispatch({
          type: "@@itemConfiguration/FETCH_DATA",
          payload: {
            params: {
              pageNumber: pageNumber,
              pageSize: pageSize,
              searchBy: filterOptionsCoverted?.searchBy,
              searchText: filterOptionsCoverted?.searchText,
              sortBy: sortOptions?.sortBy,
              sortOrder: sortOptions?.sortOrder,
            },
          },
        });
      }

    },
    [systemMetric]
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
        type: "@@itemConfiguration/SET_DATA",
        payload: {
          key: "listLoading",
          value: {
            rows: false,
            columns: true,
          },
        },
      });

      sendGA("Event New", "Item Master  - Save & Apply column preferences");
      try {
        const {
          data: { message },
        } = await axios.put(
          apiMappings.itemConfiguration.listView.structure,
          payload
        );
        message && toast.add(message, "check-round", false);
        dispatch({
          type: "@@itemConfiguration/SET_DATA",
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
          type: "@@itemConfiguration/SET_DATA",
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
   
    sendGA("Event New", "Item Conifguration -  Apply column preferences");
  }, []);

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case "delete":
        setShowDeletionConfirmation(true);
        break;
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "@@itemConfiguration/FETCH_STRUCTURE" });
    dispatch({
      type: "@@itemConfiguration/SET_DATA",
      payload: {
        key: "itemId",
        value: any,
      },
    });
    handleFetchData(fetchOptions);
  }, [systemMetric]);

  useEffect(() => {
    const mongoStructure = columnsStructure;
    if (Object.keys(mongoStructure).length) {
      if(mongoStructure?.itemPrice && !mongoStructure?.itemPrice?.label.includes(dynamicLabels?.[`${currencySymbol}`])) {
        mongoStructure.itemPrice.label =   mongoStructure.itemPrice.label + ` ( ${dynamicLabels?.[`${currencySymbol}`]} )`
      }
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "itemConfiguration",
        undefined,
        "itemId"
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
        type: "@@itemConfiguration/FETCH_DATA",
        payload,
      });
    };

    setShowDeletionConfirmation(false);

    dispatch({ type: "@@itemConfiguration/SET_LOADING", payload: true });
    try {
      const {
        data: { message, status },
      } = await axios.post(`${apiMappings.itemConfiguration.listView.delete}`,
        [...Object.values(selectedRows).map((row: any) => Number(row.itemId))],
      );
      if (status === 200) {
        toast.add(message, "check-round", false);
        fetchOptions.apis?.resetSelection();
        setSelectedRows({});
        fetchDataSilenty();
        dispatch({
          type: "@@itemConfiguration/SET_LOADING",
          payload: false,
        });
        return;
      }
      throw message;
    } catch (errorMessage) {
      dispatch({
        type: "@@itemConfiguration/SET_LOADING",
        payload: false,
      });
      toast.add(errorMessage?.response?.data?.message || dynamicLabels.somethingWendWrong, "warning", false);
    }
  };

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
                  intent="page"
                  data-tip
                  data-for="tt-user"
                  iconVariant="icomoon-add"
                  id="itemConfiguration--actionbar--add"
                  onClick={() => {
                    sendGA('Item button action', 'Add Item')
                    history.push({ pathname: "/addItem" });
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
                  {`${dynamicLabels.clickHereToAdd} ${dynamicLabels.item_s}`}
                </ReactTooltip>
              </>
            )}



            {pageLabels?.buttons?.upload && (
              <>
                <IconButton
                  intent="page"
                  data-tip
                  data-for="tt-upload"
                  iconVariant='icomoon-upload'
                  id="itemConfiguration--actionbar--upload"
                  onClick={() => {

                    sendGA('Item button action', 'Item List View Upload excel')
                    setShowUploadPopup(true)
                  }}
                >
                  {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.upload}
                </IconButton>
                <ReactTooltip
                  id="tt-upload"
                  type="info"
                  effect="solid"
                  place="bottom"
                >
                  {`${dynamicLabels.clickHereToUploadAListOf} ${dynamicLabels.item_p}`}
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
                      rowIdentifier="itemId"
                      style={{ height: "100%", overflow: "visible" }}
                      columns={columns}
                      data={ItemConfigurationListDataConverted}
                      onFetchData={handleFetchData}
                      hasRowSelectionWithEdit={updateFlag}
                      hasRowSelection={!updateFlag}
                      hasSelectAllRows={true}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      onApply={onApplyColumnPreferences}
                      totalRows={totalRowsSelector}
                      loading={rowsLoading}
                      isColumnLoading={columnsLoading}
                      paginationPageSize={50}
                      onRowEditClick={(row) => {
                        sendGA('Item button action', 'Update Item')
                        history.push({ 'pathname': `updateItem/${row.itemId}` });
                      }}
                      onRowSelect={onRowSelect}
                    >
                      {{

                        IconBar: (
                          <Box display="flex" style={{ position: "relative" }}>

                            <Tooltip
                              message={`${dynamicLabels.download} ${dynamicLabels.item_s} report`}
                              hover
                              messagePlacement="end"
                            >
                              <IconButton
                                key={"tt_DownloadItemConfiguration"}
                                disabled={isDownloadReportDisabled}
                                iconVariant="icomoon-download"
                                iconSize={16}
                                onlyIcon
                                style={{ color: "inherit" }}
                                onClick={handleDownloadReport}
                              />
                            </Tooltip>


                          </Box>
                        ),
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
                                          isButtonDisabled={
                                            !Object.keys(selectedRows).length &&
                                            actionBarButtons[buttonKey].permission
                                          }
                                          buttonToolTipTextList={
                                            buttonKey === "delete"
                                              ? `${dynamicLabels.Delete}`
                                              : `tt_${actionBarButtons[buttonKey].label}`
                                          }
                                        />
                                      );
                                    }
                                  }
                                }
                              )
                            }
                          </Box>
                        )
                      }}
                    </ListView>
                  )}
                </Card>
              </Grid>
            </>
          ) : undefined}
        </StyledGrid>
      </Box>

      {/* ITEM UPLOAD MODAL */}
      <UploadExcel
        isOpen={showUploadPopup}
        featureName='itemConfiguration'
        onSuccess={() => {
          setShowUploadPopup(false);
          handleFetchData(fetchOptions);
        }}
        onClose={() => setShowUploadPopup(false)}
      />

      {/* Download Report */}
      <DownloadMessage
        showInfoModal={showDownloadModal}
        onToggle={setShowDownloadModal}
        />

      {/* Delete Popup */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={handleDelete}
      />

    </>
  );
};
export default ItemConfigurationListView;


