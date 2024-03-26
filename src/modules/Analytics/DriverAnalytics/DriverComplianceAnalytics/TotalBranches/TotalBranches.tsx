import React, { useState, useEffect, useRef } from "react";
import { Card, Box, IconButton, BarChart, Loader, Position, MultiSelect, IMultiSelectOptions, Tooltip, FontIcon, Button } from "ui-library";
import { getKPInameBySlug } from "../../../../../utils/helper";
import DownloadReportModal from "../DownloadReportModal";

import { colorCodes } from "../../../colorCodes";

export interface IOptions {
  value: string;
  label: string;
}

export interface IKpis {
  clientId: number;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientRefMasterId: string;
  clientRefMasterType: string;
  id: number;
  isDeleteFl: string;
  label: string;
  name: string;
  value: string;
}

const TotalBranches = (props: any) => {
  const [isReportModalVisible, setReportModalVisible] = useState<boolean>(false);
  const {
    totalBranchCompliance,
    getBranchDeliveryAssociateComplainceSummary,
    handleComplianceReportDownload,
    branchDeliveryAssociateComplianceSummaryData,
    cardDetails,
    clientId,
    kpiList,
    filterData,
    dynamicLabels,
    fetchTotalBranchCompliance,
    isLoading,
    reLoadComponent
  } = props;

  const [selectedKPIs, setSelectedKPIs] = useState<IMultiSelectOptions[]>([]);
  const [selectedKPICode, setSelectedKPICode] = useState<string | undefined>('');
  const [kpiListOption, setKpiListOption] = useState<any>([]);

  const { selectedDates, selectedSkills } = filterData;

  const totalBranchComplianceLength = Object.keys(totalBranchCompliance).length;

  useEffect(() => {
    if(selectedKPIs.length) {
      selectedKPIs && fetchTotalBranchCompliance(selectedKPICode);
    }
  }, [selectedKPIs, filterData, selectedKPICode]);

  useEffect(() => {
    (reLoadComponent && selectedKPIs) && fetchTotalBranchCompliance(selectedKPICode);
  }, [reLoadComponent]);

  useEffect(() => {
    if (
      selectedKPIs &&
      totalBranchComplianceLength &&
      totalBranchCompliance.branchData.length
    ) {
      getBranchDeliveryAssociateComplainceSummary({
        startDate:
          selectedDates &&
          Object.keys(selectedDates).length !== 0 &&
          selectedDates.startDate,
        endDate:
          selectedDates &&
          Object.keys(selectedDates).length !== 0 &&
          selectedDates.endDate,
        branches: [totalBranchCompliance.branchData[0].branchId],
        dmType: selectedSkills,
        clientId: clientId,
        kpiList: [totalBranchCompliance.kpiCode],
        rangeMin: 0,
        rangeMax: 0,
        requestFor: "totalBranch",
      });
    }
  }, [totalBranchCompliance]);

  useEffect(() => {
    if (!kpiListOption.length) {
      let kpis = kpiList.filter((option:IKpis) => option.clientRefMasterCd !== "actualBreakDuration")
      const tempOptions = Object.keys(kpis).map((key) => {
        kpiList[key]["value"] = kpiList[key].clientRefMasterCd;
        kpiList[key]["label"] = kpiList[key].clientRefMasterDesc;
        return kpiList[key];
      }).slice(1, kpiList.length - 1)
      setKpiListOption(tempOptions);
    }
  }, [kpiList]);

  useEffect(() => {
    if(!!kpiList) {
      const planneRouteKpi = kpiList.filter((kpi: any) => kpi.clientRefMasterCd === 'plannedRoute');
      setSelectedKPIs(planneRouteKpi);
      setSelectedKPICode('plannedRoute')
    }
  },[kpiList]);

  const kpiName =
    totalBranchComplianceLength &&
    getKPInameBySlug(totalBranchCompliance.kpiCode).name;
  const avgKpiCompliance =
    totalBranchComplianceLength && totalBranchCompliance.avgKpiCompliance;
  const avgTotalCompliance = cardDetails.avgTotalCompliance;
  totalBranchComplianceLength &&
    totalBranchCompliance.branchData.sort(
      (a: { kpiCompliance: number }, b: { kpiCompliance: number }) =>
        b.kpiCompliance - a.kpiCompliance
    );


    const branchData = React.useMemo(() =>       
      totalBranchComplianceLength &&
      totalBranchCompliance.branchData.map((branch: any) => {
        return {
          branchId: branch.branchId,
          name: branch.branchName,
          [dynamicLabels.TotalCompliance]:
            cardDetails.totalComplianceForBranches[branch.branchId],
          [kpiName]: branch.kpiCompliance,
          [dynamicLabels.Avg + " " + kpiName]: avgKpiCompliance,
          [dynamicLabels.avgTotalCompliance]: avgTotalCompliance,
        };
      })
    ,[totalBranchCompliance.branchData])

  const branchTinyChartData =
    totalBranchComplianceLength &&
    totalBranchCompliance.branchData.sort().map((branch: any) => {
      return {
        [kpiName]: branch.kpiCompliance,
        [dynamicLabels.TotalCompliance]:
          cardDetails.totalComplianceForBranches[branch.branchId],
      };
    });


  const branchLegendData = [
    {
      name: dynamicLabels.avgTotalCompliance,
      value: avgTotalCompliance,
      color: colorCodes.yellow,
      active: true,
    },
    {
      name: dynamicLabels.TotalCompliance,
      color: colorCodes.blue,
      active: true,
      value: 0,
    },
    {
      name: dynamicLabels.Avg + " " + kpiName,
      value: avgKpiCompliance,
      color: colorCodes.legendBlue,
      active: true,
    },
    {
      name: kpiName,
      color: colorCodes.red,
      value: 0,
      active: true,
    },
  ];

  const branchTinyChartTitleList = [dynamicLabels.TotalCompliance, kpiName];
  const barChartLineData: object[] = [];

  const kpiCode =
    Object.keys(branchDeliveryAssociateComplianceSummaryData).length !== 0 &&
    getKPInameBySlug(branchDeliveryAssociateComplianceSummaryData.kpiCode).name;

  const associateChartData =
    Object.keys(branchDeliveryAssociateComplianceSummaryData).length !== 0 &&
    branchDeliveryAssociateComplianceSummaryData.listOfKPIDetails.map(
      (associate: any) => {
        return {
          name: associate.deliveryAssociateName,
          [dynamicLabels.TotalCompliance]:
            cardDetails.deliveryAssociateTotalCompliance.find((da: { deliveryAssociateId: string; }) => da.deliveryAssociateId === associate.deliveryAssociateId)?.kpiAchievment,
          [kpiCode]: associate.kpiAchievment,
          [dynamicLabels.Avg + " " + kpiCode]: avgKpiCompliance,
          [dynamicLabels.avgTotalCompliance]: cardDetails.avgTotalCompliance,
          deliveryAssociateId: associate.deliveryAssociateId,
        };
      }
    );

  const associateLegendData = [
    {
      name: dynamicLabels.avgTotalCompliance,
      value: cardDetails.avgTotalCompliance,
      color: colorCodes.yellow,
      active: true,
    },
    {
      name: dynamicLabels.TotalCompliance,
      color: colorCodes.blue,
      active: true,
      value: 0,
    },
    {
      name: dynamicLabels.Avg + " " + kpiCode,
      value: avgKpiCompliance,
      color: colorCodes.legendBlue,
      active: true,
    },
    {
      name: kpiCode,
      color: colorCodes.red,
      value: 0,
      active: true,
    },
  ];

  const associateChartLineData = [{ avgPlanned: 50 }, { planned: 24 }];
  const associateTinyChartTitleList = [dynamicLabels.TotalCompliance, kpiCode];

  const associateTinyChartData =
    Object.keys(branchDeliveryAssociateComplianceSummaryData).length !== 0 &&
    branchDeliveryAssociateComplianceSummaryData.listOfKPIDetails
      .sort()
      .map((associate: any) => {
        return {
          name: associate.deliveryAssociateName,
          [dynamicLabels.TotalCompliance]: cardDetails.deliveryAssociateTotalCompliance.find((da: { deliveryAssociateId: string; }) => da.deliveryAssociateId === associate.deliveryAssociateId)?.kpiAchievment,
        };
      });

    const DAcomplianceRef = useRef<HTMLDivElement>(null); 

    const handleBranchComplianceScroll = () => {
      DAcomplianceRef?.current?.scrollIntoView({behavior: "smooth"});
    }

  return (
    <>
      <div style={{ width: "100%", height: "auto", position: "relative" }}>
        {totalBranchCompliance && totalBranchCompliance.branchData && totalBranchCompliance.branchData.length !== 0 ? (
          <Card
            style={{
              flexGrow: 1,
              backgroundColor: colorCodes.white,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              style={{ width: "100%" }}
              mb="70px"
              mt="10px"
            >
              <div className="chart-label">
                {dynamicLabels.branch} {dynamicLabels.Compliance}{" "}
                {dynamicLabels.summary}
              </div>

              {/* Page Action Buttons */}
              <Box
                display="flex"
                justifyContent="space-evenly"
                horizontalSpacing="10px"
                className="totalOrdersKpi branchComplianceDropdown"
                >
                <Position type="relative">
                <MultiSelect
                  id="Colors"
                  width={"300px"}
                  options={kpiListOption}
                  onChange={(_event, value, _isChecked, selectedArray: any) => { 
                      const selectedDataTemp = selectedArray.filter((a: any) => !selectedKPIs.includes(a));                    
                      setSelectedKPIs(selectedDataTemp)
                      setSelectedKPICode(value);
                  }}
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0px",
                    zIndex: 9,
                    backgroundColor: colorCodes.white
                  }}
                  isLoading={false}
                  isNoOption={false}
                  menuOpen={false}
                  selected={selectedKPIs}
                  allowSelectAll={false}
                >
                  {({ isMenuOpen, openMenu }) => (
                  <Tooltip message={`${dynamicLabels.selectKpi}`} hover={true} messagePlacement='end'>
                    <Button
                      id="id"
                      variant="button"
                      onClick={() => {
                        openMenu(!isMenuOpen);
                      }}
                      style={{
                        height: "34px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px",
                      }}
                    >
                      <React.Fragment>
                        <span>
                          {dynamicLabels.KPI}: {dynamicLabels.TotalCompliance}
                          {selectedKPIs.length
                            ? `,  ${selectedKPIs.length} ${dynamicLabels.More}`
                            : ""}
                        </span>
                        <FontIcon
                          style={{
                            fontSize: '9px',
                            height: '9px',
                            lineHeight: "9px"
                          }}
                          variant={isMenuOpen ? "triangle-up" : "triangle-down"}
                          size="xs"
                        />
                      </React.Fragment>
                    </Button>
                    </Tooltip>
                  )}
                </MultiSelect>
              </Position>
                <IconButton
                  id="DACompliance-Download-Branches"
                  intent="page"
                  onlyIcon
                  iconVariant="icomoon-download"
                  iconSize={16}
                  onClick={() => setReportModalVisible(true)}
                  className="overALlSummaryDownloadBtn"
                />
              </Box>
            </Box>
            {isReportModalVisible &&
              <DownloadReportModal
                title={`${dynamicLabels.download} ${dynamicLabels.report}`}
                handleClose={setReportModalVisible}
                handleComplianceReportDownload={handleComplianceReportDownload}
                selectedKPIs={kpiListOption}
                complianceReport={true}
                trackingReport={false}
                complianceReportButtonTitle={`${dynamicLabels.branch} ${dynamicLabels.Compliance} ${dynamicLabels.summary}`}
                position={{ right: "0px", top: "50px" }}
                dynamicLabels={dynamicLabels}
              />
            }
            <BarChart
              details={branchData}
              barGap={0}
              labelAngle={330}
              showXaxis={true}
              xAxisLabel={dynamicLabels.branches}
              yAxisLabel={`${dynamicLabels.Achievement} (%)`}
              legendData={branchLegendData}
              lineData={barChartLineData}
              showYaxis={true}
              height={650}
              toolTipVariant="withKpi"
              tinyChartData={branchTinyChartData}
              tinyChartTitleList={branchTinyChartTitleList}
              onChange={(e: any) => console.log(e)}
              tinyChartLabelAngle={330}
               showTinyChart={branchData.length >= 20 ? true : false}
              magnifierEndIndex={branchData.length > 30 ? 30 : branchTinyChartData.length}
              onClick={(e: any) => {
                getBranchDeliveryAssociateComplainceSummary({
                  startDate:
                    selectedDates &&
                    Object.keys(selectedDates).length !== 0 &&
                    selectedDates.startDate,
                  endDate:
                    selectedDates &&
                    Object.keys(selectedDates).length !== 0 &&
                    selectedDates.endDate,
                  branches: [e.branchId],
                  dmType: selectedSkills,
                  clientId: clientId,
                  kpiList: [selectedKPICode],
                  rangeMin: 0,
                  rangeMax: 0,
                  requestFor: "totalBranch",
                })
                handleBranchComplianceScroll();
                }
              }
              tooltipTitleList={[
                `${dynamicLabels.KPI}:`,
                `${dynamicLabels.branch}:`,
                `${dynamicLabels.Achievement}:`
              ]}
            />
          </Card>
        ) : (
            <Card
              style={{
                flexGrow: 1,
                backgroundColor: colorCodes.white,
                overflow: "hidden",
                width: "100%",
                height: "500px",
                marginTop: 0,
              }}
            ></Card>
          )}
        {totalBranchComplianceLength && associateChartData.length ? (
        <div ref={DAcomplianceRef}>
          <Card
            style={{
              flexGrow: 1,
              backgroundColor: colorCodes.white,
              overflow: "hidden",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              style={{ width: "100%" }}
              mb="70px"
              mt="10px"
            >
              <div className="chart-label">
                {dynamicLabels.deliveryMedium} {dynamicLabels.Compliance}{" "}
                {dynamicLabels.summary}
              </div>
            </Box>
            <BarChart
              details={associateChartData}
              barGap={0}
              labelAngle={330}
              showXaxis={true}
              xAxisLabel={dynamicLabels.deliveryMedium}
              yAxisLabel={`${dynamicLabels.Achievement} (%)`}
              legendData={associateLegendData}
              lineData={associateChartLineData}
              showYaxis={true}
              height={650}
              toolTipVariant="withKpi"
              tinyChartData={associateTinyChartData}
              tinyChartTitleList={associateTinyChartTitleList}
              onChange={() => console.log()}
              tinyChartLabelAngle={330}
              showTinyChart={associateChartData.length >= 20 ? true : false}
              magnifierEndIndex={associateChartData.length > 30 ? 30 : associateTinyChartData.length}
            />
          </Card>
        </div>
        ) : (
          <div ref={DAcomplianceRef}>
            <Card
              style={{
                flexGrow: 1,
                backgroundColor: colorCodes.white,
                overflow: "hidden",
                width: "100%",
                marginTop: "15px",
              }}
            >
              {totalBranchComplianceLength && (
                <Box
                  display="flex"
                  justifyContent="center"
                  style={{ width: "100%" }}
                  mb="20px"
                  mt="20px"
                >
                  <div>
                    {dynamicLabels.noDataAvailableFor}{" "}
                    {dynamicLabels.deliveryAssociate} {dynamicLabels.Compliance}{" "}
                    {dynamicLabels.summary}
                  </div>
                </Box>
              )}
            </Card>
          </div>
          )}
        {isLoading && <Loader center={true} fadeBackground={true} speed={1} />}
      </div>
    </>
  );
};

export default TotalBranches;
