import React, { Dispatch, useEffect, useState } from "react";
import {
    ListView, Grid, Card, Box, IListViewColumn, IFetchDataOptions, IconButton, Tooltip, BreadCrumb, ISelectedRows, IListViewRow,
    useToast,withToastProvider,withPopup
} from 'ui-library';

import { useDispatch } from 'react-redux'
import apiMappings from "../../../../utils/apiMapping";
import { ColumnInstance } from 'react-table'
import axios from "../../../../utils/axios";

import { ListViewWrapper, NoDataWrapper, StyledGrid } from "../WebhookProfile/subComponents/styledComponents";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { cellCallbackMapping } from "../../../Trips/Mile/TripsListView/components/CallbackFunctions";
import { OauthAction } from "./Oauth.action";
import EmptyData from "../../../../utils/components/EmptyData";
import OauthwebhookProfileForm from "./OauthForm/OauthwebhookProfileForm";
import iconsMapping from "../../../../utils/mongo/ListView/actionBarIcons.mapping";
import DeleteConfirmationModal from "../../../../utils/components/DeleteConfirmationModal";
import withRedux from "../../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../../utils/theme";
import withReact from "../../../../utils/components/withReact";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";



const OauthWebhookProfile = () => {



    const breadCrumbOptions = [
    {
      id: "Webhook Token Configuration",
      label: "Webhook Token Configuration",
      disabled: true,
    },
    ];
    const dispatch = useDispatch<Dispatch<OauthAction>>()
    const [pageType , setPageType] = useState('listView')
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const pageLabels = useTypedSelector((state) => state.pageLabels.webhookTokenConfiguration);
    const isLoading = useTypedSelector(state => state.oAuth.isLoading)
    const islistEmpty = useTypedSelector(state => state.oAuth.islistEmpty)
    const structure = useTypedSelector(state => state.oAuth.structure)
    const columnsSelector = useTypedSelector(state => state.oAuth.structure.columns);
    const rowsSelector = useTypedSelector(state => state.oAuth.data.results)
    const totalRowsSelector = useTypedSelector(state => state.oAuth.data.totalCount)
    const toast = useToast();
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const commonDynamicLabels = useDynamicLabels(
      `${DYNAMIC_LABELS_MAPPING.settings.webhookTokenConfiguration.common}`
    );
    const formDynamicLabels = useDynamicLabels(
      DYNAMIC_LABELS_MAPPING.settings.webhookTokenConfiguration.form
    );


    useEffect(() => {
        console.log('list view ')
        dispatch({ type: '@@OAUTH/FETCH_STRUCTURE' });
       
    }, [])

    useEffect(()=>{
        if(pageType === "listView"){
          handleFetchData(fetchOptions)
        }
    },[pageType])

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'oAuhtProfile', cellCallbackMapping, 'webhookProfileId')
            setColumns(newColumns);

        }

    }, [columnsSelector])


    const handleFetchData = React.useCallback(
        ({
            pageSize,
            pageNumber,
            sortOptions,
            filterOptions,
            apis
        }: IFetchDataOptions) => {

            setFetchOptions({
                pageSize,
                pageNumber,
                sortOptions,
                filterOptions,
                apis,
              });
            // API call for fetching data.
            dispatch({
                type: "@@OAUTH/FETCH_DATA",
                payload: {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder,
                },
            });


        },[]);

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.OauthProfile.listView.structure, payload)

        } catch (error) {
            console.log("broke")
        }


    }, [columnsSelector])

    const onAddClick = () => {
        setPageType('Form')
    }

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({ type: '@@OAUTH/GET_UPDATE_DATA' , payload: row});
        dispatch({type:'@@OAUTH/SET_FORM_EDITABLE',payload: true})
        setPageType('Form');
    }, []);

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
      }, []);

    
  const deleteSelectedRows = async (id?: number) => {
    const referenceId = Object.values(selectedRows).map((row)=> row?.referenceId)
    setShowDeletionConfirmation(false);
    try {
    //   const payload = !isNaN(id as number) ? [id] : Object.keys(selectedRows).map((key) => Number(key));
  
      const { data: data } = await axios.put(
        apiMappings.OauthProfile.listView.deleteRequest + '?referenceId=' + referenceId[0],
      );

      if (data.status === 200) {
        const message = commonDynamicLabels['delete.webhook.token.config.success'] ? commonDynamicLabels['delete.webhook.token.config.success'] : data?.message
        toast.add(message, "check-round", false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw toast.add(commonDynamicLabels[`${data?.message}`], "warning", false);
    } catch (error: any) {
      console.log(error?.response?.data?.message,'errorMessage')
      const message = commonDynamicLabels['token.mapped.with.webhook.profile'] ? commonDynamicLabels['token.mapped.with.webhook.profile']   : error?.response?.data?.message
      toast.add(message, "warning", false);
    }
  };

    return (
      <>
        <div id="toast-inject-here"></div>
        {pageType === "Form" ? (
          <OauthwebhookProfileForm
            setPageType={setPageType}
            commonDynamicLabels={commonDynamicLabels}
            formDynamicLabels={formDynamicLabels}
            
          ></OauthwebhookProfileForm>
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              style={{ width: "100%" }}
              py="15px"
            >
              {/* Page Action Buttons */}
              <BreadCrumb options={breadCrumbOptions} />
              {pageLabels?.buttons?.add && (
                <Tooltip
                  tooltipDirection="bottom"
                  arrowPlacement="center"
                  messagePlacement="end"
                  message={"Click here to add Webhook Token"}
                  hover={true}
                >
                  <IconButton
                    id="Oauth--actionbar--add"
                    intent="page"
                    iconVariant="icomoon-add"
                    onClick={() => onAddClick()}
                  >
                    {"add"}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              style={{
                width: "100%",
                height: "calc(100vh - 130px)",
                backgroundColor: "#fff",
                boxShadow:
                  "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
              }}
            >
              {islistEmpty ? (
                <NoDataWrapper>
                  <div>
                    <EmptyData
                      message={
                        "No Webhook Token Configuration added yet. Click on the button below to add new Weebhook Profile."
                      }
                      imgSrc="images/group.png"
                    />
                    <Box display="flex" justifyContent="center" fullWidth>
                      <Tooltip message={"asd"} hover={true}>
                        <IconButton
                          primary
                          iconVariant="icomoon-add"
                          id={"listView--actionbar--add"}
                          onClick={()=>setPageType("Form")}
                        >
                          <span style={{ fontSize: "13px" }}>"Add Webhook Token Configuration "</span>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </div>
                </NoDataWrapper>
              ) : (
                <StyledGrid
                  container
                  spacing={5}
                  style={{ flexGrow: 1, overflow: "hidden", width: "100%" }}
                  className="styled-grid"
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
                      {  columns.length > 0 && (
                        <ListViewWrapper className="WebhookListViewWrapper list-view-wrapper">
                          <ListView
                            rowIdentifier="tokenName"
                            style={{ height: "100%", overflow: "visible" }}
                            columns={columns}
                            data={rowsSelector}
                            onFetchData={handleFetchData}
                            onSaveColumnPreferences={onSaveColumnPreferences}
                            hideColumnSettings={false}
                            totalRows={totalRowsSelector}
                            loading={isLoading}
                            isColumnLoading={false}
                            hasRowSelection= {structure?.buttons?.update  ? false : true} 
                            hasRowSelectionWithEdit={ structure?.buttons?.update ? true : false}
                            onRowSelect={onRowSelect}
                            onRowEditClick={onRowEditClick}
                          >
                            {{
                              ActionBar: (
                                <>
                                  <Box display="flex" horizontalSpacing="10px">
                                    {structure.buttons &&
                                      Object.keys(structure.buttons).map(
                                        (buttonKey, index) =>
                                          structure.buttons[buttonKey]
                                            .permission &&
                                          buttonKey === "delete" && (
                                            <Tooltip
                                              key={buttonKey}
                                              message={`Click here to ${structure?.buttons[buttonKey].labelKey} the selected Webhook Token(s).`}
                                              hover
                                              messagePlacement={
                                                index === 0 ? "start" : "center"
                                              }
                                            >
                                              <IconButton
                                                key={buttonKey}
                                                disabled={
                                                  !Object.keys(selectedRows).length  || Object.keys(selectedRows).length >1
                                                }
                                                intent="table"
                                                iconVariant={
                                                  iconsMapping[buttonKey]
                                                }
                                                id={`Oauth-actionBar-${buttonKey}`}
                                                onClick={() => {
                                                  setShowDeletionConfirmation(
                                                    true
                                                  );
                                                }}
                                              >
                                                {
                                                  structure.buttons[buttonKey]
                                                    .label
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          )
                                      )}
                                  </Box>
                                </>
                              ),
                            }}
                          </ListView>
                        </ListViewWrapper>
                      )}
                    </Card>
                  </Grid>
                </StyledGrid>
              )}
            </Box>
          </>
        )}
         <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) =>
          setShowDeletionConfirmation(value)
        }
        deleteSelectedRows={deleteSelectedRows}
      />
      </>
    );
}

export default withReact(OauthWebhookProfile)

// export default withThemeProvider(
//   withToastProvider(
//     withRedux(withPopup(OauthWebhookProfile)),
//     "toast-inject-here"
//   )
// );