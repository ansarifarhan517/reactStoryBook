import React, { useState, useEffect, Dispatch } from "react";
import { SectionHeaderContainer,  PolygonMapWrapper, ZoneListViewWrapper, SectionWrapper, StyledButtonGroup,ServiceAreaWrapper} from "../../BranchConfigurationStyledComponents";
import { Grid, SectionHeader, Card, IconButton, Box, Tooltip, LeafletMap, IListViewColumn, useToast, IFetchDataOptions } from "ui-library";
import { IBranchZones, ILocalStorageEntries } from "../../BranchConfiguration.models";
import FormField from "../../../../../utils/components/Form/FormField";
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import Settings from "./setting";
import PolygonMapComponent from '../../../../../utils/components/Map/PolygonMap';
import MapDefault from '../../../../../utils/components/Map/MapDefault';
import iconsMapping from "../../../../../utils/mongo/ListView/actionBarIcons.mapping";
import EditPopUp from "../../../../Terriotory/TerritoryListView/SubComponents/Popups/EditPopup";
import { getGoogleAPIKey } from "../../../../../utils/components/Map/MapHelper";
import infowindowStructure from "../../../../../utils/map/infowindow.config";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { BranchConfigurationActions } from "../../BranchConfiguration.actions";
import RateChartModal from './RateChartModal'
import ErrorBoundary from '../../../../../utils/components/Form/ErrorBoundary'
import { useForm } from "react-hook-form";
const FALLBACK_CENTER = [37.09024, -95.71289100000001];
interface IServiceAreaProps {
  dynamicLabels: any;
  // formInstance: any;
  isEditMode:boolean
}
export type tVariant = "button" | "link";
const GOOGLE_API_KEY = getGoogleAPIKey();

const ServiceArea = (props: IServiceAreaProps) => {
  const userAccessInfo: ILocalStorageEntries = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const _center = userAccessInfo?.["countryLatLng"]?.split(",").map((x:string)=> parseFloat(x)) || FALLBACK_CENTER;
  const toast = useToast();
  const { dynamicLabels , isEditMode} = props;
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });
  const { setValue, getValues, setError, clearErrors } = formInstance;
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const structure = useTypedSelector( (state) => state.branchConfiguration.form.serviceZones);
  const zonesColumnSelector = useTypedSelector((state) =>state.branchConfiguration.form.serviceZonesRateProfileListStructure.columns);
  const actionBarButtons = useTypedSelector((state) =>state.branchConfiguration.form.serviceZonesRateProfileListStructure.buttons);
  const zonesRowSelector = useTypedSelector((state) => state.branchConfiguration.form.branchZones);
  const zonesSelectedRowSelector = useTypedSelector((state) => state.branchConfiguration.form.selectedZone);
  const isZoneEditMode = useTypedSelector((state) => state.branchConfiguration.form.editSelectedZone);
  const branchRateProfile = useTypedSelector((state) => state.branchConfiguration.form.branchZoneRateProfiles);
  const zonePolygonData = useTypedSelector((state) => state.branchConfiguration.form.branchZones);
  const selectedZone= zonesSelectedRowSelector && zonesSelectedRowSelector?.length ? Object.values(zonesSelectedRowSelector[0]):[];
  const [zoom, setZoom] = useState<number>(6);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [zonesColumn, setZonesColumn] = useState<IListViewColumn[]>([]);
  const [editModeCenter, setEditModeCenter]= useState<any>(_center)
  const [addModeCenter]= useState<any>(_center)
  const [addAndContinue, setAddAndContinue]= useState<boolean>(false)
  const [load, setLoad]=useState<boolean>(false)
  const [loadListView, setLoadListView]=useState<boolean>(false)
  const [openRateChartModal, setOpenRateChartModal] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(true);
  const [mandatoryfields, setMandatoryFields] = useState<string[]>([]);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [isIntersection, setIsIntersection] = useState<boolean>(false);
  const [filterZonesRowSelector, setfilteredZonesRowSelector]= useState<any>(zonesRowSelector)
  const sectionKeys = structure ? Object.keys(structure) : [];
  const options = [{ id: "zone", label: "Zone", selected: true }];
  const editLayer = {
    permission: isZoneEditMode && !listView,
    data:
    isZoneEditMode && !listView && zonesSelectedRowSelector?.length
        ? selectedZone
        : [zonePolygonData?.[0]],
    newCoordinateKey: "coordinate",
    orinalCoordinatesKey: "polygonCoordinates",
  };

  const polyGeoFenceSampleData = {
    permission: true,
    data:
      isZoneEditMode && !listView && zonesSelectedRowSelector?.length
        ? zonePolygonData.filter((zones:any)=> zones.zoneName!==selectedZone[0].zoneName)
        : zonePolygonData,
    popupRef: "polygonZone",
    toolTipKey: "geofenceName",
    colorKey: "color",
    positionCoordinateKey: "polygonCoordinates",
    createPermission: !listView,
    styleKey: {
      smoothFactor: "smoothFactor",
      fillColor: "fillColor",
      fillOpacity: "fillOpacity",
    },
    ...(isZoneEditMode && !listView ? { editLayer: editLayer } : null),
  };
 
  const handleIconClick = () => {
     setOpenRateChartModal(true);
  };
  const setRateProfileData = (data: any) => {
    setOpenRateChartModal(!openRateChartModal);
    setValue("zoneRateProfile", data?.zoneRateProfile?.length);
  };
  
