import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  DropDown,
  IconButton,
  InlinePopup,
  Loader,
  Position,
  Tooltip,
  useToast,
  FontIcon,
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { ILogiAPIResponse } from "../../../utils/api.interfaces";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import ChipsContainer from "../../../utils/components/Chips/ChipsContainer";
import { withReactOptimized } from "../../../utils/components/withReact";
import store from "../../../utils/redux/store";
import handleOutsideClick from "../SubComponents/handleOutsideClick";
import { AttachCheckpointsWrapper, ChipWrapper, ChipsContainerWrapper } from "../CheckpointsListView/CheckpointsListViewStyledComponent";
import { CheckpointsListViewActions } from "../CheckpointsListView/CheckpointsListView.actions";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { ICheckpointCodes } from "../CheckpointsListView/CheckpointsListView.models";
import useDebounce from "../../../utils/useDebounce";

const AttachCheckpointsToRouteModal = (props) => {
  const dispatch = useDispatch<Dispatch<CheckpointsListViewActions>>();
  const { isModalOpen, checkpointCodes, linkedCheckpointData } =
    useTypedSelector((state) => state.checkpoints.listView);

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.checkpoints);

  const toast = useToast();
  const ref = useRef();
  const [isAddMode, setIsAddMode] = React.useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = React.useState<
    number | undefined
  >();
  const [checkpointWarning, setCheckpointWarning] = React.useState<string>("");
  const [saveDisabled, setSaveDisabled] = React.useState<boolean>(true);
  const [initialData, setInitialData] = useState<Array<ICheckpointCodes>>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [dropDownOptions, setDropdownOptions] = useState<Array<ICheckpointCodes>>([]);
  const [inputVal, setInputVal] = useState("")
  const debouncedValue = useDebounce(inputVal, 800)  //delay 800 milliseconds 

  useEffect(() => {
    if (!dropdownValue && inputVal === debouncedValue) {
        dispatch({
          type: "@@checkpointsListView/FETCH_CHECKPOINT_CODES",
          payload: {
            searchText: inputVal,
          },
        });
    }
}, [debouncedValue])

  useEffect(() => {
    dispatch({
      type: "@@checkpointsListView/FETCH_CHECKPOINT_CODES",
    });
  }, []);

  useEffect(()=> {
    if(!isAddMode){
      resetData()
    }
  },[isAddMode])

  useEffect(() => {
    const checkpointAttachedMap = {};
    let checkpointDropdownOptions = checkpointCodes.map((option) => {
      checkpointAttachedMap[option?.checkpointId] = option;
      option["value"] = option?.checkpointId;
      option["label"] = option?.checkpointCode;
      return option;
    }); 
    if(checkpointCodes.length > 1 && !isInitialLoad ) {
      setInitialData(checkpointDropdownOptions);
      setIsInitialLoad(true)
    }    
    const options = initialData.length > 1 ? filterUniqueObjects(checkpointDropdownOptions, initialData) : checkpointDropdownOptions;
    setDropdownOptions(options);
  },[checkpointCodes])

  const filterUniqueObjects = (array1, array2) => {
    const uniqueLabels = new Set();
  
    return [...array1, ...array2].reduce((filteredArray, obj) => {
      if (!uniqueLabels.has(obj.label)) {
        uniqueLabels.add(obj.label);
        filteredArray.push(obj);
      }
      return filteredArray;
    }, []);
  }
  

  const linkageInformation = React.useMemo(() => {
    if (!linkedCheckpointData[0]?.length) {
      return dynamicLabels?.noCheckpointAttachedToRoute ? dynamicLabels?.noCheckpointAttachedToRoute : "No Checkpoint attached to Route.";
    } else {
      return dynamicLabels?.listOfCheckpointsAttached ? dynamicLabels?.listOfCheckpointsAttached : "List of Checkpoint(s) attached to Route.";
    }
  }, [linkedCheckpointData]);

  const handleAddClick = React.useCallback(() => {
    setIsAddMode(true);
  }, []);
  
  const resetData = () => {
    setDropdownValue(undefined);
    setCheckpointWarning("");
    setSaveDisabled(true);
  }

  handleOutsideClick(ref, () => {
    resetData()
    dispatch({
      type: "@@checkpointsListView/FETCH_CHECKPOINT_CODES",
    });
    store.dispatch({
      type: "@@checkpointsListView/SET_MODAL_OPEN",
      payload: false,
    })
  }
  );

  const handleCancel = React.useCallback(() => {
    setIsAddMode(false);
    setDropdownValue(undefined);
    setCheckpointWarning("");
    setSaveDisabled(true);
  }, []);

  const handleSave = async () => {
    setIsFormLoading(true);
    try {
      const { data: response } = await axios.post<ILogiAPIResponse<boolean>>(
        apiMappings?.checkpoints?.checkpointsMappedToRoutes?.addCheckpoint,
        {
          routeConfigIds : [linkedCheckpointData[1]],
          checkpointIds : [dropdownValue]
        }
      );

      if (!response.hasError && response.status === 200) {
        toast.add(response.message, "check-round", false);
        dispatch({
          type: "@@checkpointsListView/SET_MODAL_OPEN",
          payload: false,
        });
        setIsAddMode(false);
        props.onReload(true)
        setDropdownValue(undefined);
      }
    } catch (errorResponse: any) {
      console.log(errorResponse);
      toast.add(
        errorResponse?.message ||
          errorResponse?.response?.message ||
          dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const delinkCheckpoint = async (checkpointIdToDelink: number) => {
    setIsFormLoading(true);
    try {
      const { data: response } = await axios.delete<ILogiAPIResponse<boolean>>(
        apiMappings?.checkpoints?.checkpointsMappedToRoutes?.delinkCheckpoint + `${checkpointIdToDelink}`
      );

      if (!response.hasError && response.status === 200) {
        toast.add(response.message, "check-round", false);
        dispatch({
          type: "@@checkpointsListView/SET_MODAL_OPEN",
          payload: false,
        });
        setIsAddMode(false);
        props.onReload(true)
      } else {
        throw response;
      }
    } catch (errorResponse: any) {
      console.log(errorResponse);
      toast.add(
        errorResponse?.message ||
          errorResponse?.response?.message ||
          dynamicLabels?.somethingWentWrong ? dynamicLabels?.somethingWentWrong : "Something Went Wrong",
        "warning",
        false
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleInputChange = useCallback((value) => {
    setInputVal(value);
  }, [setInputVal]);
  
  const handleDropdownChange = (checkpointId) => {  
    setDropdownValue(checkpointId);
    const linkedId = (linkedCheckpointData[0].map((item) => item?.checkpointId)).find(id => id===checkpointId)
    if (linkedId != null && linkedId === checkpointId) {
      setSaveDisabled(true);
      setCheckpointWarning(dynamicLabels?.checkpointAlreadyLinked ? dynamicLabels?.checkpointAlreadyLinked : "Note: Checkpoint is already linked to this route.");
    } else if(!checkpointId) {
      setSaveDisabled(true);
      setCheckpointWarning("");
    } else {
      setSaveDisabled(false);
      setCheckpointWarning("");
    }
  };

  return (
    <>
      {isModalOpen ? (
        <AttachCheckpointsWrapper>
          <div ref={ref}>
            <InlinePopup
              id="link-popup"
              title={
                dynamicLabels?.attachedCheckpoints
                  ? dynamicLabels?.attachedCheckpoints
                  : "Attached Checkpoints"
              }
              isOpen={isModalOpen}
              onClose={() => {
                handleCancel();
                store.dispatch({
                  type: "@@checkpointsListView/SET_MODAL_OPEN",
                  payload: false,
                });
              }}
              width={500}
              height={300}
              content={
                <Box p="15px" bgColor="white">
                  <Box mb="15px" className="linkInfo">
                    {linkageInformation}
                  </Box>
                  {(linkedCheckpointData[0]?.length || 0) > 0 && (
                    <ChipsContainerWrapper>
                      <ChipsContainer>
                        {linkedCheckpointData[0]?.map((id) => (
                          <Box
                            m="5px"
                            display="inline-block"
                            key={id?.checkpointId}
                          >
                            <ChipWrapper>
                              {id?.checkpointCode}
                              <IconButton
                                iconVariant="delete-thin"
                                iconSize={10}
                                color="error.main"
                                onClick={() =>
                                  delinkCheckpoint(id?.routeCheckpointMappingId)
                                }
                                intent="default"
                                onlyIcon
                              />
                            </ChipWrapper>
                          </Box>
                        ))}
                      </ChipsContainer>
                    </ChipsContainerWrapper>
                  )}

                  <Position type="relative">
                    {isFormLoading && <Loader center fadeBackground />}
                    {isAddMode && (
                      <Box fullWidth mt="15px">
                        <DropDown
                          placeholder={
                            dynamicLabels?.checkpointCodes
                              ? dynamicLabels?.checkpoint_p
                              : "Checkpoints"
                          }
                          label={
                            dynamicLabels?.checkpointCodes
                              ? dynamicLabels?.checkpoint_p
                              : "Checkpoints"
                          }
                          variant="form-select"
                          value={dropdownValue}
                          onChange={(value) => handleDropdownChange(value)}
                          onInputChange={handleInputChange}
                          optionList={dropDownOptions}
                          limitOptionsList={dropDownOptions.length}
                        />
                        {/* Validation for the checkpoint should come here. */}
                        {checkpointWarning ? (
                          <Box
                            flexDirection="row"
                            display="flex"
                            alignItems="flex-start"
                            // Styling breaks when used class/styled component. That's why applied inline styling over here
                            style={{
                              fontSize: 12,
                              gap: "5px",
                              padding: "5px 0",
                              wordBreak: "break-all",
                              lineHeight: "12px",
                            }}
                          >
                            <FontIcon
                              variant="icomoon-warning-circled"
                              color="error.main"
                              size="xs"
                            />
                            {checkpointWarning}
                          </Box>
                        ) : null}
                      </Box>
                    )}
                    <Box
                      mt="15px"
                      display="flex"
                      fullWidth
                      justifyContent="flex-end"
                      horizontalSpacing="10px"
                    >
                      {isAddMode ? (
                        <>
                          <IconButton
                            iconVariant="icomoon-save"
                            primary
                            onClick={handleSave}
                            disabled={saveDisabled}
                            id="routesListView--actionBar--save"
                          >
                            {dynamicLabels?.save ? dynamicLabels?.save : "Save"}
                          </IconButton>
                          <IconButton
                            iconVariant="icomoon-close"
                            onClick={handleCancel}
                            id="routesListView--actionBar--cancel"
                          >
                            {dynamicLabels?.cancel
                              ? dynamicLabels?.cancel
                              : "Cancel"}
                          </IconButton>
                        </>
                      ) : (
                        <Tooltip
                          hover
                          message={
                            dynamicLabels?.linkCheckpoint
                              ? dynamicLabels?.linkCheckpoint
                              : "Link Checkpoint"
                          }
                          tooltipDirection="bottom"
                        >
                          <IconButton
                            iconVariant="icomoon-add"
                            onClick={handleAddClick}
                            id="routesListView--actionBar--add"
                          >
                            {dynamicLabels?.add ? dynamicLabels?.add : "Add"}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Position>
                </Box>
              }
            ></InlinePopup>
          </div>
        </AttachCheckpointsWrapper>
      ) : null}
    </>
  );
};

export default withReactOptimized(AttachCheckpointsToRouteModal, false);
