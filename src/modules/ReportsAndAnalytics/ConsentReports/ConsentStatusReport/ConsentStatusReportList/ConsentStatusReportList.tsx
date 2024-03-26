import React, { Dispatch, useEffect, useState } from "react";
import { withReactOptimized } from "../../../../../utils/components/withReact";
import {
  ListGridWrapper,
  StyledGrid,
} from "./ConsentStatusReportList.styleComponent";
import {
  Grid,
  Card,
  ListView,
  IListViewColumn,
  useToast,
  IFetchDataOptions
} from "ui-library";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { IConsentStatusReportListActions } from "./ConsentStatusReportList.actions";
import {   transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import axios from "../../../../../utils/axios";
import { ColumnInstance } from "react-table";
import apiMappings from "../../../../../utils/apiMapping";
import store from "../../../../../utils/redux/store";
import {CONSENT_STATUS_REPORT} from './Cell/ConsentStatusReport.cell.mapping'
import LinkCell from "./Cell/LinkCell";
import GalleryModal from "../SubComponets/GalleryModal";

const ConsentStatusReportList = ({}) => {

  //**Redux Hooks */
  const dispatch = useDispatch<Dispatch<IConsentStatusReportListActions>>();
  const structure = useTypedSelector(
    (state) => state.consentStatusReport.listView.structure
  );
  const loading = useTypedSelector(
    (state) => state.consentStatusReport.listView.loading
  );
  const listdata = useTypedSelector(
    (state) => state.consentStatusReport.listView.data
  );
  const formData = useTypedSelector(
    (state) => state.consentStatusReport.form.formData
  );
  const structureColumns = useTypedSelector(
    (state) => state.consentStatusReport?.listView?.structure?.columns
  ); 
  const pageName = useTypedSelector((state)=>state.consentStatusReport.form.pageName)

  /**General Hooks */
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [isShowGalleryModal, setIsShowGalleryModal] = useState(false)
  const [selectedRow,setSelectedRow] = useState({})
  const [selectedField,setSelectedField] = useState("")

  const toast = useToast()

  useEffect(() => {
    if(listdata?.totalCount == 0 && pageName == 'consentDetailedReport'){
      dispatch({type:'@@consentDetailedReportList/FETCH_STRUCTURE'})
    }
    else{
    dispatch({ type: "@@consentStatusReportList/FETCH_STRUCTURE" });
    }
  }, [listdata?.results]);

  useEffect(()=>{
    return(()=>{
      dispatch({type:'@@consentStatusReportList/RESET_STATE'})
    })
  },[])


  const cellCallbackMapping = {};

  const onClickModalHandler = (row, key) => {
    setSelectedRow(row);
    setSelectedField(key);
    setIsShowGalleryModal(true);
  };

  useEffect(() => {
    if (Object.keys(structureColumns).length > 0) {
      for (let key in structureColumns) {
        if (
          structureColumns[key].fieldType == "esign" ||
          structureColumns[key].fieldType == "epod"
        ) {
          cellCallbackMapping[key] = onClickModalHandler;
          CONSENT_STATUS_REPORT[key] = LinkCell;
        }
      }
    }
  }, [structureColumns]);
  
  useEffect(() => {
    const mongoStructure = structure?.columns;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "consentStatusReport",
        cellCallbackMapping
      );

      setColumns(newColumns);
    }
  }, [structure?.columns]);




  const handleFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      dispatch({
        type: "@@consentStatusReportList/SET_LOADING",
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
        type: "@@consentStatusReportList/FETCH_DATA",
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

  useEffect(()=>{
    Object.keys(fetchOptions).length>0 && handleFetchData(fetchOptions)
  },[formData])

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      Object.keys(structureColumns)?.forEach((columnKey) => {
        structureColumns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns: { ...structureColumns },
      };

      const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "{}")?.clientId;
      const pageName =  store.getState().consentStatusReport.form?.pageName

      const consentDetailedPayload = {
        "clientId":clientId,
        "consentType": formData?.consentType?.consentType,
        "name":formData?.consentName?.name,
        "version": formData?.consentVersion?.version ,
        "customFormStructure": {
          ...structure,
          columns :{...structureColumns}
        }
      }
      

      try {
        const {
          data: { message },
        } = await axios[  pageName =='consentDetailedReport' ? "post":"put"](
           pageName=='consentDetailedReport' ? apiMappings.consentDetailedReport.list.updateStructure:  apiMappings.consentStatusReport.list.structure, 
          pageName =='consentDetailedReport' ? consentDetailedPayload: payload
          );
        message && toast.add(message, "check-round", false);
      } catch (error: any) {
        console.log(error, error?.response);
      }
    },
    [structureColumns]
  );

  return (
    <>
      <ListGridWrapper
        className="list-grid-wrapper"
        container
        spacing={5}
        style={{ marginTop: "20px", width: "100%" }}
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
                rowIdentifier="reportId"
                hasRowSelection={false}
                hasRowSelectionWithEdit={false}
                columns={columns}
                data={listdata?.results}
                totalRows={listdata?.totalCount}
                onSaveColumnPreferences={onSaveColumnPreferences}
                onFetchData={handleFetchData}
                loading={loading?.listView || false}
                isColumnLoading={loading?.columns}
                style={{ height: "90vh" }}
                showFavouriteStar={true}
                hideRefresh={loading?.listView}
              >
                {{}}
              </ListView>
              </Card>
            </Grid>
          </StyledGrid>
        </Grid>
      </ListGridWrapper>
      <GalleryModal
        isShowGalleryModal={isShowGalleryModal}
        setIsShowGalleryModal={setIsShowGalleryModal}
        selectedRow={selectedRow}
        selectedField={selectedField}
      />
    </>
  );
};

export default withReactOptimized(ConsentStatusReportList);
