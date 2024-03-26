import React, { useCallback, useEffect, useState } from "react";
import { ColumnInstance } from 'react-table'
import { Box, IListViewColumn, ListView, Modal, ModalHeader, IconButton, useToast } from 'ui-library';
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { ITrackers } from "../TripsListView.model";

interface ITrackersListView {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tripReferenceId: string;
  dynamicLabels: Record<string, string>;
}

type TransformedColumn = { transformedColumns: IListViewColumn[] }
export type TrackersListViewStructure = IMongoListViewStructure & TransformedColumn;

const TrackersListView = ({ open, setOpen, tripReferenceId, dynamicLabels }: ITrackersListView) => {

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState<TrackersListViewStructure>({ columns: {}, buttons: {}, transformedColumns: [] });
  const [data, setData] = useState<ITrackers[]>([]);

  const handleFetchListData = React.useCallback(async ({  }) => {
      try {
        setLoading(true);
        const { status, data: { data } } = await axios.get(apiMappings.trips.mile.trackers.data,
          {
            params: { tripRefId: tripReferenceId },
          }
        );
        if (status == 200) { setData(data) }
      } catch (error: any) {
        toast.add(dynamicLabels.somethingWendWrong, "warning", false);
      } finally {
        setLoading(false);
      }
    },[]);

  const handleFetchStructure = async () => {
    try {
      const response = await axios.get(apiMappings.trips.mile.trackers.structure);
      if (response.status == 200) {
        const { columns, buttons } = response?.data;
        if (columns && Object.keys(columns)?.length) {
          const newColumns = transformMongoListViewToColumns(columns, "tripTrackers");
          setStructure({ columns: columns, buttons: buttons, transformedColumns: newColumns });
        }
      } else {
        toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
      }
    } catch (e) {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }
  }

  const onSaveColumnPreferences = useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columns = { ...structure.columns }
    Object.keys(columns).forEach((columnKey) => { columns[columnKey].permission = !!visibleColumns[columnKey] });
    const payload = { columns: columns, buttons: structure.buttons}
    try {
      const { data: { status, message } } = await axios.put(apiMappings.trips.mile.trackers.structure, payload);
      if(status == 200) {
        setStructure({...structure, columns})
        message && toast.add(message, 'check-round', false);
      }
    } catch (error: any) {
      toast.add(typeof error === "string" ? error : dynamicLabels?.somethingWendWrong, "", false);
    }
  }, [structure.columns]);

  useEffect(() => {
    handleFetchStructure();
  }, []);

  return (
    <Modal
      open={open}
      onToggle={() => setOpen(false)}
      width="90vw"
    >
      {{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels.tracker_p}
            imageVariant="icomoon-close"
            width="90vw"
            handleClose={() => setOpen(false)}
          />
        ),
        content: (
          <ListView
            rowIdentifier="tripTrackers"
            columns={structure.transformedColumns}
            data={data}
            totalRows={data.length}
            onFetchData={handleFetchListData}
            onSaveColumnPreferences={onSaveColumnPreferences}
            loading={loading}
            isColumnLoading={loading}
            hideRefresh={loading}
            style={{ height: "50vh", width: "100%" }}
          />
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => setOpen(false)}
              id='btn_trackers-modal-cancel'
            >
              Cancel
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default TrackersListView;
