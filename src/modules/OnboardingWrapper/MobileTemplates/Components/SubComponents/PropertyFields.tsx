import React from "react";
import {Box, DropDown} from "ui-library";
import { FieldContainer, FieldSectionTitle } from "../../MobileTemplateStyledComponents";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { IDynamicOrderMasterStructure } from "../../MobileTemplate.models";
interface IOptions {
    value: string;
    label: string;
    title: string;
}
interface IPropertyFieldsProps {
    selectedField: string;
    masterStructure: IDynamicOrderMasterStructure;
    fontSizeList: Array<IOptions>;
    fontWeightList: Array<IOptions>;
    fontColorList: Array<IOptions>;
    backgroundColorList: Array<IOptions>; 
    setPropertyTouched: React.Dispatch<React.SetStateAction<boolean>>;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
    setFontWeight: React.Dispatch<React.SetStateAction<string>>;
    setFontColor: React.Dispatch<React.SetStateAction<string>>;
    setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
    backgroundColor: string;
    fontColor: string;
    fontWeight: string;
    fontSize: number;
}
const PropertyFields = ({selectedField, masterStructure, fontSizeList, fontWeightList, fontColorList, backgroundColorList, setPropertyTouched, setFontSize, setFontWeight, setFontColor, setBackgroundColor, backgroundColor, fontColor, fontWeight, fontSize}:IPropertyFieldsProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);

    return (
        <>
            <FieldSectionTitle>{dynamicLabels.fieldProperties}</FieldSectionTitle>
            <FieldContainer>
                {masterStructure.structure.columns[selectedField?.includes('empty') ? 'empty' : selectedField]?.allowedProperties?.includes('fontSize') &&
                    <Box>
                        <DropDown
                            variant='form-select'
                            optionList={fontSizeList}
                            label={dynamicLabels.fontSize}
                            required={false}
                            loading={false}
                            onChange={(value: number) => { setPropertyTouched(true); setFontSize(value) }}
                            error={false}
                            value={fontSize}
                        />
                    </Box>
                }
                {masterStructure.structure.columns[selectedField?.includes('empty') ? 'empty' : selectedField]?.allowedProperties?.includes('fontWeight') &&
                    <Box>
                        <DropDown
                            variant='form-select'
                            optionList={fontWeightList}
                            label={dynamicLabels.fontWeight}
                            required={false}
                            loading={false}
                            onChange={(value: string) => { setPropertyTouched(true); setFontWeight(value) }}
                            error={false}
                            value={fontWeight}
                        />
                    </Box>
                }
                {masterStructure.structure.columns[selectedField?.includes('empty') ? 'empty' : selectedField]?.allowedProperties?.includes('color') &&
                    <Box>
                        <DropDown
                            variant='form-select'
                            optionList={fontColorList}
                            label={dynamicLabels.fontColor}
                            required={false}
                            loading={false}
                            onChange={(value: string) => { setPropertyTouched(true); setFontColor(value) }}
                            error={false}
                            value={fontColor}
                        />
                    </Box>
                }
                {masterStructure.structure.columns[selectedField?.includes('empty') ? 'empty' : selectedField]?.allowedProperties?.includes('backgroundColor') &&
                    <Box>
                        <DropDown
                            variant='form-select'
                            optionList={backgroundColorList}
                            label={dynamicLabels.fontBackground}
                            required={false}
                            loading={false}
                            onChange={(value: string) => { setPropertyTouched(true); setBackgroundColor(value) }}
                            error={false}
                            value={backgroundColor}
                        />
                    </Box>
                }
            </FieldContainer>
        </>
    )
}

export default PropertyFields;