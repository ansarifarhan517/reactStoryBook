import React, { Dispatch, useEffect, useState } from 'react';
import {
  withPopup,
  withToastProvider,
  IFetchDataOptions,
  IListViewRow,
  IListViewColumn,
  useToast,
  ISelectedRows,
  IFilterOptions,
  ISortOptions,
  Box,
  BreadCrumb,
  Grid,
  Card,
  ListView,
  IconButton,
  Modal,
  ModalHeader,
  Tooltip,
} from 'ui-library';
import { withThemeProvider } from '../../../utils/theme';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
// import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { SortingRule, ColumnInstance } from 'react-table';
import { IStateService } from 'angular-ui-router';
import { getQueryParams } from '../../../utils/hybridRouting';
import { AlertMessageActions } from './AlertMessage.actions';
import { sendGA } from '../../../utils/ga';
import { useDispatch } from 'react-redux';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import {
  AddBrandProfileButtonWrapper
} from './AlertMessageStyledComponents';
import {StyledGrid} from "../../../utils/components/Grid/GridStyledComponents";
import withRedux from '../../../utils/redux/withRedux';
import AlertMessageForm from './AlertMessageForm';
import {AlertMessageStyledContainer} from "./AlertMessageStyledContainer";

interface IAlertMessageProps {
  ngStateRouter: IStateService;
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = {
  notify: false,
  reload: false,
  inherit: false,
  location: true,
};

const AlertMessage = ({ ngStateRouter }: IAlertMessageProps) => {
  const dispatch = useDispatch<Dispatch<AlertMessageActions>>();
  const pageLabels = useTypedSelector(
    (state) => state.pageLabels.customizeEmailTemplates
  );
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alertMessageTemplate);
  const structure = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.structure
  );
  const columnsSelector = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.structure.columns
  );
  const rowCount = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.data.totalCount
  );
  const rowsSelector = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.data.results
  );
  const loading = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.loading.listView
  );
  const columnsLoading = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.loading.columns
  );

  const defaultTemplates = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.defaultTemplates
  );
  const isEditAlertMessage = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.isEditAlertMessage
  );
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [filters, setFilters] = useState<Record<string, string>>();
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [pageType, setPageType] = useState<string>('list');
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [
    alertMessageActivationRequest,
    setAlertMessageActivationRequest,
  ] = useState<{
    isActive: boolean;
    emailTemplateId: number;
    failureCallback?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  }>();

  const toast = useToast();

  const breadCrumbOptions = React.useMemo(() => {
    if (pageType === 'list') {
      return [
        {
          id: 'alertMessage',
          label: dynamicLabels.CUSTOMIZE_EMAIL_TEMPLATES,
          disabled: true,
        },
      ];
    } else {
      return [
        {
          id: 'alertMessage',
          label: dynamicLabels.CUSTOMIZE_EMAIL_TEMPLATES,
          disabled: false,
        },
        {
          id: 'alertMessageAddTemplate',
          label: !!isEditAlertMessage ? dynamicLabels.editEmailTemplate : dynamicLabels.addEmailTemplate,
          disabled: true,
        },
      ];
    }
  }, [dynamicLabels, pageType]);

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();
    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split('#@#');
    let sortOrder = filterData?.sortOrder?.split('#@#');

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === 'DESC',
      };
      sort.push(temp);
    });
    sort && setSort(sort);

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {};
    searchBy &&
      searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index];
      });
    setFilters(temp);
  };

  useEffect(() => {
    handleQueryParams();
    dispatch({
      type: '@@alertMessage/SET_COLUMNS_LOADING',
      payload: { columns: true },
    });
    dispatch({ type: '@@alertMessage/FETCH_LISTVIEW_STRUCTURE' });
  }, []);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        'alertMessage',
        cellCallbackMapping
      );
      setColumns(newColumns);
    }
  }, [columnsSelector]);

  useEffect(() => {
    if (!!defaultTemplates) {
      dispatch({
        type: '@@alertMessage/SET_DEFAULT_SELECTED_TEMPLATE',
        payload: defaultTemplates[0],
      });
    }
  }, [defaultTemplates]);

  const handleActiveFlChange = (
    isActive: boolean,
    emailTemplateId: number,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setAlertMessageActivationRequest({
      isActive,
      emailTemplateId,
      failureCallback,
    });
  };

  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange,
  };

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
    console.log(selectedRows);
  }, []);

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      sendGA('Column Preference Action' ,`Alert Message Template List View -  Save & Apply column`)

      const columns = { ...columnsSelector };
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
          apiMappings.alertMessage.listView.structure,
          payload
        );
        message && toast.add(message, 'check-round', false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );

  const handleFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      dispatch({
        type: '@@alertMessage/SET_LOADING',
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
        type: '@@alertMessage/FETCH_ALERT_TEMPLATE_LIST',
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

  /********  FILTER CHANGE **************/
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
      ngStateRouter.go('manifest', newParams, ngStateRouterOptions);
    }, 100);
  };

  /********  SORT  CHANGE **************/
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
      ngStateRouter.go('manifest', newParams, ngStateRouterOptions);
    }, 100);
  };

  const onRowEditClick = React.useCallback((row: IListViewRow) => {
    console.log('row------>', row);
    dispatch({
      type: '@@alertMessage/FETCH_TEMPLATE_BY_ID',
      payload: {
        emailTemplateId: row.emailTemplateId,
      },
    });
    dispatch({
      type: '@@alertMessage/SET_DATA',
      payload: {
        key: 'isEditAlertMessage',
        value: row,
      },
    });
    dispatch({
      type: '@@alertMessage/SET_UPDATE',
      payload: true,
    });
    setPageType('form');
  }, []);

  const handleAddAlertMessage = () => {
    sendGA('Navigation' ,`Alert Message Template List View -  Add button`)
    setPageType('form');
  };

  const onCancel = () => {
    setPageType('list');
  };

  const handleAlertMessageActivation = async () => {
    if (!alertMessageActivationRequest) {
      return;
    }
    setAlertMessageActivationRequest(undefined);

    if (alertMessageActivationRequest.emailTemplateId) {
      try {
        const {
          data: { message, status },
        } = await axios.put(
          apiMappings.alertMessage.listView.activationRequest +
            `?emailTemplateId=${Number(
              alertMessageActivationRequest.emailTemplateId
            )}&isActive=${alertMessageActivationRequest.isActive}`
        );
        if (status === 200) {
          toast.add(message, 'check-round', false);
          handleFetchData(fetchOptions);
          setSelectedRows({});
          fetchOptions.apis?.resetSelection();
          return;
        }
        throw message;
      } catch (errorMessage) {
        alertMessageActivationRequest.failureCallback &&
          alertMessageActivationRequest.failureCallback(
            !alertMessageActivationRequest.isActive
          );
        toast.add(
          typeof errorMessage === 'string'
            ? errorMessage
            : dynamicLabels.somethingWendWrong,
          '',
          false
        );
      }
    }
  };

  return (
    <>
    <AlertMessageStyledContainer className="alert-message-container">
      <div id='toast-inject-here'></div>
      {/* Header */}
      <Box
        display='flex'
        justifyContent={pageType === "list" ? "space-between" : "flex-start"}
        fullWidth
        p='15px'
      >
          <BreadCrumb
            onClick={() => {
              dispatch({
                type: '@@alertMessage/SET_DATA',
                payload: {
                  key: 'isEditAlertMessage',
                  value: undefined,
                },
              });
              dispatch({ type: '@@alertMessage/RESET_SELECTED_TEMPLATE'});
              
              setPageType('list')}}
            options={breadCrumbOptions}
          />
        {/* Page Action Buttons */}

        {pageType === "list" &&        
        pageLabels?.buttons.add && (
          <AddBrandProfileButtonWrapper>
            <Tooltip
              message={`Click here to add ${dynamicLabels.alertTemplate}`}
              hover
              tooltipDirection='left'
            >
              <IconButton
                intent='page'
                data-tip
                data-for='add_alert_cm'
                iconVariant='icomoon-add'
                onClick={handleAddAlertMessage}
              >
                {dynamicLabels.add}
              </IconButton>
            </Tooltip>
          </AddBrandProfileButtonWrapper>
        )}
      </Box>
      {pageType === 'list' ? (
        <Box
          display='flex'
          flexDirection='column'
          style={{ width: '100%', height: '100%' }}
          px='15px'
          pb='15px'
        >
          {/* LIST VIEW CONTAINER */}
          <Grid
            container
            spacing={5}
            style={{
              flexGrow: 1,
              overflow: 'hidden',
              width: '100%',
              boxShadow: '0 2px 20px -10px #000',
            }}
          >
            <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
              <StyledGrid
                container
                spacing={15}
                style={{ boxShadow: '0 2px 20px -10px #000' }}
              >
                <Card
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    width: '100%',
                    paddingRight: 0,
                    paddingBottom: 0,
                  }}
                >
                  {columns.length > 0 && filters && (
                    <ListView
                      rowIdentifier='emailTemplateId'
                      hasRowSelectionWithEdit={true}
                      columns={columns}
                      data={rowsSelector}
                      // hasSelectAllRows={false}
                      totalRows={rowCount}
                      onFetchData={handleFetchData}
                      onRowSelect={onRowSelect}
                      loading={loading || false}
                      hideRefresh={loading}
                      isColumnLoading={columnsLoading}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      onRowEditClick={onRowEditClick}
                      style={{ height: '90vh', width: '99%' }}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      sorts={sort}
                      onSortChange={handleSortChange}
                    />
                  )}
                </Card>
              </StyledGrid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <AlertMessageForm onFormCancel={onCancel} />
      )}
      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal
        open={!!alertMessageActivationRequest}
        onToggle={() => {}}
        size='md'
      >
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                alertMessageActivationRequest?.failureCallback &&
                  alertMessageActivationRequest?.failureCallback(
                    !alertMessageActivationRequest.isActive
                  );
                setAlertMessageActivationRequest(undefined);
              }}
            />
          ),

          content: (
            <>
              <div style={{ fontSize: '14px' }}>
                {alertMessageActivationRequest?.isActive
                  ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                  : dynamicLabels.areYouSureYouWantToMarkAsInactive}
              </div>
            </>
          ),
          footer: (
            <Box
              horizontalSpacing='10px'
              display='flex'
              justifyContent='flex-end'
              p='15px'
            >
              <IconButton
                id={`CustomizeEmailTemplate--Modal--${alertMessageActivationRequest?.isActive
                  ? 'MarkAsActive'
                  : 'MarkAsInActive'}`}
                iconVariant='icomoon-tick-circled'
                primary
                onClick={handleAlertMessageActivation}
              >
                {dynamicLabels.ok}
              </IconButton>
              <IconButton
                id="CustomizeEmailTemplate--Modal--Cancel"
                iconVariant='icomoon-close'
                iconSize={11}
                onClick={() => {
                  alertMessageActivationRequest?.failureCallback &&
                    alertMessageActivationRequest?.failureCallback(
                      !alertMessageActivationRequest.isActive
                    );
                  setAlertMessageActivationRequest(undefined);
                }}
              >
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
      </AlertMessageStyledContainer>
    </>
  );
};

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(AlertMessage)), 'toast-inject-here')
);
