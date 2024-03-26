import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormField from "../../../../../utils/components/Form/FormField";
import { Modal, Grid, ModalHeader, Box, IconButton } from "ui-library";
import { IMobileTemplateActions } from "../../MobileTemplate.actions";
import { FormFieldWapper, CloneFieldsContainer } from "../../MobileTemplateStyledComponents"
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { IFormInputs } from "../../MobileTemplate.models"
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";

interface ICloneMobileRoleProps {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    onSubmit: (data: IFormInputs) => void;

}

const defaultValues = {
    accessprofileName: '',
    accessprofileDesc: '',
}

const CloneMobileTemplateModal = ({ isOpen, onClose, onSubmit }: ICloneMobileRoleProps) => {

    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);

    const { handleSubmit, reset } = formInstance;

    const structure = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.structure);

    const sectionKeys = Object.keys(structure);

    useEffect(() => {
        dispatch({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE' });
    }, [])

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width='600px'>
            {{
                header: <ModalHeader headerTitle={dynamicLabels.cloneMobileTemplate} handleClose={() => onClose(false)} />,

                content: 
                <>
                    {sectionKeys.length > 0 &&
                        sectionKeys.map((sectionName) => (
                            <div key={sectionName}>
                                <Grid container spacing="0px">
                                    {Object.keys(structure[sectionName]).map((fieldName) => {
                                        if (fieldName === 'accessprofileName' || fieldName === 'accessprofileDesc') {
                                            const meta = structure[sectionName][fieldName];
                                            meta.multipleFiles = false;
                                            const { permission } = meta;

                                            if (!permission) {
                                                return undefined;
                                            }
                                            return (
                                                <CloneFieldsContainer key={fieldName}>
                                                    <Grid item key={fieldName} xs={12} sm={12} md={12} className='grid-item'>
                                                        <FormFieldWapper>
                                                            <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                        </FormFieldWapper>
                                                    </Grid>
                                                </CloneFieldsContainer>
                                            );
                                        } else {
                                            return;
                                        }
                                    })}

                                </Grid>
                            </div>))}
                </>,

                footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton id='MobileTemplate-CloneModal-Save' primary iconVariant='icomoon-save'
                        onClick={handleSubmit((data) => {onSubmit(data); reset(defaultValues)})}>
                        {dynamicLabels.save}
                    </IconButton>
                    <IconButton id='MobileTemplate-CloneModal-Cancel' iconVariant='icomoon-close'
                        onClick={() => {onClose(false); reset(defaultValues)}}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>

            }}
        </Modal>
    )
}

export default CloneMobileTemplateModal;