// ************** List View functions start here
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    console.log("pageSize", pageSize,"pageNumber", pageNumber,"sortOptions", sortOptions, "filterOptions",filterOptions,"apis", apis)
    if(filterOptions && filterOptions.searchText){
      let filterKey= filterOptions.searchBy;
      let filterData= zonesRowSelector.filter((zones:any)=> zones[filterKey || 'zoneName'] == filterOptions.searchText)
      setfilteredZonesRowSelector(filterData)
    }
    else {
      setfilteredZonesRowSelector(zonesRowSelector)
    }
   }, [zonesRowSelector])
 
  

  const buttonList = React.useMemo(() => {
    const buttonArray: any = [];
    actionBarButtons &&
      Object.keys?.(actionBarButtons)?.forEach((buttonKey) => {
        if (actionBarButtons?.[buttonKey]?.permission) {
          buttonArray.push(buttonKey);
        }
      });
    return buttonArray;
  }, [actionBarButtons]);


  const onRowSelect = React.useCallback((zone: any) => {
    dispatch({
      type: "@@branchConfiguration/SET_SELECTED_ZONE",
      payload: zone,
    });
  }, []);

  const handleActionBarButtonClick = (id: string) => {
    switch (id) {
      case "update":
        // const zoneRateProfile:IBranchZonesRateProfile =zonesSelectedRowSelector[0]?.zoneRateProfile
          dispatch({
            type: "@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES",
            payload: zonesSelectedRowSelector[0].zoneRateProfile || [],
          });
          dispatch({
            type: "@@branchConfiguration/SET_IS_ZONE_EDITABLE",
            payload: true,
          });
          setListView(false);
        break;
        case "delete":
          dispatch({
            type: "@@branchConfiguration/DELETE_SELECTED_ZONE",
            payload: zonesSelectedRowSelector,
          });
          setLoadListView(true)
          setTimeout(()=>{
          toast.add(dynamicLabels.branchZoneDeletedSucessfully || "Zone (s) deleted successfully", "success", false);
          setLoadListView(false)
        },100)
          zonesSelectedRowSelector?.length==0 ? setListView(false) : setListView(true);
        break;
    }
  };

  const isUpdateEnable= zonesSelectedRowSelector?.length != 1 || Object.values(zonesSelectedRowSelector[0])?.length != 1
  const isDeleteEnable= zonesSelectedRowSelector?.length == 0 || Object.values(zonesSelectedRowSelector[0])?.length == 0
  const enableStatus = {
      update: isUpdateEnable,
      delete: isDeleteEnable,
  }

  // ************** List View functions ends here 


  const validateForm = () => {
    let currentFormData = getValues();
    const filteredZones= zonesRowSelector.filter(zone=> zone.zoneName!==selectedZone?.[0]?.zoneName)
    const doesZoneExist= filteredZones.find(zone=> zone.zoneName==currentFormData.zoneName)
    sectionKeys.forEach((key) => {
      Object.keys(structure[key]).forEach((fieldName) => {
        const meta = structure[key][fieldName];
        if (meta.required && meta.permission) {
          !mandatoryfields.includes(fieldName)? mandatoryfields.push(fieldName):null;
          setMandatoryFields(mandatoryfields);
        }
      });
    });
   
    mandatoryfields.map((field: string) => {
      if (currentFormData[field] == "") {
        setError(field, { type: "required" });
        setFormValid(false);
        return;
      } else if (coordinates?.length == 0) {
        toast.add("Draw a territory to continue", "warning", false);
        setFormValid(false);
        return;
      } else if (field=='zoneName' && doesZoneExist?.zoneName==currentFormData.zoneName){
        setError('zoneName', { type: "required" });
        toast.add(dynamicLabels.zoneNameAlreadyExists, "warning", false);
        setFormValid(false);
        return;
      }
       else {
        if(!isIntersection){
          setFormValid(true);
        }
        else{
          setFormValid(false);
          toast.add("Overlaps not allowed!", "warning", false);
        }
      }
    });
  };

  const submit = () => {
    if(isZoneEditMode){
    }
      if (formValid) {
        let currentFormData = getValues();
        let coordinatesCopy= coordinates.slice(0, coordinates?.length-1)
        const isPolyIntersected = ((coordinates[0].latitude == coordinates[coordinates?.length-1].latitude) && (coordinates[0].longitude == coordinates[coordinates.length-1].longitude)) 
        const coOrdds= isPolyIntersected && coordinates?.length > 3 ? coordinatesCopy : coordinates;
        let polygonNewCorordinates = isPolyIntersected  ? coordinates:   [...coordinates, {
          latitude: coordinates[0].latitude, 
          longitude: coordinates[0].longitude}
        ];
        let payload = {
          ...( isZoneEditMode && isEditMode  ? selectedZone[0] : null),
          zoneCreationPreference: "Territory",
          zoneName: currentFormData.zoneName,
          zoneDescription: currentFormData.zoneDescription,
          coords: coOrdds?.map((cor: any) => {
            return {
              lat: cor[0] || cor.latitude,
              lng: cor[1] || cor.longitude,
            };
          }),
          shapeTypeCode: "Polygon",
          geofenceName: currentFormData.zoneName,
          zoneType: "GEOFENCE",
          lstZoneGeofence:isZoneEditMode && isEditMode? [{ ...selectedZone[0]?.lstZoneGeofence?.[0] , polygonCoordinates: polygonNewCorordinates}] : [{ polygonCoordinates: polygonNewCorordinates}],
          zoneRateProfile: !isEditMode? branchRateProfile: branchRateProfile,
          polygonCoordinates:polygonNewCorordinates
        };
        dispatch({
          type: "@@branchConfiguration/SET_CREATED_ZONES",
          payload: payload,
        });
        reSetFromValues()
        if(addAndContinue){
          setCoordinates([])
          setLoad(true)
          setTimeout(()=>{
            setLoad(false)
          },100)
          setFormValid(false);
        }
        else{
          dispatch({
            type: "@@branchConfiguration/SET_IS_ZONE_EDITABLE",
            payload: false,
          });
          setListView(true);
          setFormValid(false);
        }
      }
  };
  const setFormValues = () => {
    const current:IBranchZones = selectedZone?.[0];
      setValue('zoneName', current.zoneName)
      setValue('zoneDescription', current.zoneDescription)
      setValue('zoneRateProfile', current.zoneRateProfile?.length || 0)
      setCoordinates(current?.polygonCoordinates||[])
      setEditModeCenter([current?.polygonCoordinates?.[0].latitude, current?.polygonCoordinates?.[0].longitude] || _center)
      dispatch({ type: '@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES', payload: current.zoneRateProfile || [] });
  };
  const reSetFromValues =()=>{
    clearErrors();
    setValue('zoneName','')
    setValue('zoneDescription','')
    setValue('zoneRateProfile', '')

    setCoordinates([])
    dispatch({ type: '@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES', payload: [] });
    dispatch({type: "@@branchConfiguration/SET_SELECTED_ZONE", payload: {}});
    dispatch({ type: "@@branchConfiguration/SET_IS_ZONE_EDITABLE", payload: false});
  }

  

  useEffect(()=>{
    if(zonesRowSelector && zonesRowSelector?.length==0 && !isEditMode){
      setListView(false)
    }
    else{
      if(!addAndContinue){
        setListView(true)
      }
      setfilteredZonesRowSelector(zonesRowSelector)
    }
  }, [zonesRowSelector])

  useEffect(() => {
    const mongoStructure = zonesColumnSelector;
    if (Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "branchConfiguration",
        {}
      );
      setZonesColumn(newColumns);
    }
  }, [zonesColumnSelector]);

  useEffect(() => {
    if (formValid) {
        submit();
    }
  }, [formValid]);

  useEffect(() => {
    if (isZoneEditMode && !listView) {
      setFormValues();
      // setZoom(8);
    } else {
      setZoom(6);
   }
  }, [isZoneEditMode]);

  return (
    <div>
      <RateChartModal
        open={openRateChartModal}
        handleClose={() => {setOpenRateChartModal(!openRateChartModal); setValue("zoneRateProfile", branchRateProfile?.length)}}
        handleOK={(data: any) => setRateProfileData(data)}
        isZoneEditMode={isZoneEditMode}
        isFormEditMode={isEditMode}
      />
      <SectionHeaderContainer>
        <SectionHeader headerTitle={ dynamicLabels?.["carrierBranchServiceZone"] || "Carrier Branch Service Area" }/>
      </SectionHeaderContainer>
      <StyledButtonGroup data={options} />
      <ServiceAreaWrapper>
        <Grid container>
          {listView && (
            <>
              <Grid container md={12} xs={12} style={{ justifyContent: "flex-end", marginBottom: "10px" }}>
                <IconButton
                  iconSize="xs"
                  iconVariant="icomoon-add"
                  style={{ padding: "0px 15px", textTransform: "uppercase" }}
                  onClick={() => setListView(false)}
                >
                  {dynamicLabels.add}
                </IconButton>
              </Grid>
              <Grid item md={6} xs={12}>
               {!loadListView && <ZoneListViewWrapper
                  style={{
                    height: "100%",
                    boxShadow: "0 2px 20px -10px #000",
                    padding: "10px 10px 0",
                  }}
                  rowIdentifier="zoneName"
                  columns={zonesColumn}
                  data={filterZonesRowSelector}
                  totalRows={filterZonesRowSelector?.length}
                  onFetchData={handleFetchData}
                  loading={false}
                  isColumnLoading={false}
                  isEditMode={false}
                  hasRowSelection={false}
                  hasRowSelectionWithEdit={
                    actionBarButtons?.["InlineEdit"]?.permission
                  }
                  hideColumnSettings={false}
                  hasSelectAllRows={true}
                  hidePaginationBar={false}
                  hideRefresh={false}
                  onRowSelect={onRowSelect}
                  hideToolbar={false}
                  onRowEditClick={(zone) => {
                    let selectedZ = {};
                    selectedZ[zone.zoneName] = zone;
                    dispatch({
                      type: "@@branchConfiguration/SET_SELECTED_ZONE",
                      payload: selectedZ,
                    });
                    dispatch({
                      type: "@@branchConfiguration/SET_IS_ZONE_EDITABLE",
                      payload: true,
                    });
                    setListView(false);
                  }}
                >
                  {{
                    ActionBar: (
                      <Box display="flex" horizontalSpacing="10px">
                        {Object.keys(actionBarButtons).map(
                          (buttonKey) =>
                            actionBarButtons[buttonKey].permission &&
                            buttonKey !== "InlineEdit" && (
                              <Tooltip
                                messagePlacement={
                                  buttonList[0] === buttonKey ||
                                  buttonKey === "update"
                                    ? "start"
                                    : "center"
                                }
                                hover={true}
                                message={buttonKey}
                                key={buttonKey}>
                                <IconButton
                                  key={buttonKey}
                                  disabled={enableStatus[buttonKey]}
                                  intent="table"
                                  iconVariant={
                                    iconsMapping[buttonKey] || buttonKey
                                  }
                                  id={`listView-actionBar-${buttonKey}`}
                                  onClick={() => {
                                    handleActionBarButtonClick(buttonKey);
                                  }} >
                                  <TextOverflowEllipsis>
                                    {actionBarButtons[buttonKey].label}
                                  </TextOverflowEllipsis>
                                </IconButton>
                              </Tooltip>)
                        )}
                      </Box>
                    ),
                  }}
                </ZoneListViewWrapper>}
              </Grid>
            </>
          )}
          {!listView && (
            <Grid item md={6} xs={12}>
              <Card>
                <SectionWrapper>
                  <div style={{width: "100%"}}>
                    <Grid container style={{ height: "100%" }}>
                      {sectionKeys &&
                        sectionKeys?.length > 0 &&
                        sectionKeys.map((sectionName) => {
                          {
                            return Object.keys(structure[sectionName]).map(
                              (fieldName) => {
                                const meta = structure[sectionName][fieldName];
                                const { permission} = meta
                                if (!permission) {
                                  return undefined
                                }
                               
                                if (fieldName == "zoneRateProfile") {
                                  meta.iconVariant = "icomoon-add";
                                  meta.editable= false
                                  return (
                                    <Grid  item key={fieldName} xs={12} sm={6} md={6} className="grid-item" >
                                      <FormField name={fieldName} meta={meta} formInstance={formInstance} handler={handleIconClick} />
                                    </Grid>
                                  );
                                }

                                return (
                                    <Grid item  key={fieldName} xs={12} sm={6} md={6} className="grid-item">
                                      <FormField name={fieldName}  meta={meta} formInstance={formInstance}/>
                                    </Grid>
                                );
                              }
                            );
                          }
                        })}
                    </Grid>
                  </div>
                  <Box horizontalSpacing="15px" display="flex" mt="30px" ml="15px">
                    <IconButton
                      iconVariant={isZoneEditMode? "icomoon-save" : "icomoon-add"}
                      style={{ padding: "0px 15px" }}
                      disabled={false}
                      onClick={() => {setAddAndContinue(false); validateForm()}}
                      primary
                      id='branch_service_area-actionbar-add'
                    >
                      {isZoneEditMode? dynamicLabels?.["update"]: dynamicLabels?.["add"]}
                    </IconButton>
                    {!isZoneEditMode && <IconButton
                      iconVariant="icomoon-add"
                      style={{ padding: "0px 15px" }}
                      disabled={false}
                      onClick={() => {setAddAndContinue(true); validateForm()}}
                      primary
                      id='branch_service_area-actionbar-addContinue'
                    >
                      {dynamicLabels?.["add"]} {dynamicLabels?.["andContinue"]}
                    </IconButton>
                    }
                    <IconButton iconVariant="icomoon-close" style={{ padding: "0px 15px" }} disabled={false}
                      onClick={() => {
                        setListView(true);
                        reSetFromValues()
                      }}
                      id='branch_service_area-actionbar-cancel'
                    >
                      {dynamicLabels?.["cancel"]}
                    </IconButton>
                  </Box>
                </SectionWrapper>
              </Card>
            </Grid>
          )}
          <Grid item md={6} xs={12}>
            <div style={{ paddingLeft: "15px", height:"340px" }}>
             <PolygonMapWrapper className={"leafletEditMode"}>
             {!listView && !load && <ErrorBoundary><LeafletMap
                  id="leafletBaseMap"
                  classes="baseMap customBaseMap"
                  zoom={zoom}
                  center={isZoneEditMode? editModeCenter:  addModeCenter}
                  zoomControl={true}
                  locationSearch={true}
                  googleApiKey={GOOGLE_API_KEY}
                  height={"340px"}
                  width={"100%"}
                  tiles="google_terrain"
                  theme={"light"}
                  poi={false}
                  settingConfig={Settings}
                  polygon={polyGeoFenceSampleData}
                  popupRef={infowindowStructure}
                  onSettingChange={() => "setting changed"}
                  handleClosePopup={(popupRef) => {
                    popupRef;
                  }}
                  editPopUpComponent={({ map }: any) => (<EditPopUp  onClick={() => { map.closePopup();}}/>)}
                  onEdit={(data) => {
                    setIsIntersection(data?.isIntersection || false)
                    if(data.isChanged){
                      setCoordinates(
                        data.coordinates.map((cor: any) => {
                          return {
                            latitude: cor[0] || cor.lat,
                            longitude: cor[1] || cor.lng,
                          };
                        })
                      );
                    }
                    else{
                      setCoordinates(
                        data.originalCoordinates.map((cor: any) => {
                          return {
                            latitude: cor[0] || cor.lat,
                            longitude: cor[1] || cor.lng,
                          };
                        })
                      );
                    }
                   
                  }}
                /></ErrorBoundary>}
                {listView && zonePolygonData?.length>0 && <ErrorBoundary><PolygonMapComponent
                    type="territory"
                    settingAPIParam="geofenceMasterList"
                    mapSetting={Settings}
                    polyGeoFenceData={zonePolygonData}
                    rowsSelector={zonePolygonData}
                    editTerritory={()=>{}}
                    deleteTerritory={()=>{}}
                    zoom={zoom}
                    customPopupRef="polygonZone"
                    hideEditDeleteOnPopup={true}
                    polygonCenter={zonePolygonData[0]?.polygonCoordinates? [zonePolygonData[0]?.polygonCoordinates[0]?.latitude, zonePolygonData[0]?.polygonCoordinates[0]?.longitude]: addModeCenter}
                /></ErrorBoundary>}
                {listView && zonePolygonData?.length==0 && <ErrorBoundary><MapDefault
                        type='branch'
                        settingAPIParam='addClientBranchMap'
                        geocoding={false}
                        getPositions={setEditModeCenter}
                        position={addModeCenter}
                        googleApiKey={GOOGLE_API_KEY}
                        isEditMode={isEditMode}
                    /></ErrorBoundary>}

              </PolygonMapWrapper>
            </div>
          </Grid>
        </Grid>
      </ServiceAreaWrapper>
    </div>
  );
};

export default ServiceArea;
