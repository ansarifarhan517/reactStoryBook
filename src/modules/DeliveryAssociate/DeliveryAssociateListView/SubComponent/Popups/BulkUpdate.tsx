import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  ModalHeader,
  ISelectedRows,
  DropDown,
  IconButton,
  useToast,
  FontIcon,
  RadioGroup,
  Radio,
  TextInput,
  MultiSelect,
  tMultiSelectChildren,
  IMultiSelectOptions,
} from "ui-library";
import LabelMapping from "../../LabelMapping";
import { StyledBulkUpdate } from "../StyledSubComponent";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IBranchInfo } from "../../DeliveryAssociate.models";
import withRedux from "../../../../../utils/redux/withRedux";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { dynamicLabelMapping } from "../../DeliveryAssociateHelperMethods";
import { metricsConversion } from '../../../../../utils/helper';

interface IBulkUpdate {
  showBulkUpdate: boolean;
  setShowBulkUpdate: (value: boolean) => void;
  selectedRows: ISelectedRows;
  fetchDataSilenty: () => void;
}
// content needs to be added
const BulkUpdate = ({
  showBulkUpdate,
  setShowBulkUpdate,
  selectedRows,
  fetchDataSilenty,
}: IBulkUpdate) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
  const branchList = useTypedSelector(
    (state) => state.deliveryMedium.listView.branchList
  );
  const weeklyOff = useTypedSelector(
    (state) => state.deliveryMedium.listView.weeklyOff
  );
  const deliveryTypes = useTypedSelector(
    (state) => state.deliveryMedium.listView.deliveryTypes
  );
  const statusUpdateReasons = useTypedSelector(
    (state) => state.deliveryMedium.listView.statusUpdateReasons
  );
  const clientMetric = useTypedSelector(state => state?.deliveryMedium?.listView?.clientMetric)
  const [branchName, setBranchName] = useState("");
  const [daTypes, setDaTypes] = useState<
    { value: string; label: string }[] | undefined
  >(undefined);
  const [selectedWeeklyOff, setSelectedWeeklyOff] = useState<
    { value: string; label: string }[] | undefined
  >(undefined);
  // using type any as some tims value coming string,number or undefined or null
  const [variableCost, setVariableCost] = useState<any>(undefined);
  const [fixedCost, setFixedCost] = useState<any>(undefined); //as it could be number or string
  const [capacity, setCapacity] = useState<any>({
    units: undefined,
    weight: undefined,
    volume: undefined,
  });
  const [isAttendenceFl, setisAttendenceFl] = useState<boolean | undefined>(
    undefined
  );
  const [isActiveFl, setActiveFl] = useState<boolean | undefined>(undefined);
  const [confrimationPopup, setConfirmationPopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // if error msg comes, or user clicks on update jst disable update btn and make enable once popup gets close or error comes.
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [statusUpdateReason, setStatusUpdateReason] = useState("");
  const [reason, setReason] = useState<string>("");

  const toast = useToast();

  useEffect(() => {
    setShowBulkUpdate(showBulkUpdate);
  }, [showBulkUpdate]);

  useEffect(() => {
    if (isAttendenceFl !== undefined) {
      setActiveFl(true);
    }
  }, [isAttendenceFl]);

  useEffect(() => {
    if (isActiveFl === false) {
      setisAttendenceFl(undefined);
    }
  }, [isActiveFl]);

  const branchOptions = branchList;
  const handleUpdate = () => {
    if (branchName) {
      setConfirmationPopup(true);
    } else {
      setIsBtnDisable(true);
      updateApiCall();
    }
  };

  const updateApiCall = async () => {
    const selectedNewRows = Object.values(selectedRows).map((row) => {
      const newRow = row;

      if (branchName) {
        const selectedBranch = branchList.find(
          (branch: IBranchInfo) => branch?.label === branchName
        );
        newRow.branchName = branchName;
        newRow.branchTimeZone = selectedBranch?.canonicalId;
        newRow.branchDescription = selectedBranch?.branchDescription;
        newRow.dmTimeZone = selectedBranch?.canonicalId;
        newRow.distributionCenter = selectedBranch?.id;
      } else if (newRow.branchName) {
        const selectedBranch = branchList.find(
          (branch: IBranchInfo) => branch?.label === newRow.branchName
        );
        newRow.branchName = newRow.branchName;
        newRow.branchTimeZone = selectedBranch?.canonicalId;
        newRow.branchDescription = selectedBranch?.branchDescription;
        newRow.dmTimeZone = selectedBranch?.canonicalId;
        newRow.distributionCenter = selectedBranch?.id;
      }

      if (daTypes && daTypes.length >= 1) {
        newRow.deliveryMediumMasterTypeCd = daTypes
          ?.map((type) => type.label)
          .join(",");
      }
      if (selectedWeeklyOff) {
        newRow.weeklyOffList = selectedWeeklyOff?.map((day) => day.label);
      }
      if (variableCost) {
        newRow.variableCost = parseFloat(variableCost);
      }
      if (fixedCost) {
        newRow.fixedCost = parseFloat(fixedCost);
      }
      if (isAttendenceFl !== undefined) {
        newRow.isAttandanceFl = isAttendenceFl;
      }
      if (isActiveFl !== undefined) {
        newRow.isActiveFl = isActiveFl;
      }
      if (capacity.units) {
        newRow.capacityInUnits = parseFloat(capacity.units);
      }
      if (capacity.volume) {
        newRow.capacityInVolume = parseFloat(capacity.volume);
       const clientObj = clientMetric.find(c => c.name === 'volume')
       const capacityInVolume = newRow.capacityInVolume

       const val = capacityInVolume !== undefined && metricsConversion((capacityInVolume), 'POST', clientObj?.conversionFactor)

       const val2 = metricsConversion((capacityInVolume), 'POST', clientObj?.conversionFactor)
       newRow.capacityInVolume = capacityInVolume === undefined ? val2 : val ? val : 0
     } else {
       const clientObj = clientMetric.find(c => c.name === 'volume')
       const capacityInVolume = newRow.capacityInVolume

       const val = capacityInVolume !== undefined && metricsConversion(parseFloat(capacityInVolume), 'POST', clientObj?.conversionFactor)

       const val2 = metricsConversion(parseFloat(capacityInVolume), 'POST', clientObj?.conversionFactor)
       newRow.capacityInVolume = capacityInVolume === undefined ? val2 : val ? val : 0
     }
     if (capacity.weight) {
        newRow.capacityInWeight = parseFloat(capacity.weight);
       const clientObj = clientMetric.find(c => c.name === 'weight')
       const capacityInWeight = newRow.capacityInWeight

       const val = capacityInWeight !== undefined && metricsConversion((capacityInWeight), 'POST', clientObj?.conversionFactor)

       const val2 = metricsConversion((capacityInWeight), 'POST', clientObj?.conversionFactor)
       newRow.capacityInWeight = capacityInWeight === undefined ? val2 : val ? val : 0
   
     } else {
       const clientObj = clientMetric.find(c => c.name === 'weight')
       const capacityInWeight = newRow.capacityInWeight

       const val = capacityInWeight !== undefined && metricsConversion(parseFloat(capacityInWeight), 'POST', clientObj?.conversionFactor)

       const val2 = metricsConversion(parseFloat(capacityInWeight), 'POST', clientObj?.conversionFactor)
       newRow.capacityInWeight = capacityInWeight === undefined ? val2 : val ? val : 0

      }
      if (statusUpdateReason && statusUpdateReason !== dynamicLabels.Other) {
        newRow.reason = statusUpdateReason;
      }
      if (
        (!statusUpdateReason &&
          (isActiveFl !== undefined || isAttendenceFl !== undefined)) ||
        (statusUpdateReason === dynamicLabels.Other && !reason)
      ) {
        newRow.reason = "";
      }
      if (
        statusUpdateReason &&
        statusUpdateReason === dynamicLabels.Other &&
        reason
      ) {
        newRow.reason = reason;
      }
      return newRow;
    });
    try {
      const {
        data: { status, message },
      } = await axios.put(
        apiMappings.deliveryMedium.listView.bulkUpdate,
        selectedNewRows
      );
      if (status === 200) {
        toast.add(message, "check-round", false);
        setShowBulkUpdate(false);
        fetchDataSilenty();
        setConfirmationPopup(false);
        setIsBtnDisable(false);
        return;
      }
      throw message;
    } catch (errorMessage) {
      const error =
        errorMessage.response?.data?.error?.["deliverymedium_0"]?.[0]
          ?.message?.[0];
      setConfirmationPopup(false);
      setShowBulkUpdate(false);
      setIsBtnDisable(false);
      return toast.add(
        typeof error === "string" ? error : dynamicLabels?.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  const handleReset = () => {
    setBranchName("");
    setDaTypes([{ value: "", label: "" }]);
    setSelectedWeeklyOff(undefined);
    setVariableCost("");
    setFixedCost("");
    setCapacity({ ...capacity, units: "", weight: "", volume: "" });
    setisAttendenceFl(undefined);
    setActiveFl(undefined);
    setDaTypes(undefined);
    setStatusUpdateReason("");
  };
  const handleCancel = () => {
    setShowBulkUpdate(false);
  };
  return (
    <>
      {!confrimationPopup && (
        <Modal
          open={showBulkUpdate}
          onToggle={(value) => {
            setShowBulkUpdate(value);
          }}
          width="1296px"
        >
          {{
            header: (
              <ModalHeader
                headerTitle={dynamicLabels?.bulkUpdate}
                imageVariant="icomoon-close"
                handleClose={() => setShowBulkUpdate(false)}
                width="100%"
              />
            ),

            content: (
              <StyledBulkUpdate>
                <Box horizontalSpacing="30px" display="flex">
                  <div className="div-width">
                    <DropDown
                      variant="form-select"
                      id="branchName"
                      optionList={branchOptions}
                      label={dynamicLabels?.branchName || "Branch Name"}
                      onChange={(value: any) => setBranchName(value)}
                      placeholder={dynamicLabels?.branchName || "Branch Name"}
                      value={branchName}
                      tooltipMessage={
                        dynamicLabelMapping(dynamicLabels)
                          ?.bulkUpdateSkillsetToolip
                      }
                    />
                  </div>
                  <RadioGroup
                    id="activegroup"
                    orientation={false}
                    spacing={10}
                    variant="form"
                    label="Capacity"
                    width="100%"
                    labelColor="black"
                    errorMessage={errorMessage}
                    error={!!errorMessage}
                  >
                    <TextInput
                      id="Units"
                      onChange={(e: any) => {
                        const newValue = e?.target?.value
                          ? e?.target?.value
                          : "";
                        setCapacity({ ...capacity, units: newValue });
                        const indexOFDecimal = newValue.indexOf(".");
                        const msg =
                          indexOFDecimal !== -1
                            ? "Units should not be in decimal."
                            : "";
                        setErrorMessage(msg);
                      }}
                      type="number"
                      placeholder="Units"
                      fullWidth={false}
                      title="Units"
                      className="number-field"
                      label="Units"
                      value={capacity.units}
                    />
                    <TextInput
                      id="Weight"
                      onChange={(e: any) => {
                        const newValue = e?.target?.value
                          ? e?.target?.value
                          : "";
                        setCapacity({ ...capacity, weight: newValue });
                      }}
                      type="number"
                      placeholder="Weight"
                      fullWidth={false}
                      title="Weight"
                      className="number-field"
                      label="Weight"
                      step={0.01}
                      value={capacity.weight}
                    />
                    <TextInput
                      id="Volume"
                      onChange={(e: any) => {
                        const newValue = e?.target?.value
                          ? e?.target?.value
                          : "";
                        setCapacity({ ...capacity, volume: newValue });
                      }}
                      type="number"
                      placeholder="Volume"
                      fullWidth={false}
                      title="Volume"
                      className="number-field"
                      label="Volume"
                      step={0.01}
                      value={capacity.volume}
                    />
                  </RadioGroup>

                  <div className="div-width">
                    <MultiSelect
                      options={deliveryTypes as IMultiSelectOptions[]}
                      onChange={(
                        _event,
                        _value,
                        _isSelected,
                        selectedOption: any
                      ) => setDaTypes(selectedOption)}
                      style={{
                        position: "absolute",
                        top: "auto",
                        left: "auto",
                        marginTop: "-18px",
                        width: "23%",
                      }}
                      // maximumSelected={10}
                      menuOpen={false}
                      selected={daTypes}
                      allowSelectAll={false}
                      searchableKeys={["label"]}
                      isLoading={false}
                    >
                      {({
                        optionSelected,
                        isMenuOpen,
                        openMenu,
                      }: tMultiSelectChildren) => (
                        <>
                          <TextInput
                            id="skill-set"
                            className="multiselct"
                            label={dynamicLabels?.skillSet || "Skill Set"}
                            labelColor="black"
                            placeholder="Select"
                            onClick={() => {
                              openMenu(!isMenuOpen);
                            }}
                            value={
                              optionSelected && optionSelected?.length > 0
                                ? optionSelected?.length + " Selected"
                                : "Select"
                            }
                            fullWidth
                            read-only
                            tooltipMesaage={
                              dynamicLabelMapping(dynamicLabels)
                                ?.bulkUpdateSkillsetToolip
                            }
                          />
                          <span
                            style={{
                              position: "absolute",
                              left: "72%",
                              top: (isAttendenceFl !== undefined ||
                                isActiveFl !== undefined) ? "25%" : "31%",
                            }}
                            onClick={() => {
                              openMenu(!isMenuOpen);
                            }}
                          >
                            <FontIcon variant="triangle-down" size={8} />
                          </span>
                        </>
                      )}
                    </MultiSelect>
                  </div>
                  <div className="div-width">
                    <MultiSelect
                      options={weeklyOff as IMultiSelectOptions[]}
                      onChange={(
                        _event,
                        _value,
                        _isSelected,
                        selectedOption: any
                      ) => setSelectedWeeklyOff(selectedOption)}
                      style={{
                        position: "absolute",
                        top: "auto",
                        left: "auto",
                        marginTop: "-18px",
                        width: "23%",
                      }}
                      menuOpen={false}
                      selected={selectedWeeklyOff}
                      allowSelectAll={false}
                      searchableKeys={["label"]}
                    >
                      {({
                        optionSelected,
                        isMenuOpen,
                        openMenu,
                      }: tMultiSelectChildren) => (
                        <>
                          <TextInput
                            tooltipMesaage={
                              dynamicLabelMapping(dynamicLabels)
                                ?.bulkUpdateWeeklyOffTooltip
                            }
                            data-for="weekly-off"
                            id="weekly-off"
                            className="multiselct"
                            label={dynamicLabels?.weeklyOff || "Weekly Off Day"}
                            labelColor="black"
                            placeholder="Select"
                            onClick={() => {
                              openMenu(!isMenuOpen);
                            }}
                            value={
                              optionSelected && optionSelected?.length > 0
                                ? optionSelected?.length + " Selected"
                                : "Select"
                            }
                          />
                          <span
                            style={{
                              position: "absolute",
                              left: "97%",
                              top: (isAttendenceFl !== undefined ||
                                isActiveFl !== undefined) ? "25%" : "31%",
                            }}
                            onClick={() => {
                              openMenu(!isMenuOpen);
                            }}
                          >
                            <FontIcon variant="triangle-down" size={8} />
                          </span>
                        </>
                      )}
                    </MultiSelect>
                  </div>
                </Box>
                <Box horizontalSpacing="30px" display="flex">
                  <div className="div-width">
                    <RadioGroup
                      id="attendence-group"
                      orientation={false}
                      spacing={10}
                      variant="form"
                      label={LabelMapping.attendence}
                      width="100%"
                      labelColor="black"
                    >
                      <Radio
                        id="present"
                        onChange={() => setisAttendenceFl(true)}
                        checked={!!isAttendenceFl}
                        value="Mark as Present"
                        label={dynamicLabels?.["Mark as Present"]}
                        radioSize="sm"
                        disabled={isActiveFl === false}
                      />
                      <Radio
                        id="absent"
                        onChange={() => setisAttendenceFl(false)}
                        checked={
                          isAttendenceFl !== undefined && !isAttendenceFl
                        }
                        value="Mark as Absent"
                        label={dynamicLabels?.["Mark as Absent"]}
                        radioSize="sm"
                        disabled={isActiveFl === false}
                      />
                    </RadioGroup>
                  </div>
                  <div className="div-width">
                    <RadioGroup
                      id="status-group"
                      orientation={false}
                      spacing={10}
                      variant="form"
                      label="Status"
                      width="100%"
                      // width='291px'
                      labelColor="black"
                    >
                      <Radio
                        id="active"
                        onChange={() => setActiveFl(true)}
                        checked={isActiveFl}
                        value="markAsActive"
                        label={dynamicLabels.markAsActive}
                        radioSize="sm"
                        disabled={typeof isAttendenceFl == "boolean"}
                      />
                      <Radio
                        id="inactive"
                        onChange={() => setActiveFl(false)}
                        checked={isActiveFl !== undefined && !isActiveFl}
                        value="markAsInactive"
                        label={dynamicLabels.markAsInactive}
                        radioSize="sm"
                      />
                    </RadioGroup>
                  </div>
                  <div className="div-width">
                    <TextInput
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newValue = e?.target?.value
                          ? e?.target?.value
                          : "";
                        setVariableCost(newValue);
                      }}
                      type="number"
                      placeholder="Variable Cost"
                      fullWidth={false}
                      title="Variable Cost"
                      className="number-text"
                      label="Variable Cost"
                      value={variableCost}
                    />
                  </div>
                  <div className="div-width">
                    <TextInput
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newValue = e?.target?.value
                          ? e?.target?.value
                          : "";
                        setFixedCost(newValue);
                      }}
                      type="number"
                      placeholder="Fixed Cost"
                      fullWidth={false}
                      title="Fixed Cost"
                      className="number-text"
                      label="Fixed Cost"
                      value={fixedCost}
                    />
                  </div>
                </Box>
                <Box horizontalSpacing="30px" display="flex">
                  <div className="div-width">
                    {(isAttendenceFl !== undefined ||
                      isActiveFl !== undefined) && (
                      <DropDown
                        variant="form-select"
                        id="statusUpdateReason"
                        optionList={statusUpdateReasons}
                        label={dynamicLabels.statusUpdateReason}
                        onChange={(value: string | undefined) => {
                          value && setStatusUpdateReason(value);
                        }}
                        placeholder={dynamicLabels.statusUpdateReason}
                        value={statusUpdateReason}
                      />
                    )}
                  </div>
                  <div className="div-width">
                    {statusUpdateReason === dynamicLabels.Other && (
                      <TextInput
                        type="text"
                        placeholder={dynamicLabels.enterReason}
                        fullWidth={false}
                        title={reason}
                        className="number-text"
                        label={dynamicLabels.enterReason}
                        value={reason}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newValue = e?.target?.value
                            ? e?.target?.value
                            : "";
                          setReason(newValue);
                        }}
                      />
                    )}
                  </div>
                  <div className="div-width"></div>
                  <div className="div-width"></div>
                </Box>
              </StyledBulkUpdate>
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                   id='DA-BulkUpdate-Modal-Update'
                  iconVariant="icomoon-save"
                  primary
                  disabled={!!errorMessage || isBtnDisable}
                  onClick={handleUpdate}
                >
                  {dynamicLabels?.update}
                </IconButton>
                <IconButton
                  id='DA-BulkUpdate-Modal-back'
                  iconVariant="icomoon-back"
                  primary={false}
                  onClick={handleReset}
                >
                  {dynamicLabels?.reset}
                </IconButton>
                <IconButton
                  id='DA-BulkUpdate-Modal-cancel'
                  iconVariant="icomoon-close"
                  primary={false}
                  onClick={handleCancel}
                >
                  {dynamicLabels?.cancel || "Cancel"}
                </IconButton>
              </Box>
            ),
          }}
        </Modal>
      )}
      {confrimationPopup && (
        <UpdateConfirmation
          isShowModal={confrimationPopup}
          setIshowModal={() => setConfirmationPopup(false)}
          title={dynamicLabels?.updateConfirmation}
          dynamicLabels={dynamicLabels}
          handleOkAction={() => updateApiCall()}
          content={dynamicLabels?.bulkupdateConfirmation}
        />
      )}
    </>
  );
};

const UpdateConfirmation = React.memo(
  ({
    isShowModal,
    setIshowModal,
    title,
    handleOkAction,
    content,
    dynamicLabels,
  }: any) => {
    return (
      <Modal
        open={isShowModal}
        onToggle={(value) => {
          setIshowModal(value);
        }}
        size="md"
        children={{
          header: (
            <ModalHeader
              headerTitle={title}
              handleClose={() => setIshowModal(false)}
              imageVariant="icomoon-close"
              headerStyle={{ fontSize: "15px" }}
              width="100%"
            />
          ),
          content: (
            <div
              style={{
                fontSize: 14,
                color: "#000",
                margin: "5px",
                lineHeight: "22px",
              }}
            >
              {content}
            </div>
          ),
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
              <IconButton
                 id='DA-BulkUpdate-Modal-Ok'
                iconVariant="icomoon-tick-circled"
                primary
                onClick={handleOkAction}
              >
                {dynamicLabels.ok}
              </IconButton>
              <IconButton
                 id='DA-BulkUpdate-Modal-Cancel'
                iconVariant="icomoon-close"
                iconSize={11}
                onClick={() => setIshowModal(false)}
              >
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      />
    );
  }
);

export default withRedux(BulkUpdate);
