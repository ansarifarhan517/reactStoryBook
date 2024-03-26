import React, { useEffect, useState, useCallback } from "react";
import { SortingRule, ColumnInstance } from "react-table";

import {
  ListView,
  useToast,
  IFetchDataOptions,
  ISelectedRows,
  IFilterOptions,
  ISortOptions,
  IListViewColumn,
  Box,
} from "ui-library";

import { getQueryParams } from "../../../../../utils/hybridRouting";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { IMongoColumnOnlyStructure, IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { removeListViewTooltip } from "../../../../../utils/redux/fixTooltipIssue";

import AllAddressesMap from "./components/all-addresses-map";
import { ngStateRouterOptions, dummyResult, dummyColumns } from "./utils";
import {
  BodyCardContainer,
  BodyGrid,
  BodyGridItem,
} from "../../pages/list-view/style";
import {
  fetchAssingedOrderStructure,
  fetchListViewData,
  fetchListViewStructure,
  putListViewStructure,
} from "./api";

import "./style.css";


const AddressMap = ({ dynamicLabels, ngStateRouter, setIsUpdateForm, setUpdateRowData, currentPage }) => {
  const toast = useToast();

  // Redux state
  const [structure, setStructure] = useState<IMongoListViewStructure>({
    buttons: {},
    columns: dummyColumns,
  });
  const [assignedOrderStructure, setAssignedOrderStructure] = useState<IMongoColumnOnlyStructure>({ columns: {}});

  const [loading, setLoading] = useState({
    data: true,
    structure: true,
  });

  const [listViewResponse, setListViewResponse] = useState({
    results: dummyResult,
    totalCount: -1,
  });

  const structureColumns = structure?.columns;

  const listViewData = listViewResponse?.results;
  const rowCount = listViewResponse?.totalCount;

  const isStructureLoading = loading?.structure;
  const isDataLoading = loading?.data;

  // Local states
  const [listColumns, setListColumns] = useState<IListViewColumn[]>([]); // columns, setColumns
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortingRule<object>[]>();

  // Local Values

  useEffect(() => {
    (async () => {
      const response = await fetchListViewStructure();
      setStructure({ ...response });
      setLoading((prevState) => {
        return { ...prevState, structure: false };
      });
    })();

    (async () => {
      const response = await fetchAssingedOrderStructure();
      setAssignedOrderStructure({...response})
      setLoading((prevState) => {
        return { ...prevState, structure: false };
      });
    })();

    handleQueryParams();
  }, []);

  const onAddressClick = (rowData) => {
    setIsUpdateForm(true);
    setUpdateRowData(rowData);
    removeListViewTooltip();
  }

  const cellCallbackMapping = {
    address: onAddressClick,
  };

  useEffect(() => {
    const mongoStructure = structureColumns;
    if (Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "all_addresses_map",
        cellCallbackMapping
      );
      setListColumns(newColumns);
    }
  }, [structureColumns]);

  // List view callbacks
  const handleFetchData = useCallback(
    async ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis
    }: IFetchDataOptions) => {

      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
      };

      setLoading((prevState) => {
        return { ...prevState, data: true };
      });
      const response = await fetchListViewData(payload);
      const selection = { [response.results?.[0]?.clientNodeId]: response.results?.[0] };

      setSelectedRows(selection)
      apis?.setSelection(selection);
      setListViewResponse(response);
      setLoading((prevState) => {
        return { ...prevState, data: false };
      });
    },
    []
  );

  const onRowSelect = useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  //  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    let existingParams = getQueryParams();

    /** Do not push to history when there is no change. */
    if (
      (!combinedFilters.searchBy && !existingParams.searchBy) ||
      (combinedFilters.searchBy === existingParams.searchBy &&
        combinedFilters.searchText === existingParams.searchText)
    ) {
      return;
    }

    const newParams = {
      ...(existingParams.sortBy
        ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder }
        : {}),
      ...(combinedFilters.searchBy
        ? {
            searchBy: combinedFilters.searchBy,
            searchText: combinedFilters.searchText,
          }
        : {}),
    };

    setTimeout(() => {
      ngStateRouter.go("addressMap", newParams, ngStateRouterOptions);
    }, 2000);
  };

  // /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams();

    /** Do not push to history when there is no change. */
    if (
      (!sortOptions.sortBy && !existingParams.sortBy) ||
      (sortOptions.sortBy === existingParams.sortBy &&
        sortOptions.sortOrder === existingParams.sortOrder)
    ) {
      return;
    }

    /** Construct new set of Query Params */
    const newParams = {
      ...(sortOptions.sortBy
        ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder }
        : {}),
      ...(existingParams.searchBy
        ? {
            searchBy: existingParams.searchBy,
            searchText: existingParams.searchText,
          }
        : {}),
    };

    setTimeout(() => {
      ngStateRouter.go("addressMap", newParams, ngStateRouterOptions);
    }, 2000);
  };

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      Object.keys(structureColumns)?.forEach((columnKey) => {
        structureColumns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns: { ...structureColumns },
      };

      const responseMessage = await putListViewStructure(payload);
      responseMessage && toast.add(responseMessage, "check-round", false);
    },
    [structureColumns]
  );

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();

    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split("#@#");
    let sortOrder = filterData?.sortOrder?.split("#@#");

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === "DESC",
      };
      sort.push(temp);
    });
    sort && setSort(sort);

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split("#@#");
    let searchText = filterData?.searchText?.split("#@#");

    let temp: Record<string, string> = {};
    searchBy &&
      searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index];
      });

    setFilters(temp);
  };

  return (
    <div className="all-addresses-map-view">
      {/* <Card className="all-addresses-map-view__list"> */}
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: "40%", height: "80vh" }}
      >
        <BodyGrid container spacing={5}>
          <BodyGridItem item md={12} className="grid-customised-scroll-bar">
            <BodyCardContainer className="all-address__map-list-view">
              {listColumns?.length > 0 && (
                <ListView
                  rowIdentifier="clientNodeId"
                  style={{
                    height: "100%",
                    overflow: "visible",
                  }}
                  columns={listColumns}
                  data={listViewData}
                  onFetchData={handleFetchData}
                  hasRowSelection
                  onRowSelect={onRowSelect}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  totalRows={rowCount}
                  hideRefresh={isDataLoading || isStructureLoading}
                  permanentColumns={{
                    code: true,
                    isActiveFl: true,
                    name: true,
                  }} // count of this matters, user cannot have less than 5 columns at a time.
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sorts={sort}
                  onSortChange={handleSortChange}
                  isColumnLoading={isStructureLoading}
                  loading={isDataLoading || isStructureLoading}
                  hasRadioSelection
                  hasSelectAllRows={false}
                />
              )}
            </BodyCardContainer>
          </BodyGridItem>
        </BodyGrid>
      </Box>
      <div className="all-addresses-map-view__map">
        <AllAddressesMap
          key={Object.keys(selectedRows)?.[0]}
          selectedRows={selectedRows || {}}
          dynamicLabels={dynamicLabels} 
          modalColumns={assignedOrderStructure.columns}
          currentPage={currentPage}   
        />
      </div>
    </div>
  );
};

export default AddressMap;
