import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  FilterDrawer,
  ModalHeader,
  FilterMultiselect
} from "ui-library";
import { colorCodes } from "../../../Analytics/colorCodes";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import store from "../../../../utils/redux/store";

const AnalyticsCXFilters = (props: any) => {
  const {
    handleFilterSubmit,
    dynamicLabels,
    isFilterVisible,
    setFilterVisible,
  } = props;

  const shippers =
    useTypedSelector(
      (state) => state.cxDashboardReducer.dropdownOptions.shipper
    ) || [];
  const branches =
    useTypedSelector(
      (state) => state.cxDashboardReducer.dropdownOptions.branch
    ) || [];
  const [selectedBranches, setSelectedBranches] = useState<any>([]);
  const [selectedShippers, setSelectedShippers] = useState<any>([]);
  const [branchOptions, setBranchOptions] = useState<any>([]);
  const [shipperOptions, setShipperOptions] = useState<any>([]);

  const handleBranchChange = React.useCallback(
    (
      _selctedItem: string,
      _isChecked: boolean,
      listArray: [],
      selectedArray: []
    ) => {
      setSelectedBranches(selectedArray.map((branch: any) => branch.value));
      setBranchOptions(listArray);
    },
    []
  );
  const handleShipperChange = React.useCallback(
    (
      _selctedItem: string,
      _isChecked: boolean,
      listArray: [],
      selectedArray: []
    ) => {
      setSelectedShippers(selectedArray.map((shipper: any) => shipper.id));
      setShipperOptions(listArray);
    },
    []
  );
  
  const handleBranchSearch = React.useCallback((value:string, isSelectAll:boolean ) => {
    let branches = store.getState().cxDashboardReducer?.dropdownOptions?.branch;
    let listObj = branches.filter(
      (option) => !value || option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
  )
  setBranchOptions(listObj.map((obj) => ({ ...obj, checked: isSelectAll ? isSelectAll : selectedBranches.indexOf(obj.id) >= 0 })))
  }, [selectedBranches])

  const handleShipperSearch = React.useCallback((value:string, isSelectAll:boolean ) => {
    let branches = store.getState().cxDashboardReducer?.dropdownOptions?.shipper;
    let listObj = branches.filter(
      (option) => !value || option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
  )
  setShipperOptions(listObj.map((obj) => ({ ...obj, checked: isSelectAll ? isSelectAll : selectedShippers.indexOf(obj.id) >= 0 })))
  }, [selectedShippers])

  const handleSubsmit = () => {
    setFilterVisible(false);
    handleFilterSubmit({
      selectedBranches: selectedBranches,
      selectedShippers: selectedShippers,
    });
  };
  const resetFilters = () => {
    setSelectedBranches([]);
    setBranchOptions(
      branches.map((branch: any) => {
        branch["checked"] = true;
        return branch;
      })
    );
    setShipperOptions(
      shippers.map((shipper: any) => {
        shipper["checked"] = true;
        return shipper;
      })
    );
    setSelectedShippers([]);

    setFilterVisible(false);
    handleFilterSubmit({
      selectedBranches: [],
      selectedSkills: [],
    });
  };

  useEffect(() => {
    if (branches && !branchOptions.length) {
      setBranchOptions(
        branches.map((branch: any) => {
          branch["checked"] = true;
          return branch;
        })
      );
    }

    if (shippers && !shipperOptions.length) {
      setShipperOptions(
        shippers.map((shipper: any) => {
          shipper["checked"] = true;
          return shipper;
        })
      );
    }
  }, [branches, shippers]);

  return (
    <Box display="flex" justifyContent="space-evenly" horizontalSpacing="10px">
      <IconButton
        id="customer_experience_dashboard-actionbar-filter"
        intent="page"
        iconVariant="icomoon-funel icon-filter"
        onClick={() => {
          setFilterVisible(true);
        }}
        style={{ marginRight: "5px", minHeight: 30 }}
      >
        {dynamicLabels.filter}
      </IconButton>

      <FilterDrawer
        style={{
          zIndex: 100000,
          right: isFilterVisible ? -4 : -10,
          overflow: "hidden",
        }}
        isOpen={isFilterVisible}
      >
        <Box display="flex" flexDirection="column" fullWidth fullHeight>
          <ModalHeader
            width="400px"
            headerTitle={`${dynamicLabels.analytics} ${dynamicLabels.filter}`}
            handleClose={() => setFilterVisible(false)}
          />

          <Box
            flexGrow={1}
            style={{
              overflowY: "auto",
              background: colorCodes.white,
              position: "relative",
            }}
            p="15px"
            fullWidth
          >
            <div className="filter-input">
              <FilterMultiselect
                id="branches"
                label={dynamicLabels.branches || "hub"}
                options={branchOptions.slice(0,50)}
                onSelectionChange={(
                  id,
                  isChecked,
                  allOptions: any,
                  selectedOptions: any
                ) =>
                  handleBranchChange(id, isChecked, allOptions, selectedOptions)
                }
                handleSearch = {(value, isSelectAll) => handleBranchSearch(value, isSelectAll)}
              />
            </div>
            <div className="filter-input">
              <FilterMultiselect
                id="shippers"
                label={dynamicLabels.shippers}
                options={shipperOptions.slice(0,50)}
                onSelectionChange={(
                  id,
                  isChecked,
                  allOptions: any,
                  selectedOptions: any
                ) =>
                  handleShipperChange(
                    id,
                    isChecked,
                    allOptions,
                    selectedOptions
                  )
                }
                handleSearch = {(value, isSelectAll) => handleShipperSearch(value, isSelectAll)}
              />
            </div>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            p="15px 10px"
            style={{ background: colorCodes.white }}
            horizontalSpacing="10px"
            fullWidth
          >
            <IconButton
              iconVariant="icomoon-tick-circled"
              onClick={handleSubsmit}
              primary
            >
              {dynamicLabels.apply}
            </IconButton>
            <IconButton
              iconVariant="icomoon-back"
              onClick={() => resetFilters()}
            >
              {dynamicLabels.reset}
            </IconButton>
          </Box>
        </Box>
      </FilterDrawer>
    </Box>
  );
};

export default AnalyticsCXFilters;
