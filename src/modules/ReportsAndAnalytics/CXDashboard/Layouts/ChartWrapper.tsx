import React, { useEffect, useMemo, useState } from "react";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import {
  Card,
  FontIcon,
  ButtonGroup,
  IconButton,
  Box,
  MultiSelect,
  IMultiSelectOptions,
  Tooltip,
  Button,
  Position,
  SectionHeader,
} from "ui-library";
import { ChartGrid } from "./StaticLayout.style";
import ChartCard from "./ChartCard";
import {
  IChartData,
  IChartLegendData,
  tActionCard,
} from "../CXDashboard.model";
import { colorCodes } from "../../../Analytics/colorCodes";


interface Props {
  id: tActionCard;
  data:
    | {
        overallPerc: IChartData[];
        overallCount: IChartData[];
        byShipperPerc: IChartData[];
        byShipperCount: IChartData[];
      }
    | {};
  legendData: IChartLegendData[];
  lineData: { [key: string]: number | undefined }[];
  onChartChange: () => void;
  tinyChartTitleList: any[];
  xAxisLabel: { [key: string]: string };
  yAxisLabel: { [key: string]: string };
  tooltipData: Array<string>;
  handleSelectedRecords?: any;
  showMultiselect?: boolean;
  optionsList?: any;
  saveSvgAsPng?:any;
  header;
  pageName : string
}

const ChartWrapper = ({
  id,
  data,
  legendData,
  lineData,
  onChartChange,
  tinyChartTitleList,
  xAxisLabel,
  yAxisLabel,
  tooltipData,
  handleSelectedRecords,
  showMultiselect,
  optionsList = [],
  saveSvgAsPng,
  header,
  pageName
  
}: Props) => {
  const [chartMode, setChartMode] = useState("OVERALL");
  const [chartDisplayDataMode, setChartDisplayDataMode] = useState("numbers");
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.common}`);
  const [legends, setLegends] = useState(legendData);

  const [options, setOptions] = useState<IMultiSelectOptions[]>(optionsList);
  const [selectedRecords, setSelectedRecords] = useState<IMultiSelectOptions[]>(
    optionsList
  );

  useEffect(() => {
    const modifiedLegends = [...legends].map((legend) => {
      legend.value = 0;
      return legend;
    });
    setLegends([...modifiedLegends]);
  }, [chartMode]);

  useEffect(() => {
    setLegends(legendData);
  }, [legendData]);

  const chartButtonOptions = useMemo(
    () => [
      {
        id: "OVERALL",
        label: dynamicLabels.overall || "Overall",
        selected: chartMode === "OVERALL",
      },
      {
        id: "BYSHIPPER",
        label: dynamicLabels.byshipper || "By Shipper",
        selected: chartMode === "BYSHIPPER",
      },
    ],
    [chartMode]
  );
  const chartDisplayData = useMemo(
    () => [
      {
        id: "numbers",
        label: <FontIcon variant="icon icon-ry-numbers" size={13} />,
        selected: chartDisplayDataMode === "numbers",
      },
      {
        id: "percentage",
        label: <FontIcon variant="icon icon-ry-percentage" size={13} />,
        selected: chartDisplayDataMode === "percentage",
      },
    ],
    [chartDisplayDataMode]
  );

  return (
    <Card>
      <ChartGrid>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignSelf: "center", fontSize: "13px" }}>{header}</div>
          <div
            style={{
              alignSelf: "flex-end",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <ButtonGroup
              data={chartButtonOptions}
              onChange={(id) => setChartMode(id)}
              width={"80px"}
            />
            <Box
              display="flex"
              justifyContent="space-evenly"
              horizontalSpacing="10px"
            >
              {showMultiselect && (
                <Position type="relative">
                  <MultiSelect
                    id="Colors"
                    width={"300px"}
                    options={options}
                    onChange={(
                      _event,
                      value,
                      _isChecked,
                      selectedArray: any
                    ) => {
                      setSelectedRecords(selectedArray);
                      handleSelectedRecords(selectedArray);
                    }}
                    style={{
                      position: "absolute",
                      top: "45px",
                      right: "0px",
                      zIndex: 9,
                      backgroundColor: colorCodes.white,
                    }}
                    isLoading={false}
                    isNoOption={false}
                    menuOpen={false}
                    selected={selectedRecords}
                    allowSelectAll={false}
                  >
                    {({ isMenuOpen, openMenu }) => (
                      <Tooltip
                        message={`${
                          dynamicLabels.selectRecords
                            ? dynamicLabels.selectRecords
                            : "Select Records"
                        }`}
                        hover={true}
                        messagePlacement="end"
                      >
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
                              {dynamicLabels.selected || "Selected"}:
                              {selectedRecords.length
                                ? `${selectedRecords[0].label},  ${
                                    selectedRecords.length - 1
                                  } ${dynamicLabels.More}`
                                : ""}
                            </span>
                            <FontIcon
                              style={{
                                fontSize: "9px",
                                height: "9px",
                                lineHeight: "9px",
                              }}
                              variant={
                                isMenuOpen ? "triangle-up" : "triangle-down"
                              }
                              size="xs"
                            />
                          </React.Fragment>
                        </Button>
                      </Tooltip>
                    )}
                  </MultiSelect>
                </Position>
              )}
              <div style={{ display: "flex" }}>
                <IconButton
                  intent="page"
                  onlyIcon
                  iconVariant="icomoon-download"
                  iconSize="sm"
                  onClick={() => {saveSvgAsPng(id,"recharts-surface",id)}}
                  className="overALlSummaryDownloadBtn"
                  id={`${pageName}-actionbar-download`}
                />
               
              </div>
            </Box>
          </div>
        </div>
        <Box style={{ margin: "50px 0" }} id={id}>
          <ChartCard
            id={id}
            dataType={chartDisplayDataMode}
            mode={chartMode as string}
            xAxisLabel={xAxisLabel[chartMode]}
            yAxisLabel={yAxisLabel[chartDisplayDataMode]}
            data={data}
            onChartChange={onChartChange}
            lineData={lineData}
            legendData={legends}
            tinyChartTitleList={tinyChartTitleList}
            tooltipData={tooltipData}
          />
        </Box>
      </ChartGrid>
    </Card>
  );
};

export default React.memo(ChartWrapper);
