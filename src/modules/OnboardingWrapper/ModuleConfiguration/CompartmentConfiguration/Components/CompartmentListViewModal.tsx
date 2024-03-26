import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { CompartmentConfigurationActions } from '../CompartmentConfiguration.actions';
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { ListView, IListViewColumn, Box, Modal, ModalHeader, IconButton} from 'ui-library';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';

export interface ICompartmentListViewModalsProps {
  isCompartmentListModalVisible: boolean;
  setCompartmentListModalVisible: Function;
  selectedRow?: any;
  moduleName: string
}


const CompartmentListViewModal = (props: ICompartmentListViewModalsProps) => {
  const {isCompartmentListModalVisible, setCompartmentListModalVisible,selectedRow,moduleName } = props;
  const [operationTimingsColumns, setOperationTimingsColumns] = useState<IListViewColumn[]>([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const dispatch = useDispatch<Dispatch<CompartmentConfigurationActions>>();

  const compartmentColumnSelector = moduleName === 'FLEET_TYPE' ? useTypedSelector((state) => state.fleet.listView.compartmentListStructure?.columns) : 
                                    moduleName === 'DELIVERY_MEDIUM' ? useTypedSelector((state) => state.deliveryMedium.listView.compartmentListStructure?.columns) :
                                    useTypedSelector((state) => state.vehicle.listView.compartmentListStructure?.columns);
  const compartmentRowSelector = useTypedSelector((state) => state.compartmentConfiguration.comparmentPopupListData.results);
  const compartmentListLoading = useTypedSelector((state) => state.compartmentConfiguration.comparmentPopupListData.listLoading);
  
  const handleCompartmentListFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
      dispatch({ type: '@@compartmentConfiguration/FETCH_CLIENT_METRIC_SYSTEM'})
      dispatch({
          type: '@@compartmentConfiguration/FETCH_COMPARTMENT_DATA',
          payload: {
              moduleName: moduleName === 'FLEET_TYPE' ? moduleName : moduleName === 'VEHICLE' ? (selectedRow.fleetTypeId ? 'FLEET_TYPE' : moduleName) : selectedRow.fleetTypeId ? 'FLEET_TYPE' : 'DELIVERY_MEDIUM', 
              moduleId: moduleName === 'FLEET_TYPE' ? selectedRow?.id : moduleName === 'VEHICLE' ? (selectedRow.fleetTypeId ? selectedRow.fleetTypeId : selectedRow.vehicleId) : selectedRow.fleetTypeId ? selectedRow.fleetTypeId : selectedRow?.deliveryMediumMasterId ,
              pageNumber: pageNumber,
              pageSize: pageSize,
              searchBy: filterOptions?.searchBy,
              searchText: filterOptions?.searchText,
              sortBy: sortOptions?.sortBy,
              sortOrder: sortOptions?.sortOrder,
          },
      });
  },
  [selectedRow]
  );

  useEffect(() => {
    const mongoStructure = compartmentColumnSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'compartmentConfiguration', {});
      setOperationTimingsColumns(newColumns);
    }
  }, [compartmentColumnSelector]);


  return (
    <>
      {/* COMPARTMENTS MODAL */}
      <Modal open={isCompartmentListModalVisible} onToggle={() => setCompartmentListModalVisible(false)} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.compartment_p} imageVariant='icomoon-close' width='810px' handleClose={() => setCompartmentListModalVisible(false)}/>
          ),
          content:
            operationTimingsColumns.length > 0 ? (
              <ListView
                rowIdentifier='compartmentId'
                hasRowSelectionWithEdit={false}
                columns={operationTimingsColumns}
                data={compartmentRowSelector}
                totalRows={compartmentRowSelector?.length}
                onFetchData={handleCompartmentListFetchData}
                loading={compartmentListLoading}
                isColumnLoading={compartmentListLoading}
                hidePaginationBar={true}
                hideRefresh={true}
                hideToolbar={true}
                hasSelectAllRows={false}
                style={{ height: '45vh', width: '100%' }}
              />
            ) : null,
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setCompartmentListModalVisible(false)}>{dynamicLabels.cancel}</IconButton>
            </Box>
          ),
        }}
      </Modal>
      {/* COMPARTMENTS MODAL */}
    </>
  );
};

export default CompartmentListViewModal;