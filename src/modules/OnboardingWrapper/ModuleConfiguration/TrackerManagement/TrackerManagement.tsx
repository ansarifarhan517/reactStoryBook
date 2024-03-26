import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../../utils/components/withReact";
import { MemoryRouter } from 'react-router-dom'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { Box, Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, AccordionContent, Grid, IconButton, useToast} from "ui-library";
import { StyledCard, BorderButton, CustomDropDown, AddFormButtonContainer } from './TrackerManagementStyledComponents';
import { TrackerManagementActions } from "./TrackerManagement.actions";
import TableComponent from './SubComponents/TableComponent';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';

export interface ITrackerConfigurationProp {
    currentStep? : any
}

export const basename = '';
const TrackerManagement = ({currentStep}: ITrackerConfigurationProp) => {
    const [expanded, setExpanded] = React.useState('0')
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const toast = useToast();
    const dispatch = useDispatch<Dispatch<TrackerManagementActions>>();
    const trackerTypeTableColumns = useTypedSelector((state) => state.tracker.trackerManagement.form.trackerTypeStructure);
    const supplierTableColumns = useTypedSelector((state) => state.tracker.trackerManagement.form.supplierStructure);
    const trackerTypetableData = useTypedSelector((state) => state.tracker.trackerManagement.form.trackerTypeData);
    const supplierTableData = useTypedSelector((state) => state.tracker.trackerManagement.form.supplierData);
    const [structures, setStructures] = useState<any[]>([])
    const [tableData, setTableData] = useState<any[]>([])
    const [trackerTypeData, setTrackerTypeData] = useState<any[]>([])
    const [supplierData, setSupplierData] = useState<any[]>([])
    const [duplicateData, setDuplicateData] = useState<boolean>(false)

    useEffect(() => {
        setTrackerTypeData([])
        setSupplierData([])
        setTableData([])
        dispatch({ type: '@@trackerManagement/FETCH_TRACKER_TYPE_DATA' });
        dispatch({ type: '@@trackerManagement/FETCH_SUPPLIER_DATA' });
        dispatch({ type: '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE' });
        dispatch({ type: '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE' });
    }, []);
    useEffect(() => {
        if(duplicateData){
            toast.add(dynamicLabels.errorDuplicateFields || 'Duplicate data found', 'check-round', false)
        }
        else{
            handleCallApis(trackerTypeData,supplierData)
        }
    }, [duplicateData, trackerTypeData, supplierData]);
    useEffect(() => {
        let structureArray = [{'QUE_TRACKER_TYPE': trackerTypeTableColumns,'QUE_SUPPLIER': supplierTableColumns}]
        setStructures(structureArray)
    }, [trackerTypeTableColumns,supplierTableColumns]);

    useEffect(() => {
        let dataArray = [{'QUE_TRACKER_TYPE': trackerTypetableData,'QUE_SUPPLIER': supplierTableData}]
        setTableData(dataArray)
    }, [trackerTypetableData,supplierTableData]);

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }
    const saveForm = () => {
        setDuplicateData(false);
        setTrackerTypeData(prepareData(tableData[0]?.QUE_TRACKER_TYPE, 'TRACKER_TYPE').filter((el) => el != null));
        setSupplierData(prepareData(tableData[0]?.QUE_SUPPLIER, 'TRACKER_SUPPLIER').filter((el) => el != null));
    }
    const handleCallApis = async (trackerTypeData,supplierData ) => {
            if(trackerTypeData && trackerTypeData.length){
                try {
                    const { data } = await axios.put(apiMappings.tracker.trackerManagement.form.saveTrackerType , trackerTypeData)
                    if (data.status === 200) {
                      toast.add(data?.message, 'check-round', false)
                      let dataArray = [{'QUE_TRACKER_TYPE': trackerTypeData,'QUE_SUPPLIER': supplierData}]
                        setTableData(dataArray)
                    }
                    throw toast.add(`${data?.message}`, 'warning', false);
                  } catch (error) {
                    toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
                  }
                
            }
            if(supplierData && supplierData.length){
                try {
                    const { data } = await axios.put(apiMappings.tracker.trackerManagement.form.saveSupplier, supplierData)
                    if (data.status === 200) {
                      toast.add(data?.message, 'check-round', false)
                      return
                    }
                    throw toast.add(`${data?.message}`, 'warning', false);
                  } catch (error) {
                    toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
                  }
                
            }
    }
    const prepareData = (data: any, type) => {
        let uniqueArr: any = [];
        return data.map(function (obj, i) {
            if (obj.clientRefMasterCd != '') {
                obj['sequence'] = i + 1;
                obj['clientRefMasterType'] = type
                if (uniqueArr.indexOf(obj.clientRefMasterCd.toUpperCase()) >= 0) {
                    setDuplicateData(true);
                    return;
                } else {
                    uniqueArr.push(obj.clientRefMasterCd.toUpperCase());
                }
                if (obj.newInputField) {
                    obj.newInputField = false;
                    delete obj.index;
                }
                return obj;
            }
            else
                return
        });
    }
    const handleAddTrackerType = (questionIdentifier) => {
        switch(questionIdentifier){
            case 'QUE_TRACKER_TYPE':
                let tempval = [...tableData?.[0]?.[questionIdentifier]]
                tempval.push({id: (tempval.length+1).toString(), clientRefMasterCd:"", newInputField: true,  clientRefMasterDesc: ''})
                let array = [{'QUE_TRACKER_TYPE': tempval,'QUE_SUPPLIER': tableData?.[0]?.QUE_SUPPLIER}]
                setTableData(array)
                break
            case 'QUE_SUPPLIER':
                let tempvall = [...tableData?.[0]?.[questionIdentifier]]
                tempvall.push({id: (tempvall.length+1).toString(), clientRefMasterCd:"", newInputField: true,  clientRefMasterDesc: ''})
                let arrayy = [{'QUE_SUPPLIER': tempvall,'QUE_TRACKER_TYPE': tableData?.[0]?.QUE_TRACKER_TYPE}]
                setTableData(arrayy)
                break
        }
    }
    return (
        <Box display='flex' flexDirection='column' alignItems='stretch' style={{height: 'calc(100vh - 64px)'}}>
            <Box flexGrow={1}>
            <StyledCard>
                {currentStep?.questions?.map(({ questionIdentifier, questionLabel, questionDescLabel }, index) => (<Accordion key={questionIdentifier} expanded={expanded == index.toString()} id={index.toString()} onToggle={handleToggle}>
                {{
                    header: <><AccordionHeaderTitle>{questionLabel}</AccordionHeaderTitle>
                    <AccordionHeaderSubTitle>{questionDescLabel}</AccordionHeaderSubTitle>
                    </>,
                    content: <AccordionContent style={{ backgroundColor: '#fafafa' }}>
                        <Box pt='3px' pb='8px'>
                            <CustomDropDown>
                                <div className="dropdownOptionsWrapper" >
                                    <div  className='row'  style={{ margin: '0px', marginBottom: '20px' }}>
                                        {structures?.[0]?.[questionIdentifier] && tableData?.[0]?.[questionIdentifier] &&
                                            <TableComponent structure={structures[0][questionIdentifier].columns} setStructures={setStructures} tableArray={tableData[0][questionIdentifier]} allData={tableData} setTableData={setTableData} questionIdentifier={questionIdentifier}></TableComponent>
                                        } 
                                    </div>
                                </div>
                            </CustomDropDown>
                            <BorderButton id={`Add ${questionLabel}-actionBar-Button`} onClick={() => handleAddTrackerType(questionIdentifier)}> + {dynamicLabels.add} {questionLabel}</BorderButton>
                        </Box>
                    </AccordionContent>
                }}
                </Accordion>))}
                <Grid container spacing='15px'>
                    <AddFormButtonContainer item xs={6} sm={6} md={6}>
                    <IconButton id='tracker-Management-save' primary iconVariant="icomoon-save" onClick={saveForm}>{dynamicLabels.save}</IconButton>
                    </AddFormButtonContainer>
                </Grid>
            </StyledCard>
            </Box>
        </Box>
    )
}
const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props as P} /></MemoryRouter>
    }
export default withReactOptimized(withMemoryRouter(TrackerManagement))