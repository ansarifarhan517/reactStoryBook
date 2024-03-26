import React, { useEffect, useState } from "react";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { ListView, IListViewColumn, Loader } from "ui-library";
import { IUndeliveredTripListResponse } from "../TripsListView.model";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";

export const UndeliveredListView = (props: {
  data: IUndeliveredTripListResponse;
  setSelectedRows: any;
}) => {
  const { results } = props.data;
  const loading = useTypedSelector(
    (state) => state.trips.listView.mile.loading.undeliveredListView
  );
  const [columnsStructure, setColumnsStructure] = useState({});
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [orderListData, setOrderListData] = useState([]);

  const getUndeliveredStructure = async () => {
    const {
      data: { columns },
    } = await axios(
      apiMappings.trips.mile.listview.getUndeliveredShipmentsStructure
    );
    setColumnsStructure(columns);
  };
  useEffect(() => {
    getUndeliveredStructure();
    let orderList: any = [];
    results &&
      results.forEach((trip) => {
        orderList = [...orderList, ...trip.shipments];
      });
    setOrderListData(orderList);
  }, []);
  useEffect(() => {
    if (Object.keys(columnsStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        columnsStructure,
        "trips_undeliveredOrdersList"
      );
      setColumns(newColumns);
    }
  }, [columnsStructure]);

  const handleRowSelection = (selectedRows: any) => {
    props.setSelectedRows.current = selectedRows;
  };

  return (
    <React.Fragment>
      {loading && <Loader center fadeBackground />}
      <ListView
        style={{ height: "300px", overflow: "visible" }}
        columns={columns}
        data={orderListData}
        hasRowSelection
        heightBuffer={10}
        rowIdentifier="shipmentId"
        onRowSelect={handleRowSelection}
        hideRefresh={loading}
        hideColumnSettings
        hidePaginationBar
      />
    </React.Fragment>
  );
};
