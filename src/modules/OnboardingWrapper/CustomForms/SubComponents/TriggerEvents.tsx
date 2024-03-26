import React, { Fragment } from "react";
import { AddDeleteIconContainer, Counter, FormContainer, FormFieldWapper, IndexCounter, SectionHeaderContainer, ToggleBoxContainer } from "../CustomFormsStyledComponents";
import { SectionHeader, Grid, IconButton } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { ITriggerEventsStructure } from "../CustomForms.models";
import { UseFormMethods } from "react-hook-form";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { IMongoFormStructure } from "../../../../utils/mongo/interfaces";

interface ITriggerEventProps {
    sectionName: string
    AddTriggerEvents: Function
    triggerEventsList: ITriggerEventsStructure[]
    DeleteAddTriggerEvent: Function
    formInstance: UseFormMethods<Record<string, any>>;
    structure: IMongoFormStructure
}

const TriggerEvents = (props: ITriggerEventProps) => {
    const {sectionName, AddTriggerEvents, triggerEventsList, DeleteAddTriggerEvent, formInstance, structure} = props
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    return (
        <FormContainer key={sectionName}>

            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[sectionName]} /></SectionHeaderContainer>
            <Grid container spacing='15px'>
                <Grid container spacing='15px' style={{ marginBottom: '15px' }}>
                    <>
                        {Object.keys(structure[sectionName]).map((fieldName) => {
                            const meta = structure[sectionName][fieldName]
                            const { childNodes } = meta;
                           
                            return childNodes && Object.keys(childNodes).length > 0 && triggerEventsList && triggerEventsList.length > 0 && triggerEventsList.map((field, index) => {
                                return <Fragment key={index.toString()}><Grid  item xs={12} sm={6} md={10} className='grid-item'>
                                    <Grid container spacing='15px'>
                                        {Object.keys(field).map((fieldName, childIndex) => {
                                            const { permission, fieldType } = childNodes[fieldName.split("-")[0]];
                                            if (!permission) {
                                                return undefined;
                                            }
                                            return (
                                                childIndex === 0 ?
                                                    <Fragment key={childIndex.toString()}>
                                                        <IndexCounter item key={fieldName + index} xs={12} sm={6} md={1} className='grid-item form-fields index-counter'>
                                                            <Counter>{index + 1}</Counter>
                                                        </IndexCounter>
                                                        <Grid item key={fieldName} xs={12} sm={6} md={2} className='grid-item form-fields'>
                                                            <FormFieldWapper className={`cf_${fieldType}`}>
                                                                <FormField name={fieldName} meta={childNodes[fieldName.split("-")[0]]} formInstance={formInstance} />
                                                            </FormFieldWapper>
                                                        </Grid>

                                                    </Fragment>
                                                    :
                                                    childIndex === 5 ?
                                                    <Fragment key={childIndex.toString()}>
                                                            <Grid item key={fieldName + index} xs={12} sm={6} md={1} className='grid-item form-fields'></Grid>
                                                            <Grid item key={fieldName} xs={12} sm={6} md={2} className='grid-item form-fields'>
                                                                <FormFieldWapper className={`cf_${fieldType}`}>
                                                                    <FormField name={fieldName} meta={childNodes[fieldName.split("-")[0]]} formInstance={formInstance} />
                                                                </FormFieldWapper>
                                                            </Grid>
                                                    </Fragment>
                                                        :
                                                        fieldType === 'toggleBox' ?
                                                            <ToggleBoxContainer item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields toggle-box'>
                                                                <FormFieldWapper>
                                                                    <FormField name={fieldName} meta={childNodes[fieldName.split("-")[0]]} formInstance={formInstance} />
                                                                </FormFieldWapper>
                                                            </ToggleBoxContainer>
                                                            :
                                                            <Grid item key={fieldName} xs={12} sm={6} md={2} className='grid-item form-fields'>
                                                                <FormFieldWapper className={`cf_${fieldType}`}>
                                                                    <FormField name={fieldName} meta={childNodes[fieldName.split("-")[0]]} formInstance={formInstance} />
                                                                </FormFieldWapper>
                                                            </Grid>
                                            );
                                        })
                                        }
                                    </Grid>

                                </Grid>
                                    <AddDeleteIconContainer item xs={12} sm={6} md={2} className='grid-item form-fields icon-container' >
                                        {(index > 0 || (index == 0 && triggerEventsList.filter(item =>
                                            item[Object.keys(item)[Object.keys(item).length - 1]]?.permission).length > 1)) && (
                                                <IconButton
                                                    onClick={() => DeleteAddTriggerEvent(triggerEventsList, field)}
                                                    onlyIcon
                                                    iconVariant='icomoon-minus'
                                                    iconSize={22}
                                                    color='error.main'
                                                />
                                            )}
                                        {(index === triggerEventsList.length - 1 || index === triggerEventsList.filter(item =>
                                            item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                                        ).length - 1) && (
                                                <IconButton
                                                    onClick={() => AddTriggerEvents()}
                                                    onlyIcon
                                                    iconVariant='icomoon-add'
                                                    iconSize={22}
                                                    color='error.primary'
                                                />

                                            )}
                                    </AddDeleteIconContainer>
                                </Fragment>
                            })

                        })}
                    </>
                </Grid>

            </Grid>

        </FormContainer>
    )
}

export default TriggerEvents;