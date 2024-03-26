import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { VehicleListViewActions } from './VehicleListView.actions';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { ListView, IListViewColumn, Box, Modal, ModalHeader, IconButton} from 'ui-library';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { TrackerListviewContainer } from './VehicleListView.styled';

export interface ITrackerListViewModalsProps {
  isTrackerListModalVisible: boolean;
  setTrackerListModalVisible: Function;
  selectedRow?: any;
}


const TrackerListViewModal = (props: ITrackerListViewModalsProps) => {
  const {isTrackerListModalVisible, setTrackerListModalVisible,selectedRow } = props;
  const [trackerColumns, setTrackerColumns] = useState<IListViewColumn[]>([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const dispatch = useDispatch<Dispatch<VehicleListViewActions>>();

  const trackerColumnSelector = useTypedSelector((state) => state.vehicle.listView.trackerListStructure?.columns);
  const trackerRowSelector = useTypedSelector((state) => state.vehicle.listView.trackerListData.results);
  const trackerListLoading = useTypedSelector((state) => state.vehicle.listView.loading.listView);
  const handleTrackerListFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
      dispatch({
          type: '@@vehicleListView/FETCH_TRACKER_LIST_DATA',
          payload: {
              pageNumber: pageNumber,
              pageSize: pageSize,
              searchBy: filterOptions?.searchBy,
              searchText: filterOptions?.searchText,
              sortBy: sortOptions?.sortBy,
              sortOrder: sortOptions?.sortOrder,
              vehicleId: selectedRow?.vehicleId
          },
      });
  },
  [selectedRow]
  );

  useEffect(() => {
    const mongoStructure = trackerColumnSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'trackers', {});
      const statusTransformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if (column.accessor === 'lastTrackedDt') {
          newcolumn.hrefdata = "`#/trackerHistory/?trackeeId=${row?.original?.trackeeId}&lastTrackedDt=${row?.original?.lastTrackedDt}&trackeeName=${row?.original?.trackerModel}&deviceId=${row?.original?.deviceId}`"
          newcolumn['cellType'] = 'DATE';
        }
        return newcolumn;
      });
      setTrackerColumns(statusTransformedColumn);
    }
  }, [trackerColumnSelector]);


  return (
    <>
      {/* Trackers MODAL */}
      <Modal open={isTrackerListModalVisible} onToggle={() => setTrackerListModalVisible(false)} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.tracker_p} imageVariant='icomoon-close' width='810px' handleClose={() => setTrackerListModalVisible(false)}/>
          ),
          content:
          trackerColumns.length > 0 ? (
            <TrackerListviewContainer>
              <ListView
                rowIdentifier='deviceId'
                hasRowSelectionWithEdit={false}
                columns={trackerColumns}
                data={trackerRowSelector}
                totalRows={trackerRowSelector?.length}
                onFetchData={handleTrackerListFetchData}
                loading={trackerListLoading}
                isColumnLoading={trackerListLoading}
                hidePaginationBar={true}
                hideRefresh={true}
                hideToolbar={true}
                hasSelectAllRows={false}
                style={{ height: '45vh', width: '100%' }}
              />
              </TrackerListviewContainer>
            ) : null,
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setTrackerListModalVisible(false)}>{dynamicLabels.cancel}</IconButton>
            </Box>
          ),
        }}
      </Modal>
      {/* Trackers MODAL */}
    </>
  );
};

export default TrackerListViewModal;