import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  DateRangePicker,
  FilterDrawer,
  ModalHeader,
  FilterMultiselect,
  Modal,
  TextInput,
  InputField,
  Checkbox  
} from "ui-library";
import moment from "moment";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import { colorCodes } from "../../../colorCodes";
import styled from 'styled-components'

const Label = styled.div`
  font-size: 14px;`


const ComplianceFilters = (props: any) => {

  const { branches, skills, handleFilterSubmit, setHideAllPopups, fetchPlannedRouteKpiConfiguration, plannedRouteConfigureKPI, updatePlannedRouteKpiConfiguration, pageLabels } = props;

  const dynamicLabels = useDynamicLabels('driver');
  const d = new Date();
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);

  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBranches, setSelectedBranches] = useState<any>([]);
  const [selectedSkills, setSelectedSkills] = useState<any>([]);
  const [selectedDates, setSelectedDates] = useState<any>({
    startDate: moment(Date()).subtract(7, 'days').format("YYYY-MM-DDT")+"00:00:00Z",
    endDate: moment(Date()).format("YYYY-MM-DDT")+"23:59:59Z",
  });
  const [minDate] = useState<any>(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
  const [maxDate] = useState<any>(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  const [brancheOptions, setBrancheOptions] = useState<any>([]);
  const [skillOptions, setskillOptions] = useState<any>([]);
  const [plannedRouteKPIConfiguration, setPlannedRouteKPIConfiguration] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const [complianceMetric, setComplianceMetric] = useState<any>({})
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [showConfirmationModal, setConfirmationModalVisible] = useState<boolean>(false);

  const handleKpiConfiguration = (plannedRouteKPIConfiguration: object) => {
    const payload = { data: { plannedRouteConfigureKPI: plannedRouteKPIConfiguration } }
    updatePlannedRouteKpiConfiguration(payload);
    setModalVisible(false);
  }

  const handleValueChange = (e: any) => {
    e.persist();
    let value = e.target.value !== "" ? e.target.value : 0;
    Math.sign(value) === -1 ? value = 0 : e.target.value;
    let kpiConfiguartion = { ...plannedRouteKPIConfiguration, [e.target.name]: parseFloat(parseFloat(value).toFixed(2)) }
    setPlannedRouteKPIConfiguration(kpiConfiguartion)
    let values: Array<number> = plannedRouteConfigureKPI && Object.keys(plannedRouteConfigureKPI) && Object.values(plannedRouteConfigureKPI);
    let totalValue = values && values.length && values.reduce((acc: number, val: number) => acc + val, 0).toFixed(2);
    Number(totalValue) === 100 ? setDisabled(false) : setDisabled(true);
    handleTotalChange(kpiConfiguartion);
  }

  const handleTotalChange = (plannedRouteConfigureKPI: object) => {
    let values: Array<number> = plannedRouteConfigureKPI && Object.keys(plannedRouteConfigureKPI) && Object.values(plannedRouteConfigureKPI);
    let totalSum = values && values.length && values.reduce((acc: number, val: number) => acc + val, 0).toFixed(2);
    setTotal(Number(totalSum));
  }

  const handleChange = (date: Date | null | [Date, Date]) => {
    if (date && Object.keys(date).length !== 0) {
      let startDate = moment(date[0]).format("YYYY-MM-DDT")+"00:00:00Z";
      let endDate = moment(date[1]).format("YYYY-MM-DDT")+"23:59:59Z";
      setSelectedDates({ startDate: startDate, endDate: endDate });
    }
  };

  const handleBranchChange = React.useCallback(
    (
      _selctedItem: string,
      _isChecked: boolean,
      listArray: [],
      selectedArray: []
    ) => {
      setSelectedBranches(selectedArray.map((branch: any) => branch.id));
      setBrancheOptions(listArray);
    },
    []
  );

  useEffect(() => {
    setPlannedRouteKPIConfiguration(plannedRouteConfigureKPI);
    handleTotalChange(plannedRouteConfigureKPI);
    setComplianceMetric({
      plannedSequence: plannedRouteConfigureKPI.plannedSequence === 0 || plannedRouteConfigureKPI.plannedSequence < 0 ? false : true,
      onTimeDelivery: plannedRouteConfigureKPI.onTimeDelivery === 0 || plannedRouteConfigureKPI.onTimeDelivery < 0 ? false : true,
      plannedVsActualDistance: plannedRouteConfigureKPI.plannedVsActualDistance === 0 || plannedRouteConfigureKPI.plannedVsActualDistance < 0 ? false : true,
      plannedVsActualTime: plannedRouteConfigureKPI.plannedVsActualTime === 0 || plannedRouteConfigureKPI.plannedVsActualTime < 0 ? false : true,
      missedOrderPenalty: plannedRouteConfigureKPI.missedOrderPenalty === 0 || plannedRouteConfigureKPI.missedOrderPenalty < 0 ? false : true,
      driverOnBreak: plannedRouteConfigureKPI.driverOnBreak === 0 || plannedRouteConfigureKPI.driverOnBreak < 0 ? false : true
    })
    setDisabled(true)
  }, [plannedRouteConfigureKPI])



  useEffect(() => {
    if (!brancheOptions.length) {
      setBrancheOptions(
        branches.map((branch: any) => {
          branch['checked'] = true;
          return branch;
        })
      );
    }

    if (!skillOptions.length) {
      setskillOptions(
        skills.map((skill: any) => {
          skill['checked'] = true;
          return skill;
        })
      );
    }
  }, [branches, skills]);

  useEffect(() => {
    handleFilterSubmit({
      selectedBranches: brancheOptions.map((branch: any) => branch.id),
      selectedSkills: skillOptions.map((skill: any) => skill.value),
      selectedDates: selectedDates,
    });
  }, []);

  const resetFilters = () => {
    setSelectedBranches([]);
    setBrancheOptions(
      branches.map((branch: any) => {
        branch['checked'] = true;
        return branch;
      })
    );
    setskillOptions(
      skills.map((skill: any) => {
        skill['checked'] = true;
        return skill;
      })
    );
    setSelectedSkills([]);
    setSelectedDates({
      startDate: moment(Date()).subtract(7, 'days').format("YYYY-MM-DDT")+"00:00:00Z",
      endDate: moment(Date()).format("YYYY-MM-DDT")+"23:59:59Z",
    });
    setFilterVisible(false);
    handleFilterSubmit({
      selectedBranches: [],
      selectedSkills: [],
      selectedDates: {
        startDate: moment(Date()).subtract(7, 'days').format("YYYY-MM-DDT")+"00:00:00Z",
        endDate: moment(Date()).format("YYYY-MM-DDT")+"23:59:59Z",
      },
    });
  };

  useEffect(() => {
    if (!isFilterVisible) {
      handleFilterSubmit({
        selectedBranches: selectedBranches,
        selectedSkills: selectedSkills,
        selectedDates: selectedDates,
      });
    }
  }, [selectedDates]);

  React.useMemo(() => {
    if (skills && skills.length) {
      skills.splice(0, 0, {
        id: 'UNDEFINED',
        label: 'Not Defined',
        value: 'UNDEFINED',
      });
    }
  }, [skills]);

  const handleSkillChange = React.useCallback(
    (
      _selctedItem: string,
      _isChecked: boolean,
      listArray: [],
      selectedArray: []
    ) => {
      setSelectedSkills(selectedArray.map((skill: any) => skill.value));
      setskillOptions(listArray);
    },
    []
  );

  const handleSubsmit = () => {
    setFilterVisible(false);
    handleFilterSubmit({
      selectedBranches: selectedBranches,
      selectedSkills: selectedSkills,
      selectedDates: selectedDates,
    });
  };

  const getFormattedDate = (date: Date) => {
    const todayTime = date;
    const month = todayTime.getMonth() + 1;
    const day = todayTime.getDate();
    const year = todayTime.getFullYear();
    return day + '/' + month + '/' + year;
  };

  const handleCheckBoxChange = (isChecked: boolean, option: string) => {

    let newComplianceMetric = { ...complianceMetric, [option]: !isChecked };
    let newPlannedRouteKPIConfiguration = !newComplianceMetric[option] ? { ...plannedRouteKPIConfiguration, [option]: 0 } : plannedRouteKPIConfiguration

    setComplianceMetric(newComplianceMetric);
    setPlannedRouteKPIConfiguration(newPlannedRouteKPIConfiguration);
    handleTotalChange(newPlannedRouteKPIConfiguration);
  }

  return (
    <Box display="flex" justifyContent="space-evenly" horizontalSpacing="10px" my='15px'>
      {pageLabels?.buttons.configureKPI && (
      <IconButton
        id="delivery_associate_compliance_analytics--actionbar--configure_kpi"
        intent="page"
        iconVariant="icomoon-setting"
        onClick={() => {
          setModalVisible(true);
          fetchPlannedRouteKpiConfiguration();
        }}
        style={{ marginRight: '10px', minHeight: 32, textTransform: 'capitalize' }}
      >
        {dynamicLabels.Configure_KPI_LABEL_KEY}
      </IconButton>
      )}
      <IconButton
        id="delivery_associate_compliance_analytics--actionbar--filter"
        intent="page"
        iconVariant="icomoon-funel icon-filter"
        onClick={() => { setFilterVisible(true); setHideAllPopups() }}
        style={{ marginRight: '10px', minHeight: 32 }}
      >
        {dynamicLabels.filter}
      </IconButton>

      <div className="global-date" style={{ marginRight: '0', width: 230 }}>
        <DateRangePicker
          onFromChange={handleChange}
          onToChange={handleChange}
          onApply={handleChange}
          variant="daterange"
          tillMaxDate={maxDate}
          showTime={false}
          style={{
            position: 'absolute',
            right: '0px',
          }}
          startDate={minDate}
          endDate={maxDate}
          fromDateFormatter={getFormattedDate}
          toDateFormatter={getFormattedDate}
        >
          {({ value, open, setOpen }: any) => (
            <div>
              <div onClick={() => setOpen(!open)}>
                <TextInput
                  id="someId"
                  name={name}
                  className="someClassname"
                  variant="withIcon"
                  labelColor="text.inputLabel.default"
                  placeholder="Please Click Here"
                  fullWidth
                  value={`${moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`}
                  onChange={() => 'On change clicked'}
                  iconVariant='calendar'
                  iconSize='xs'
                  iconStyle={{ cursor: "pointer", height: 32 }}
                  style={{
                    fontSize: '14px',
                    minHeight: '32px',
                    margin: 0
                  }}
                />
              </div>
            </div>
          )}
        </DateRangePicker>
      </div>
      <FilterDrawer style={{ zIndex: 100000, right: isFilterVisible ? -4 : -10, overflow: "hidden" }} isOpen={isFilterVisible}>
        <Box display="flex" flexDirection="column" fullWidth fullHeight>
          <ModalHeader
            width="400px"
            headerTitle={`${dynamicLabels.analytics} ${dynamicLabels.filter}`}
            handleClose={() => setFilterVisible(false)}
          />

          <Box
            flexGrow={1}
            style={{
              overflow: 'hidden',
              background: colorCodes.white,
              position: 'relative',
            }}
            p="15px"
            fullWidth
          >
            <div className="filter-input">
              <Label>{dynamicLabels.date}</Label>
              <div className="global-date" style={{
                marginTop: "10px"
              }}>
                <DateRangePicker
                  onFromChange={handleChange}
                  onToChange={handleChange}
                  onApply={handleChange}
                  variant="daterange"
                  tillMaxDate={maxDate}
                  showTime={false}
                  style={{
                    background: '#ccc',
                    right: '20px',
                    position: 'fixed'
                  }}
                  startDate={minDate}
                  endDate={maxDate}
                  fromDateFormatter={getFormattedDate}
                  toDateFormatter={getFormattedDate}
                >
                  {({ value, open, setOpen }: any) => (
                    <div>
                      <div onClick={() => { setOpen(!open) }}>
                        <TextInput
                          id="someId"
                          name={name}
                          className="someClassname"
                          variant="withIcon"
                          labelColor="text.inputLabel.default"
                          placeholder="Please Click Here"
                          fullWidth
                          value={`${moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`}
                          onChange={() => 'On change clicked'}
                          iconVariant='calendar'
                          iconSize='xs'
                          iconStyle={{ cursor: "pointer" }}
                          style={{
                            fontSize: '14px',
                            minHeight: '40px',
                            marginTop: '0px'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </DateRangePicker>
              </div>
            </div>
            <div className="filter-input">
              <FilterMultiselect
                id="branches"
                label={dynamicLabels.branches}
                options={brancheOptions}
                onSelectionChange={(
                  id,
                  isChecked,
                  allOptions: any,
                  selectedOptions: any
                ) =>
                  handleBranchChange(id, isChecked, allOptions, selectedOptions)
                }
              />
            </div>
            <div className="filter-input">
              <FilterMultiselect
                id="skills"
                label={dynamicLabels.skillSets}
                options={skillOptions}
                onSelectionChange={(
                  id,
                  isChecked,
                  allOptions: any,
                  selectedOptions: any
                ) =>
                  handleSkillChange(id, isChecked, allOptions, selectedOptions)
                }
              />
            </div>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            p="0 15px 10px"
            style={{ background: colorCodes.white }}
            horizontalSpacing="10px"
            fullWidth
          >
            <IconButton
              id="delivery_associate_compliance_analytics--actionbar--apply"
              iconVariant="icomoon-tick-circled"
              onClick={handleSubsmit}
              primary
            >
              {dynamicLabels.apply}
            </IconButton>
            <IconButton
              id="delivery_associate_compliance_analytics--actionbar--reset"
              iconVariant="icomoon-back"
              onClick={() => resetFilters()}
            >
              {dynamicLabels.reset}
            </IconButton>
          </Box>
        </Box>
      </FilterDrawer>
      {/* DELETE CONFIRMATION MODAL */}
      <Box className="kpi-configuration-modal">
        <Modal open={isModalVisible} onToggle={() => { fetchPlannedRouteKpiConfiguration(); setModalVisible(false) }} width='600px'
          children={{
            header: (
              <ModalHeader
                headerTitle={dynamicLabels.Configure_KPI_LABEL_KEY_DESC}
                handleClose={() => setConfirmationModalVisible(true)}
                imageVariant='icomoon-close'
                headerStyle={{ fontSize: '15px' }}
              />
            ),
            content: (
              <div style={{ fontSize: '14px', borderBottom: "2px solid #eeeeee" }}>
                <div style={{ marginBottom: 15, borderBottom: "1px solid #eeeeee" }}><h5 style={{ fontSize: '15px', margin: "0 0 15px 0", fontWeight: 500, color: '#000000' }}>{`${dynamicLabels.plannedRoute} ${dynamicLabels.Compliance} ${dynamicLabels.Composition}`}</h5></div>
                <Box display="flex" flexDirection="column" style={{ border: "1px solid #c7c7c7" }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" fullWidth={true} pt="15px" pb="15px" style={{ borderBottom: "1px solid #c7c7c7" }}>
                    <span style={{ color: "#000", fontSize: "15px", fontWeight: 500, paddingLeft: 15 }}>{`${dynamicLabels.Compliance} ${dynamicLabels.Parameters}`}</span>
                    <span style={{ color: "#000", fontSize: "15px", fontWeight: 500, paddingRight: 40 }}>{dynamicLabels.WeightagePercentage}</span>
                  </Box>
                  <Box pr="15px" pl="15px" display="flex" flexDirection="column" pt="10px" pb="10px" fullWidth={true} style={{ borderBottom: "1px solid #c7c7c7" }}>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='plannedSequence'
                        name='plannedSequence'
                        onChange={() => handleCheckBoxChange(complianceMetric.plannedSequence, "plannedSequence")}
                        checked={complianceMetric.plannedSequence}
                        label={`${dynamicLabels.Planned} ${dynamicLabels.Sequence}`}
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name='plannedSequence'
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        maxLength={5}
                        min={0}
                        max={100}
                        disabled={!complianceMetric.plannedSequence}
                        value={plannedRouteKPIConfiguration.plannedSequence !== undefined ? plannedRouteKPIConfiguration.plannedSequence : 0}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='onTimeDelivery'
                        name='onTimeDelivery'
                        onChange={() => handleCheckBoxChange(complianceMetric.onTimeDelivery, "onTimeDelivery")}
                        checked={complianceMetric.onTimeDelivery}
                        label={`${dynamicLabels.On} ${dynamicLabels.time} ${dynamicLabels.DELIVER}`}
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name="onTimeDelivery"
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        maxLength={5}
                        min={0}
                        max={100}
                        disabled={!complianceMetric.onTimeDelivery}
                        value={plannedRouteKPIConfiguration.onTimeDelivery !== undefined ? plannedRouteKPIConfiguration.onTimeDelivery : 0}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='plannedVsActualDistance'
                        name='plannedVsActualDistance'
                        onChange={() => handleCheckBoxChange(complianceMetric.plannedVsActualDistance, "plannedVsActualDistance")}
                        checked={complianceMetric.plannedVsActualDistance}
                        label={dynamicLabels.PlannedvsActualDistance}
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name='plannedVsActualDistance'
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        maxLength={5}
                        min={0}
                        max={100}
                        disabled={!complianceMetric.plannedVsActualDistance}
                        value={plannedRouteKPIConfiguration.plannedVsActualDistance !== undefined ? plannedRouteKPIConfiguration.plannedVsActualDistance : 0}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='plannedVsActualTime'
                        name='plannedVsActualTime'
                        onChange={() => handleCheckBoxChange(complianceMetric.plannedVsActualTime, "plannedVsActualTime")}
                        checked={complianceMetric.plannedVsActualTime}
                        label={dynamicLabels.PlannedvsActualTime}
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name='plannedVsActualTime'
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        maxLength={5}
                        min={0}
                        max={100}
                        disabled={!complianceMetric.plannedVsActualTime}
                        value={plannedRouteKPIConfiguration.plannedVsActualTime !== undefined ? plannedRouteKPIConfiguration.plannedVsActualTime : 0}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='missedOrderPenalty'
                        name='missedOrderPenalty'
                        onChange={() => handleCheckBoxChange(complianceMetric.missedOrderPenalty, "missedOrderPenalty")}
                        checked={complianceMetric.missedOrderPenalty}
                        label={dynamicLabels.MissedOrder}
                        defaultValue="missedOrderPenalty"
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name='missedOrderPenalty'
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        maxLength={3}
                        min={0}
                        max={100}
                        value={plannedRouteKPIConfiguration.missedOrderPenalty !== undefined ? plannedRouteKPIConfiguration.missedOrderPenalty : 0}
                        disabled={!complianceMetric.missedOrderPenalty}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>

                    <Box display="flex" alignItems='center' justifyContent="space-between" fullWidth={true}>
                      <Checkbox
                        id='driverOnBreak'
                        name='driverOnBreak'
                        onChange={() => handleCheckBoxChange(complianceMetric.driverOnBreak, "driverOnBreak")}
                        checked={complianceMetric.driverOnBreak}
                        label={dynamicLabels.dayOnBreak}
                        checkboxSize='lg'
                        color="#5698d3"
                      />
                      <InputField
                        name='driverOnBreak'
                        onChange={(e) => handleValueChange(e)}
                        type='number'
                        disabled={!complianceMetric.driverOnBreak}
                        maxLength={3}
                        min={0}
                        max={100}
                        value={plannedRouteKPIConfiguration.driverOnBreak !== undefined ? plannedRouteKPIConfiguration.driverOnBreak : 0}
                        style={{ width: "125px", margin: "7px 0" }}
                        fullWidth={false}
                      />
                      <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                    </Box>
                  </Box>
                  <Box display="flex" pr="15px" pl="15px" alignItems='center' justifyContent="space-between" fullWidth={true}>
                    <h5 style={{ fontSize: "15px", fontWeight: "bold", color: '#000' }}>{dynamicLabels.Total}</h5>
                    <TextInput
                      onChange={() => setTotal(total)}
                      type='number'
                      className="total-input"
                      maxLength={5}
                      min={0}
                      max={100}
                      value={total}
                      disabled={true}
                      error={total !== 100 ? true : false}
                      errorMessage={dynamicLabels.TotalShouldAddUpTo}
                      style={{ width: "125px", margin: "15px 0" }}
                      fullWidth={false}
                    />
                    <span style={{ position: "absolute", marginTop: 0, right: "7%" }}>%</span>
                  </Box>
                </Box>
              </div>
            ),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton id="delivery_associate_compliance_analytics--actionbar--save" iconVariant='icomoon-save' disabled={total !== 100 || isDisabled} primary onClick={() => handleKpiConfiguration(plannedRouteKPIConfiguration)}>{dynamicLabels.save}</IconButton>
                <IconButton id="delivery_associate_compliance_analytics--actionbar--cancel" iconVariant='icomoon-close' iconSize={11} onClick={() => setConfirmationModalVisible(true)}>{dynamicLabels.cancel}</IconButton>
              </Box>

            )
          }}
        />
         <Modal
        open={showConfirmationModal}
        onToggle={() => setConfirmationModalVisible(false)}
        children={{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels.navigationConfirmation}
              handleClose={() => setConfirmationModalVisible(false)}
              imageVariant='close'
            />
          ),
          content: (
            <Label>
              <div>{dynamicLabels.areYouSureYouWantToCancel} {dynamicLabels.anyUnsavedDataWillBeLost}</div>
            </Label>
          ),
          footer: (
            <Box horizontalSpacing='10px' className="configure-kpi-confirm" display='flex' justifyContent='flex-end' p='15px'>
            <IconButton iconVariant='icomoon-tick-circled' primary onClick = {() => {
                fetchPlannedRouteKpiConfiguration(); 
                setModalVisible(false); 
                setConfirmationModalVisible(false)
                }
              } >{dynamicLabels.ok}</IconButton>
            <IconButton iconVariant='icomoon-close' iconSize={11}
              onClick={() => setConfirmationModalVisible(false)}>
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
          )
        }}
        width='600px'       
      />
      </Box>
    </Box>
  );
};

export default ComplianceFilters;
