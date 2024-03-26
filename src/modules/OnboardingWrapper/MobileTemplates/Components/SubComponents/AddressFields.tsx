import React from "react";
import { SectionHeader, Grid, FontIcon, TextInput, Toggle } from "ui-library";
import { DraggableComponent } from "../../../../../utils/components/Draggable/DraggableComponent";
import { SectionHeaderContainer, AddressFieldsWrapper, Label, SearchFieldWrapper } from "../../MobileTemplateStyledComponents";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { sendGA } from "../../../../../utils/ga";
interface IAddressFieldsProps {
    handleAddressSearch: (searchText: string) => void;
    dropdownValues: Array<{id: string; name: string}>;
    setDropDownValues: React.Dispatch<React.SetStateAction<Array<{id: string; name: string, fieldSequence: number}>>>;
    handleAddressFieldChange: (fieldName: string) => void;
    setPropertyTouched: React.Dispatch<React.SetStateAction<boolean>>;
    addressChildNodes: Record<string, boolean>;
}
const AddressFields = ({handleAddressSearch, dropdownValues, setDropDownValues, handleAddressFieldChange, setPropertyTouched, addressChildNodes}: IAddressFieldsProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
    const handleDrag = (newState: any) => {
        newState.forEach((obj: any, index: number) => {
                obj.fieldSequence = index+1
        });
        setDropDownValues(newState);
    }

    return (
        <>
            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels.addressSequencing} /></SectionHeaderContainer>
            <AddressFieldsWrapper>
                <Grid className="search-bar" container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee" }}>
                    <Grid item md={1} className='grid-item'></Grid>
                    <Grid item md={9} className='grid-item'>
                        <Label>{dynamicLabels.addressField}</Label>
                        <SearchFieldWrapper>
                            <FontIcon size={12} variant="icon icon-search" />
                            <TextInput
                                id='addressFieldSearch'
                                name='addressFieldSearch'
                                className='addressFieldSearch'
                                maxLength={10}
                                error={false}
                                onChange={(e) => handleAddressSearch(e.target.value)}
                                variant='inline-edit'
                            />
                        </SearchFieldWrapper>
                    </Grid>
                    <Grid item md={1} className='grid-item'><Label>{dynamicLabels.show}</Label></Grid>
                </Grid>

                <DraggableComponent sort={true} list={dropdownValues} setList={(newState: any) => {
                    handleDrag(newState);
                    sendGA('Event New',`Mobile Templates Configure Card - Sequence Address`)
                }}>
                    {dropdownValues.map((dropdownRow: any) => {
                        return <div className="dropdownOptionsWrapper" key={dropdownRow.id}>
                            <Grid key={dropdownRow.id} container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee" }}>
                                <Grid item md={1} className='grid-item' >
                                    <img src="images/Drag_Drop-Gray.svg" className="item-img" height="20px" />
                                </Grid>
                                <Grid item md={9} className='grid-item'>
                                    {dropdownRow.name}
                                </Grid>
                                <Grid item md={1} className='grid-item'>
                                    <Toggle
                                        value={dropdownRow.id}
                                        onChange={() => { setPropertyTouched(true); handleAddressFieldChange(dropdownRow.id) }}
                                        checked={addressChildNodes[dropdownRow.id]}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    })
                    }
                </DraggableComponent>
            </AddressFieldsWrapper>
        </>
    )
}

export default AddressFields;