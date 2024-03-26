import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { BranchConfigurationActions } from '../BranchConfiguration.actions';
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView';
import { ColumnInstance } from 'react-table';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { ListView, IListViewColumn, ISelectedRows, IListViewRow, useToast, IFetchDataOptions, Button, Box, Tooltip } from 'ui-library';
import { BranchConfigurationListViewWrapper } from '../BranchConfigurationStyledComponents';
import { hybridRouteTo } from '../../../../utils/hybridRouting';
import DownloadListBranchModal from '../SubComponents/DownloadListBranchModal';
import BranchConfigurationListViewModals from "../SubComponents/ListView/BranchConfigurationListViewModals";
import { PRODUCT_TYPE } from '../../../../utils/constants';

interface IBranchProps {
  clientBranchId: number;
}

const BranchConfigurationListView = ({onEditRow = () => {}}) => {
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [isOpertaionTimingModalVisible, setOperationTimingModalVisible] = useState<boolean>(false);
  const [isLoadMultiplierModalVisible, setLoadMultiplierModalVisible] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string>('1');
  const [isManagerListModalVisible, setManagerListModalVisible] = useState<boolean>(false);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);
  

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : '');
  };

  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const toast = useToast();

  const columnsSelector = useTypedSelector((state) => state.branchConfiguration.structure.columns);
  const buttonSelector = useTypedSelector((state) => state.branchConfiguration.structure.buttons);
  const rowSelector = useTypedSelector((state) => state.branchConfiguration.data.results);
  const totalRowCount = useTypedSelector((state) => state.branchConfiguration.data.totalCount);
  const structure = useTypedSelector((state) => state.branchConfiguration.structure);
  const branchManagerRowSelector = useTypedSelector((state) => state.branchConfiguration.branchManagers);
  const branchListLoading = useTypedSelector((state) => state.branchConfiguration.listview.branchList);


  const handleOperationTimingClick = ({ clientBranchId }: IBranchProps) => {
    dispatch({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA', payload: { clientBranchId: clientBranchId } });
    setSelectedBranch(clientBranchId);
    setOperationTimingModalVisible(true);
  };

  const handleLoadMultiplierClick = ({ clientBranchId }: IBranchProps) => {
    dispatch({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA', payload: { clientBranchId: clientBranchId } });
    setSelectedBranch(clientBranchId);
    setLoadMultiplierModalVisible(true);
  };

  const handleManagerCountClick = ({ clientBranchId }: IBranchProps) => {
    dispatch({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA', payload: { clientBranchId: clientBranchId } });
    setManagerListModalVisible(true);
    setSelectedBranch(clientBranchId);
    dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST', payload: clientBranchId});
    setExpanded(String(branchManagerRowSelector.length))
  };

  useEffect(() => {
    dispatch({ type: '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE' });
    PRODUCT_TYPE !== 'haul' && dispatch({ type: '@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST' });
    dispatch({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_LOAD_MULTIPLIER_LISTVIEW_STRUCTURE' });
  }, []);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure,'branchConfiguration',cellCallbackMapping,'clientBranchId');
      setColumns(newColumns);
    }
  }, [columnsSelector]);

  const cellCallbackMapping = {
    operationTimings: handleOperationTimingClick,
    managersCount: handleManagerCountClick,
    loadMultipliers: handleLoadMultiplierClick
  };

  const onRowEditClick = React.useCallback((row: IListViewRow) => {
    dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: row }});
    dispatch({type: '@@branchConfiguration/SET_PREVIOUS_VIEW_TYPE', payload: 'list-view' });
    onEditRow()
  }, []);

  const onRowSelect = React.useCallback((selectedRow: ISelectedRows) => {
    setSelectedRows(selectedRow);
  }, []);

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => { columns[columnKey].permission = !!visibleColumns[columnKey]; });
      const payload = { ...structure, columns };
      try {
        const { data: { message } } = await axios.put(apiMappings.branchConfiguration.listView.structure, payload);
        message && toast.add(message, 'check-round', false);
      } catch (error: any) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );

  const handleFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });
      dispatch({ type: '@@branchConfiguration/SET_FETCH_OPTIONS', payload: { pageSize, pageNumber, sortOptions, filterOptions, apis } })
      dispatch({
        type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST',
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

  const handleBranchActivation = async (selectedBranches: ISelectedRows) => {
    let branchList: Array<number> = [];
    Object.values(selectedBranches).forEach((branch) => {
      return (branchList = [...branchList, branch.clientBranchId]);
    });

    try {
      const { data: { data, message } } = await axios.post(apiMappings.branchConfiguration.listView.activateBranch, branchList);
      if (data) {
        toast.add(message, 'check-round', false);
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        return;
      }
      throw message;
    } catch (errorMessage) {
      toast.add( typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
    }
  };

  const handleBranchDeactivation = async (selectedBranches: ISelectedRows) => {
    hybridRouteTo(`clientBranchActivation/clientBranchActivationOrders?branchId=${Object.keys(selectedBranches)[0]}`);
  };

  const buttonAccess = Object.values(selectedRows)[0];

  return (
    <>
      {columns.length > 0 ? (
        <BranchConfigurationListViewWrapper>
        <ListView
          rowIdentifier='clientBranchId'
          hasRowSelectionWithEdit={true}
          columns={columns}
          data={rowSelector}
          hideRefresh={branchListLoading}
          totalRows={totalRowCount}
          onFetchData={handleFetchData}
          onRowSelect={onRowSelect}
          loading={branchListLoading}
          isColumnLoading={branchListLoading}
          onSaveColumnPreferences={onSaveColumnPreferences}
          onRowEditClick={onRowEditClick}
          hasSelectAllRows={false}
          style={{ height: '100%', width: '99%' }}
        >
          {{
            IconBar: 
            <DownloadListBranchModal />,
            ActionBar: (
              <Box display='flex' pt='5px'>
                {buttonSelector?.activateBranch && (
                <Tooltip
                 hover 
                 message={buttonSelector?.activateBranch.label}>
                   <Button style={{lineHeight: "30px"}} disabled={(Object.values(selectedRows).length > 1 || (Object.values(selectedRows).length === 1 && !buttonAccess.isActiveFl)) ? false : true }  onClick={() => handleBranchActivation(selectedRows)}>
                        {buttonSelector?.activateBranch.label}
                    </Button>
                  </Tooltip>)}
                {buttonSelector?.deactivateBranch && (
                  <Tooltip
                  hover
                  message={buttonSelector?.deactivateBranch.label}>
                 <Button style={{lineHeight:"30px"}}  disabled={Object.values(selectedRows).length === 1  && buttonAccess.isActiveFl ? false : true} onClick={() => handleBranchDeactivation(selectedRows)}>
                     {buttonSelector?.deactivateBranch.label}
                   </Button>
                </Tooltip>)}
              </Box>),}}
        </ListView>
        </BranchConfigurationListViewWrapper>
      ) : null}
      <BranchConfigurationListViewModals
        isOpertaionTimingModalVisible={isOpertaionTimingModalVisible}
        setOperationTimingModalVisible={setOperationTimingModalVisible}
        isManagerListModalVisible={isManagerListModalVisible}
        isLoadMultiplierModalVisible={isLoadMultiplierModalVisible}
        setLoadMultiplierModalVisible={setLoadMultiplierModalVisible}
        setManagerListModalVisible={setManagerListModalVisible}
        expanded={expanded}
        setExpanded={setExpanded}
        selectedBranch={selectedBranch}
        handleToggle={handleToggle}
        
      />
    </>
  );
};

export default BranchConfigurationListView;