import React, { Dispatch, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnInstance } from 'react-table'
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { DeviationReportsActions } from '../DeviationReports.actions';
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView';
import { ListView, IListViewColumn, Card, Grid, useToast } from 'ui-library';
import { StyledGrid } from '../../../AlertsHistory/AlertsHistoryStyledComponents';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import { DEVIATION_REPORTS_MAPPING, ReportType } from '../DeviationReports.models';

const ReportsListViewComponent = () => {
  const [reportColumns, setReportColumns] = useState<IListViewColumn[]>([]);
  const dispatch = useDispatch<Dispatch<DeviationReportsActions>>();

  const toast = useToast();

  const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
  const structure = useTypedSelector((state) => state.deviationReports.listView.structure);
  const results = useTypedSelector((state) => state.deviationReports.listView.data.results);
  const totalCount = useTypedSelector((state) => state.deviationReports.listView.data.totalCount);
  const loading = useTypedSelector((state) => state.deviationReports.listView.loading);
  const columnSelectors = useTypedSelector((state) => state.deviationReports.listView.structure.columns);
  const filters = useTypedSelector((state) => state.deviationReports.form.filters);
  const reportType = useTypedSelector((state) => state.deviationReports.form.reportType);
  
  const handleFetchListViewData = useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
      dispatch({
        type: '@@deviationReports/FETCH_LISTVIEW_DATA',
        payload: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder
        },
      });
    }, [filters]);

  const onSaveColumnPreferences = useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columns = { ...columnSelectors }
    Object.keys(columns).forEach((columnKey) => { columns[columnKey].permission = !!visibleColumns[columnKey] })
    const payload = { ...structure, columns };
    try {
      let structureAPI = apiMappings.deviationReports.list.structure;
      structureAPI = structureAPI.replaceAll("${pageName}", DEVIATION_REPORTS_MAPPING[reportType as ReportType].pageName)
                                 .replace("${sectionName}", DEVIATION_REPORTS_MAPPING[reportType as ReportType].sectionName);
      const { data: { message } } = await axios.put(structureAPI, payload);
      message && toast.add(message, 'check-round', false);
    } catch (error: any) {
      toast.add(typeof error === "string" ? error : dynamicLabels?.somethingWendWrong, "", false);
    }
  }, [columnSelectors]);

  useEffect(() => {
    const mongoStructure = columnSelectors;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, DEVIATION_REPORTS_MAPPING[reportType as ReportType].cellMappingKey, {});
      setReportColumns(newColumns);
    }
  }, [columnSelectors]);

  return (
    <>
      {reportColumns.length > 0 ? (
          <Grid item md={12} style={{ display: "flex", overflow: "hidden" }}>
            <StyledGrid container spacing={15} style={{ boxShadow: "0 2px 20px -10px #000" }}>
              <Grid item className="grid-customised-scroll-bar" style={{ display: "flex", overflow: "hidden" }}>
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
                    rowIdentifier=''
                    columns={reportColumns}
                    data={results}
                    totalRows={totalCount}
                    onFetchData={handleFetchListViewData}
                    onSaveColumnPreferences={onSaveColumnPreferences}
                    loading={loading}
                    isColumnLoading={loading}
                    hasRowSelection={false}
                    hasRowSelectionWithEdit={false}
                    hasSelectAllRows={false}
                    hideRefresh={loading}
                    style={{ height: '65vh', width: '100%' }}
                  />
                </Card>
              </Grid>
            </StyledGrid>
          </Grid>
      ) : null}
    </>
  );
};

export default memo(ReportsListViewComponent);