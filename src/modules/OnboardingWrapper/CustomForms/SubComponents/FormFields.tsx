import React from "react";
import { UseFormMethods } from "react-hook-form";
import { SectionHeader, Grid } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { IMongoFormStructure } from "../../../../utils/mongo/interfaces";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { FormContainer, FormFieldWapper, SectionHeaderContainer } from "../CustomFormsStyledComponents";

interface IFormFieldsProps {
    sectionName: string
    formInstance: UseFormMethods<Record<string, any>>
    structure: IMongoFormStructure
}
const FormFields = (props: IFormFieldsProps) => {
    const {sectionName, structure, formInstance } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    return (
        <FormContainer key={sectionName}>

            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[sectionName]} /></SectionHeaderContainer>
            <Grid container spacing='15px' style={{ marginBottom: '15px' }}>

                {Object.keys(structure[sectionName]).map((fieldName) => {
                    const meta = structure[sectionName][fieldName];
                    meta.multipleFiles = false;
                    const { permission } = meta;

                    if (!permission) {
                        return undefined;
                    }
                    return (
                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields'>
                            <FormFieldWapper>
                                <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                            </FormFieldWapper>
                        </Grid>
                    );
                })}
            </Grid>
        </FormContainer>
    )
}

export default FormFields;