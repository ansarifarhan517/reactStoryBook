import React, { Dispatch, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SectionHeader, Grid, Box, FontIcon, Card, Modal, ModalHeader, IconButton, DropDown } from "ui-library";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping"
import { MobileTemplateFormContainer, SectionHeaderContainer, FieldTileContainer, FieldSectionTitle, PreviewContainer, PreviewTitle, PreviewMobile, PreviewCard, PreviewColumn, FormButtonContainer, NavigationIconWrapper, PreviewCardContainer, NewOrderButtonContainer, ButtonBordered, ButtonFilled, IconContainer } from "../../MobileTemplateStyledComponents";
import FieldNameTile from "./FieldNameTile";
import { IMobileTemplateActions } from "../../MobileTemplate.actions";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { mobileScreenMapping, configureOrderList, fontColorMapping, backgroundColorMapping, IDynamicCardTileList, fontWeightMapping, orderSectionMapping, orderTypeLabelMapping, IMobileTemplateRouteParams } from "../../MobileTemplate.models";
import { closeSideMenu, deepCopy } from "../../../../../utils/helper";
import ResetModal from "./ResetModal";
import AddressFields from "./AddressFields";
import PropertyFields from "./PropertyFields";
import { sendGA } from '../../../../../utils/ga';
import { useHistory, useParams } from "react-router-dom";

interface IOptions {
    value: string;
    label: string;
    title: string;
}

