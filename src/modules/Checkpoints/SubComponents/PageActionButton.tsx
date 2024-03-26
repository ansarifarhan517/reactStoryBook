import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Tooltip,
  IconButton,
  ButtonGroup,
  IButtonGroupOption,
} from "ui-library";
import { hybridRouteTo } from "../../../utils/hybridRouting";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import {
  CheckpointsListViewActions,
  ISetViewMode,
} from "../CheckpointsListView/CheckpointsListView.actions";
import { CheckpointsFormActions } from "../CheckpointsForm/CheckpointsForm.actions";
import { BoxWrapper } from "../CheckpointsListView/CheckpointsListViewStyledComponent";

const PageActionButtons = ({ ngStateRouter }) => {
  const pageLabels = useTypedSelector((state) => state.pageLabels.allCheckpoints);
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.checkpoints}`);
  const { viewMode } = useTypedSelector((state) => state.checkpoints.listView);
  const dispatch = useDispatch<Dispatch<CheckpointsListViewActions>>();
  const formDispatch = useDispatch<Dispatch<CheckpointsFormActions>>();

  const viewTypeButtonGroupData: IButtonGroupOption[] = React.useMemo(() => {
    return [
      {
        id: "listview",
        label: pageLabels?.viewOptions?.listview?.toUpperCase(),
        icon: "list-view",
        selected: viewMode === "listview",
        tooltipText: dynamicLabels.listViewTooltip ? dynamicLabels.listViewTooltip : "Click here to view the list of Checkpoints",
      },
      {
        id: "mapview",
        label: pageLabels?.viewOptions?.mapview?.toUpperCase(),
        icon: "map-view",
        selected: viewMode === "mapview",
        tooltipText: dynamicLabels.mapViewTooltip ? dynamicLabels.mapViewTooltip : "Click here to view the Checkpoints on map",
      },
    ];
  }, [viewMode, pageLabels]);

  const handleChange = (id: string) => {
    dispatch({
      type: "@@checkpointsListView/SET_VIEW_MODE",
      payload: id,
    } as ISetViewMode);
  };

  return (
    <BoxWrapper>
      <Box display="flex" alignItems="center" className="gap">
        {pageLabels?.buttons.add && (
          <Tooltip
            tooltipDirection="bottom"
            arrowPlacement="center"
            messagePlacement="end"
            message={dynamicLabels.clickHereToAddCheckpoint ? dynamicLabels.clickHereToAddCheckpoint : "Click here to Add Checkpoint"}
            hover={true}
          >
            <IconButton
              intent="page"
              iconVariant="icomoon-add"
              onClick={() => {
                dispatch({type: "@@checkpointsListView/SET_FORM_EDITABLE",payload:false})
                hybridRouteTo("addCheckpoint");
                ngStateRouter.go("checkpointsForm");
                formDispatch({type: "@@checkpointsForm/RESET_STATE"})
              }}
              id="checkpointsListView--actionBar-add"
            >
              {dynamicLabels?.[pageLabels?.buttons.add] || (dynamicLabels.add ? dynamicLabels.add : "Add")}
            </IconButton>
          </Tooltip>
        )}
        {pageLabels?.buttons.upload && (
          <Tooltip
            message={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels?.checkpoint_p}.`}
            hover={true}
          >
            <IconButton
              intent="page"
              iconVariant="icomoon-upload"
              onClick={() => {
                dispatch({
                  type: "@@checkpointsListView/SET_UPLOAD_MODAL",
                  payload: true,
                });
              }}
              id="checkpointsListView--actionBar-upload"
            >
              {dynamicLabels?.[pageLabels?.buttons.upload] ||
                (dynamicLabels.upload ? dynamicLabels.upload : "Upload")}
            </IconButton>
          </Tooltip>
        )}
        {viewTypeButtonGroupData.length > 0 && (
          <ButtonGroup data={viewTypeButtonGroupData} onChange={handleChange} />
        )}
      </Box>
    </BoxWrapper>
  );
};

export default PageActionButtons;