const MobileOrderConfiguration = () => {
    const { accessProfileId } = useParams<IMobileTemplateRouteParams>();
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();
    const tileList = useTypedSelector((state) => state.settingScreen.mobileTemplates.dynamicOrder.tileList.structure.columns);
    const tileStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.dynamicOrder.tileList);
    const masterStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.dynamicOrder.masterStructure);
    const orderType = useTypedSelector((state) => state.settingScreen.mobileTemplates.orderType);
    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.isEditMode);
    const isOrderConfiguring = useTypedSelector((state) => state.settingScreen.mobileTemplates.isOrderConfiguring);

    const mobileDynamicStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.dynamicOrder.mobileDynamicStructure);

    const [isActive, setActive] = useState<Record<string, boolean>>({ [Object.keys(tileStructure.structure.columns)[0]]: true });
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedField, setSelectedField] = useState<string>(Object.keys(tileStructure.structure.columns)[0]);
    const [optionList, setOptionList] = useState<Array<IOptions>>([]);

    const [fontSizeList, setFontSizeList] = useState<Array<IOptions>>([]);
    const [fontWeightList, setFontWeightList] = useState<Array<IOptions>>([]);
    const [fontColorList, setFontColorList] = useState<Array<IOptions>>([]);
    const [backgroundColorList, setBackgroundColorList] = useState<Array<IOptions>>([]);

    const [addressFields, setAddressFields] = useState<Array<string>>([]);

    const [fontSize, setFontSize] = useState<number>(0);
    const [fontWeight, setFontWeight] = useState<string>('');
    const [fontColor, setFontColor] = useState<string>('');
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    const [updatedField, setUpdatedField] = useState<string>('');

    const [dropdownValues, setDropDownValues] = useState([{ id: "1", name: "Dropdown Value 1", fieldSequence: 1 }, { id: "2", name: "Dropdown Value 2,", fieldSequence: 2 }]);

    const [addressChildNodes, setAddressChildNodes] = useState<Record<string, boolean>>({});

    const [isPropertyTouched, setPropertyTouched] = useState<boolean>(false);

    const [isResetModalOpen, setResetModalOpen] = useState<boolean>(false);

    const [fontCorrectionSize] = useState<number>(4)

    const dispatchTileStructure = (payload: IDynamicCardTileList) => {
        dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_SUCCESS', payload: payload })
    }

    useEffect(() => {
        closeSideMenu();
        // dispatch({ type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE', payload: orderType })
    }, []);

    useEffect(() => {
        let childNodes = {}
        if(tileList.hasOwnProperty('addressFields')) {
                Object.keys(tileList['addressFields']['childNodes']).forEach((node) => {
                    childNodes[node] = tileList['addressFields']['childNodes'][node].permission
                })
            setAddressChildNodes(childNodes);
        } else {
            Object.keys(masterStructure.addressStructure.columns).forEach((node) => {
                childNodes[node] = masterStructure.addressStructure.columns[node].permission
            })
            setAddressChildNodes(childNodes)
        }
        
    },[tileList, masterStructure])

    useEffect(() => {
        if (isOrderConfiguring && mobileDynamicStructure.length > 0) {
            const dynamicStructure = mobileDynamicStructure.filter((dynamicStructure) => dynamicStructure.sectionName === `${orderSectionMapping[orderType]}`);
            if (dynamicStructure.length > 0) {
                dispatchTileStructure(dynamicStructure[0]);
            } else {
                if (isEditMode) {
                    const payload = {
                        orderType: orderType,
                        accessProfileId: Number(accessProfileId)
                    }
                    dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_BY_ID', payload: payload })
                    setFontSize(0)
                    setFontWeight('');
                    setFontColor('');
                    setBackgroundColor('');
                } else {
                    dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST', payload: orderType });
                    setFontSize(0)
                    setFontWeight('');
                    setFontColor('');
                    setBackgroundColor('');
                }
            }
        } else {
            if (isEditMode) {
                const payload = {
                    orderType: orderType,
                    accessProfileId: Number(accessProfileId)
                }
                dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_BY_ID', payload: payload })
            } else {
                dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST', payload: orderType });
            }
        }

    }, [isEditMode, isOrderConfiguring, mobileDynamicStructure, orderType]);

    useEffect(() => {
       if(isEditMode && isOrderConfiguring) {

        if(Object.keys(tileList).length > 0 && tileList.hasOwnProperty('addressFields') && Object.keys(tileList['addressFields']['childNodes']).length > 0) {
            setAddressFields(Object.keys(tileList['addressFields']['childNodes']));
        }
       }
    }, [isEditMode, isOrderConfiguring])

    useEffect(() => {
        if (Object.keys(masterStructure.structure.columns).length > 0) {
            const optionsList = Object.keys(masterStructure.structure.columns).map((fieldName) => {
                return { value: fieldName, label: masterStructure.structure.columns[fieldName].label, title: masterStructure.structure.columns[fieldName].label }
            });

            const fontSizes = Object.keys(masterStructure.properties.fontSize).map((size) => {
                return { value: masterStructure.properties.fontSize[size], label: size, title: size }
            });

            const fontWeights = Object.keys(masterStructure.properties.fontWeight).map((weight) => {
                return { value: masterStructure.properties.fontWeight[weight], label: weight, title: weight }
            });

            const fontColors = Object.keys(masterStructure.properties.color).map((color) => {
                return { value: masterStructure.properties.color[color], label: color, title: color }
            });

            const bgColors = Object.keys(masterStructure.properties.backgroundColor).map((color) => {
                return { value: color === "None" ? "None" : masterStructure.properties.color[color], label: color, title: color }
            });

            setOptionList(optionsList);
            if(!isPropertyTouched) {
                setActive({ [Object.keys(tileStructure.structure.columns)[0]]: true });
                setSelectedField(Object.keys(tileStructure.structure.columns)[0]);
            }
            setFontSizeList(fontSizes);
            setFontWeightList(fontWeights);
            setFontColorList(fontColors);
            setBackgroundColorList(bgColors);
        }

        if (Object.keys(masterStructure.addressStructure.columns).length > 0) {
            const fields = Object.keys(masterStructure.addressStructure.columns).map((fieldName) => {
                return { id: fieldName, name: `${masterStructure.addressStructure.columns[fieldName].label}`, fieldSequence: masterStructure.addressStructure.columns[fieldName].fieldSequence}
            })
            setDropDownValues(fields);
        }
    }, [masterStructure, tileStructure, isPropertyTouched]);

    useEffect(() => {
        if (selectedField && Object.keys(tileList).includes(selectedField) && Object.keys(tileList).length > 0) {
            setActive({ [selectedField]: true });
            const field = tileList[selectedField];
            if (field) {
                setFontSize(field.fontSize);
                setFontWeight(field.bold)
                setFontColor(field.color)
                if (field.backgroundColor) {
                    setBackgroundColor(field.backgroundColor);
                } else {
                    setBackgroundColor('None');
                }
            }

            if (selectedField !== 'shipmentNotes') {

                const optionsList = Object.keys(masterStructure.structure.columns).filter((fieldName) => fieldName !== 'shipmentNotes').map((fieldName) => {
                    return { value: fieldName, label: masterStructure.structure.columns[fieldName].label, title: masterStructure.structure.columns[fieldName].label }
                })
                setOptionList(optionsList);
            }
        }
    }, [selectedField]);


    useEffect(() => {
        if (isPropertyTouched) {
            const newStructure = deepCopy(tileStructure);
            setTimeout(() => {
                newStructure['structure']['columns'][selectedField].color = fontColor;
                dispatchTileStructure(newStructure);
            }, 100);
        }
    }, [fontColor]);

    useEffect(() => {
        if (isPropertyTouched) {
            const newStructure = deepCopy(tileStructure);
            setTimeout(() => {
                newStructure['structure']['columns'][selectedField].fontSize = fontSize;
                dispatchTileStructure(newStructure);
            }, 100);
        }
    }, [fontSize]);

    useEffect(() => {
        if (isPropertyTouched) {
            const newStructure = deepCopy(tileStructure);
            setTimeout(() => {
                newStructure['structure']['columns'][selectedField].bold = fontWeight;
                dispatchTileStructure(newStructure);
            }, 100);
        }
    }, [fontWeight]);

    useEffect(() => {
        if (isPropertyTouched) {
            const newStructure = deepCopy(tileStructure);
            setTimeout(() => {
                newStructure['structure']['columns'][selectedField].backgroundColor = backgroundColor;
                dispatchTileStructure(newStructure);
            }, 100);
        }
    }, [backgroundColor]);

    const updateTileListOrder = (prevValue: string, value: string, childNodes: Record<string, boolean>) => {
        if (!value || prevValue === value) {

            if (prevValue === 'addressFields') {
                let updateTileList = { ...tileList };
                let addressChildNodes = {}
                let selectedChildNodes = {}
                let unSelectedChildNodes = {}

                selectedChildNodes = addressFields.reduce((obj, field) => {
                    const fieldSequenceObj = dropdownValues.find((value) => value.id === field);
                    obj[field] = {...tileStructure.structure.columns['addressFields']['childNodes'][field], permission: childNodes[field], fieldSequence : fieldSequenceObj?.fieldSequence}
                    return obj;
                }, {});

                unSelectedChildNodes = Object.keys(tileStructure.structure.columns['addressFields']['childNodes']).reduce((obj, field) => {
                    if(!Object.keys(selectedChildNodes).includes(field)) {
                        const fieldSequenceObj = dropdownValues.find((value) => value.id === field);
                        obj[field] = {...tileStructure.structure.columns['addressFields']['childNodes'][field], permission: childNodes[field], fieldSequence : fieldSequenceObj?.fieldSequence}
                    }
                    return obj;
                }, {});

                addressChildNodes = {...selectedChildNodes, ...unSelectedChildNodes}

                updateTileList = { ...updateTileList, [`${prevValue}`]: { ...tileList[prevValue], childNodes: addressChildNodes } }
                dispatchTileStructure({ ...tileStructure, structure: { ...tileStructure.structure, columns: updateTileList } })
            }
            setModalOpen(false)
            return
        };

        // exisiting filed in the current position
        const prevField = { ...tileList[prevValue] }

        // new field to the current position
        const curField = { ...masterStructure.structure.columns[value] }

        // is the new field exists in the default template
        let updateTileList = { ...tileList }

        delete updateTileList[prevValue]


        if (updateTileList[value]) {
            const tempFiled = updateTileList[value]
            const emptyFiled = { ...masterStructure.structure.columns['empty'] };
            ((a: { allowedProperties?: string[] }) => { delete a.allowedProperties })(emptyFiled)
            updateTileList = { ...updateTileList, [`empty${Math.floor(Math.random() * 1000)}`]: { ...updateTileList['empty'], ...emptyFiled, label: 'Empty', fieldSequence: tempFiled?.fieldSequence, rowSpan: tempFiled?.rowSpan, colSpan: tempFiled?.fieldSequence % 2 === 0 ? 3 : 7, fontSize: tempFiled?.fontSize, color: tempFiled?.color, bold: tempFiled?.bold, backgroundColor: tempFiled?.backgroundColor, verticalAlignment: tempFiled?.verticalAlignment, horizontalAlignment: tempFiled?.fieldSequence % 2 === 0 ? 'right' : 'left' } }
            delete updateTileList[value]
        }

        ((a:{ allowedProperties?: string[] }) => { delete a.allowedProperties })(curField)

        let addressChildNodes = {}
        let selectedChildNodes = {}
        let unSelectedChildNodes = {}

        if (value === 'addressFields') {
            let updateTileList = { ...tileList };      
            selectedChildNodes = addressFields.reduce((obj, field) => {
                const fieldSequenceObj = dropdownValues.find((value) => value.id === field);
                obj[field] = {...masterStructure.addressStructure.columns[field], permission: childNodes[field], fieldSequence : fieldSequenceObj?.fieldSequence}
                return obj;
            }, {});

            unSelectedChildNodes = Object.keys(masterStructure.addressStructure.columns).reduce((obj, field) => {
                if(!Object.keys(selectedChildNodes).includes(field)) {
                    const fieldSequenceObj = dropdownValues.find((value) => value.id === field);
                    obj[field] = {...masterStructure.addressStructure.columns[field], permission: childNodes[field], fieldSequence : fieldSequenceObj?.fieldSequence}
                }
                return obj;
            }, {});

            addressChildNodes = {...selectedChildNodes, ...unSelectedChildNodes}            

            updateTileList = { ...updateTileList, [`${prevValue}`]: { ...tileList[prevValue], childNodes: addressChildNodes } }
        }
        updateTileList = { ...updateTileList, [`${value}`]: { ...tileList[value], ...curField, fieldSequence: prevField?.fieldSequence, rowSpan: value === 'addressFields' ? 2 : prevField?.rowSpan, colSpan: prevField?.fieldSequence % 2 === 0 ? 3 : 7, fontSize: prevField?.fontSize, color: prevField?.color, bold: prevField?.bold, backgroundColor: prevField?.backgroundColor, verticalAlignment: prevField?.verticalAlignment, horizontalAlignment: prevField?.fieldSequence % 2 === 0 ? 'right' : 'left', childNodes: addressChildNodes } }
        dispatchTileStructure({ ...tileStructure, structure: { ...tileStructure.structure, columns: updateTileList } })
        setSelectedField(value);
        setModalOpen(false)
    }
    const handleAddressFieldChange = (fieldName: string) => {

        const newStructure = deepCopy(addressChildNodes);

        setTimeout(() => {
            if(newStructure[fieldName]) {
                newStructure[fieldName] = false;
            } else {
                newStructure[fieldName] = true;
            }
            setAddressChildNodes(newStructure);
            // dispatchTileStructure(newStructure);
        }, 100);

        if (addressFields?.includes(fieldName)) {
            setAddressFields(addressFields.filter((field) => field !== fieldName))
        } else {
            const fields = [...addressFields, fieldName];
            setAddressFields(fields);
        }

    }

    const handleAddressSearch = (searchText: string) => {
        if (Object.keys(masterStructure.addressStructure.columns).length > 0) {
            const fields = Object.keys(masterStructure.addressStructure.columns).map((fieldName) => {
                return {
                    id: fieldName,
                    name: `${masterStructure.addressStructure.columns[fieldName].label}`,
                    fieldSequence: masterStructure.addressStructure.columns[fieldName].fieldSequence
                }
            })
            if (!searchText) {
                setDropDownValues(fields);
            } else {
                const searchResult = fields.filter((field) => field.name.toLowerCase().includes(searchText));
                setDropDownValues(searchResult);
            }
        }
    }

    const handleReset = (isEditMode: boolean) => {
        sendGA('Event New',`Mobile Templates Configure Card - Reset`)

        if (isEditMode) {
            const payload = {
                orderType: orderType,
                accessProfileId: Number(accessProfileId)
            }
            dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_BY_ID', payload: payload })
        } else {
            dispatch({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST', payload: orderType });
        }
        dispatch({ type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE', payload: orderType })
        setResetModalOpen(false);
        setSelectedField('');
        setPropertyTouched(false);
    }

    const handleSave = () => {
        sendGA('Event New',`Mobile Templates Configure Card - Save`)

        dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURED', payload: true })
        dispatch({ type: '@@mobileTemplates/SET_VIEW_TYPE', payload: 'add-form-view' })

        const tileStructureResult = mobileDynamicStructure.filter((dynamicStructure) => dynamicStructure.sectionName === tileStructure.sectionName);
        let newStructure = [];
        if (tileStructureResult.length > 0) {
            const dynamicStructure = mobileDynamicStructure.filter((dynamicStructure) => dynamicStructure.sectionName !== tileStructure.sectionName)
            newStructure = [...dynamicStructure, tileStructure];
        } else {
            newStructure = [...mobileDynamicStructure, tileStructure];
        }
        dispatch({ type: '@@mobileTemplates/SET_DYNAMIC_MOBILE_STRUCTURE', payload: newStructure })
        isEditMode ? history.push(`/updateMobileTemplate/${accessProfileId}`) : history.push(`/addMobileTemplate`);    
    }

    return (
        <MobileTemplateFormContainer>
            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[`${orderTypeLabelMapping[orderType]}`]} /></SectionHeaderContainer>
            <Grid container spacing='15px' style={{ marginTop: 20, marginBottom: 15 }}>
                <Grid item xs={12} sm={6} md={4} className='grid-item'>
                    <Card style={{ padding: 0 }}>
                        <FieldSectionTitle><span style={{ color: '#5698d3' }}><FontIcon size="xs" color="#5698d3" variant="icomoon-warning-circled" /></span> {dynamicLabels.clickToCustomize}</FieldSectionTitle>
                        <FieldTileContainer>
                            {Object.keys(tileList).map((tileKey) => {
                                return <FieldNameTile
                                    width="50%"
                                    title={tileList[tileKey]?.label}
                                    fieldName={tileKey}
                                    key={tileKey}
                                    onTileClick={(tile: Record<string, boolean>, fieldName: string) => { setSelectedField(fieldName); setActive(tile) }}
                                    isActive={isActive}
                                    onClick={(fieldName) => { setPropertyTouched(true); setSelectedField(fieldName); setModalOpen(true) }}
                                />
                            })}
                        </FieldTileContainer>
                    </Card>
                    <Card style={{ marginTop: 10, padding: 0 }}>
                        <PropertyFields masterStructure={masterStructure} selectedField={selectedField} fontSizeList={fontSizeList} fontSize={fontSize} setPropertyTouched={setPropertyTouched} setFontSize={setFontSize} fontWeightList={fontWeightList} fontWeight={fontWeight} setFontWeight={setFontWeight} fontColorList={fontColorList} fontColor={fontColor} setFontColor={setFontColor} backgroundColorList={backgroundColorList} backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={8} className='grid-item'>
                    <PreviewContainer>
                        <PreviewTitle>{dynamicLabels.preview}</PreviewTitle>
                        <PreviewMobile>
                            <img src={mobileScreenMapping[`${orderType}`]} />
                            <PreviewCardContainer>
                            {configureOrderList.map((order, index) => {
                                return <PreviewCard key={index} className={index % 2 === 0 ? 'even' : 'odd'}> {
                                    <FieldTileContainer key={index}> {
                                        Object.keys(tileList).map((fieldName, tileIndex) => {
                                            if (fieldName === 'addressFields') {
                                                return (
                                                    <>
                                                        <PreviewColumn key={tileList[fieldName].fieldSequence} style={{ color: fontColorMapping[tileList[fieldName]?.color], backgroundColor: backgroundColorMapping[tileList[fieldName]?.backgroundColor], fontSize: tileList[fieldName]?.fontSize - fontCorrectionSize, fontWeight: fontWeightMapping[tileList[fieldName]?.bold] }} className={tileIndex % 2 === 0 ? `${fieldName} left` : `${fieldName} right`}>
                                                            <div>{order[`addressLine1`]}</div>
                                                            <div>{order[`addressLine2`]}</div>
                                                        </PreviewColumn>
                                                    </>
                                                )
                                            } else {
                                                if (fieldName === 'priority') {
                                                    return (                                                      
                                                        <PreviewColumn key={tileList[fieldName].fieldSequence} style={{ color: fontColorMapping[tileList[fieldName]?.color], backgroundColor: backgroundColorMapping[tileList[fieldName]?.backgroundColor], fontSize: tileList[fieldName]?.fontSize - fontCorrectionSize, fontWeight: fontWeightMapping[tileList[fieldName]?.bold], textAlign: backgroundColorMapping[tileList[fieldName]?.backgroundColor] === 'transparent' || backgroundColorMapping[tileList[fieldName]?.backgroundColor] === undefined ? tileList[fieldName]?.fieldSequence % 2 === 0 ? 'right' : 'left' : 'center' }} className={tileIndex % 2 === 0 ? `${backgroundColorMapping[tileList[fieldName]?.backgroundColor] !== 'tranparent' ? fieldName : ''} left` : `${backgroundColorMapping[tileList[fieldName]?.backgroundColor] !== 'tranparent' ? fieldName : ''} right`}>{order[`${fieldName}`]}</PreviewColumn>
                                                    )
                                                } else if (fieldName.includes('empty')) {
                                                    if(tileIndex > 0 && Object.keys(tileList).splice(tileIndex, Object.keys(tileList).length).every((fieldName) => fieldName.includes('empty'))) {
                                                        return;
                                                    } else {
                                                        return <PreviewColumn key={tileList[fieldName].fieldSequence} className={tileIndex % 2 === 0 ? 'left' : 'right'}></PreviewColumn>
                                                    }
                                                } else {
                                                    if (tileList[fieldName].customField) {
                                                        return <PreviewColumn key={tileList[fieldName].fieldSequence} style={{ color: fontColorMapping[tileList[fieldName]?.color], backgroundColor: backgroundColorMapping[tileList[fieldName]?.backgroundColor], fontSize: tileList[fieldName]?.fontSize - fontCorrectionSize, fontWeight: fontWeightMapping[tileList[fieldName]?.bold] }} className={tileIndex % 2 === 0 ? `${backgroundColorMapping[tileList[fieldName]?.backgroundColor] !== 'tranparent' ? fieldName : ''} left` : `${backgroundColorMapping[tileList[fieldName]?.backgroundColor] !== 'tranparent' ? fieldName : ''} right`}>{tileList[fieldName].label}</PreviewColumn>
                                                    } else {
                                                        return (
                                                            <PreviewColumn key={tileList[fieldName].fieldSequence} style={{ color: fontColorMapping[tileList[fieldName]?.color], backgroundColor: backgroundColorMapping[tileList[fieldName]?.backgroundColor], fontSize: tileList[fieldName]?.fontSize - fontCorrectionSize, fontWeight: fontWeightMapping[tileList[fieldName]?.bold] }} className={tileIndex % 2 === 0 ? 'left' : 'right'}>{order[`${fieldName}`]}</PreviewColumn>
                                                        )
                                                    }
                                                }
                                            }
                                        })
                                    }
                                      {orderType === 'NEW_ORDER' &&
                                        <NewOrderButtonContainer>
                                            <ButtonBordered>{dynamicLabels.REJECT}</ButtonBordered>
                                            <ButtonFilled>{dynamicLabels.ACCEPT}</ButtonFilled>
                                        </NewOrderButtonContainer>
                                        }
                                        {orderType === 'COMPLETED' &&
                                            <IconContainer className="completed">
                                                <img src='images/CustomFormeIcon.png' />
                                            </IconContainer>
                                        }
                                        {orderType === 'CURRENT_ORDER' &&
                                            <IconContainer className="current">
                                                <img src='images/Note-Chat-icon.png' />
                                            </IconContainer>
                                        } 
                                    </FieldTileContainer>
                                }
                                <NavigationIconWrapper><FontIcon size={8} variant="icon icon-angle-right-thin" /></NavigationIconWrapper>
                              
                                </PreviewCard>
                            })}
                            </PreviewCardContainer>
                        </PreviewMobile>
                    </PreviewContainer>
                </Grid>
            </Grid>
            <FormButtonContainer>
                <Box horizontalSpacing='15px' display='flex' mt='30px'>
                    <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={false} onClick={() => handleSave()} primary>{dynamicLabels.save}</IconButton>
                    <IconButton iconVariant='icomoon-back' style={{ padding: '0px 15px' }} disabled={!isPropertyTouched} onClick={() => setResetModalOpen(true)}>{dynamicLabels.reset}</IconButton>
                    <IconButton iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => {
                        dispatch({ type: '@@mobileTemplates/SET_VIEW_TYPE', payload: 'add-form-view' })
                        sendGA('Event New',`Mobile Templates Configure Card - Cancel`)
                        isEditMode ? history.push(`/updateMobileTemplate/${accessProfileId}`) : history.push(`/addMobileTemplate`);    
                    }}>{dynamicLabels.cancel}</IconButton>
                </Box>
            </FormButtonContainer>

            <Modal width="600px" open={isModalOpen} onToggle={() => setModalOpen(false)}>
                {{
                    header: <ModalHeader width="600px" handleClose={() => setModalOpen(false)} headerTitle={dynamicLabels.updateField} />,
                    content: <Box>
                        <DropDown
                            variant='form-select'
                            optionList={optionList}
                            label={dynamicLabels.field}
                            required={false}
                            loading={false}
                            limitOptionsList={optionList.length}
                            onChange={(value: string) => { setPropertyTouched(true); setUpdatedField(value) }}
                            error={false}
                            value={selectedField?.includes('empty') ? 'empty' : selectedField}
                            width='570px'
                        />
                        {((selectedField === 'addressFields' && (!updatedField || updatedField === 'addressFields')) || (selectedField !== 'addressFields' && updatedField === 'addressFields')) &&
                            <AddressFields handleAddressSearch={handleAddressSearch} setDropDownValues={setDropDownValues} dropdownValues={dropdownValues} setPropertyTouched={setPropertyTouched} handleAddressFieldChange={handleAddressFieldChange} addressChildNodes={addressChildNodes}/>
                        }
                    </Box>,
                    footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton primary iconVariant='icomoon-tick-circled'
                            onClick={() => {
                                sendGA('Event New',`Mobile Templates Configure Card -  Update Field`)
                                setPropertyTouched(true);
                                updateTileListOrder(selectedField, updatedField, addressChildNodes);
                            }}>
                            {dynamicLabels.Done}
                        </IconButton>
                        <IconButton iconVariant='icomoon-close'
                            onClick={() => { 
                                setModalOpen(false) 
                            }}>
                            {dynamicLabels.cancel}
                        </IconButton>
                    </Box>
                }}
            </Modal>
            <ResetModal isResetModalOpen={isResetModalOpen} setResetModalOpen={setResetModalOpen} handleReset={handleReset} isEditMode={isEditMode} />        </MobileTemplateFormContainer>
    )
}

export default MobileOrderConfiguration;