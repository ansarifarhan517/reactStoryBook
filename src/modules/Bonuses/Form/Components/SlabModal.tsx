import React, { Dispatch, useState, useEffect } from "react";
import { UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { TextInput, Modal, ModalHeader } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IBonusFormActions } from "../BonusesForm.action";
import { SlabFieldsWrapper } from "../BonusesForm.styles";
import SlabFields from "./SlabFields";

interface ISlabFieldsProps {
  fieldName: string;
  structure: any;
  stepToAutoAdd?: number;
  metricValue?: string;
  formInstance: UseFormMethods<Record<string, any>>;
  commonDynamicLabels: any;
  currencySymbol: any;
}
const SlabModal = ({
  stepToAutoAdd = 1,
  fieldName,
  structure,
  metricValue,
  formInstance,
  commonDynamicLabels,
  currencySymbol
}: ISlabFieldsProps) => {
  const dispatch = useDispatch<Dispatch<IBonusFormActions>>();

  const { clearErrors, register, setValue } = formInstance;

  const slabData = useTypedSelector(
    (state) => state.bonuses.form?.slabData
  );

  const [isSlabModalOpen, setIsSlabModalOpen] = useState(false);

  const handleSave = (slabInputData: any) => {
    dispatch({
      type: "@@bonuses/SET_SLAB_DATA",
      payload: slabInputData,
    });
    // Get values filled in the Add/Update form
    if (slabInputData?.length) {
      clearErrors(fieldName);
    }
  };

  useEffect(() => {
    setValue(fieldName, slabData ? `${slabData?.length} Slab(s)` : undefined);
  }, [slabData])


  return (
    <>
      <TextInput
        ref={register({ required: structure.required })}
        fullWidth
        id={fieldName}
        name={fieldName}
        className={fieldName}
        placeholder={structure.label}
        label={structure.label}
        required={structure.required}
        variant="withIcon"
        iconVariant="add"
        iconSize={15}
        error={formInstance.errors[fieldName]}
        errorMessage={
          structure?.validation?.required?.message || "Bonus Slab is mandatory."
        }
        onClick={() => setIsSlabModalOpen(true)}
        onIconClick={() => setIsSlabModalOpen(true)}
      />
      <Modal
        open={!!isSlabModalOpen}
        onToggle={() => {}}
        size="md"
        width="70vw"
      >
        {{
          header: (
            <ModalHeader
              width="100%"
              headerTitle={`${structure.label}`}
              imageVariant="icomoon-close"
              handleClose={() => {
                setIsSlabModalOpen(false);
              }}
            />
          ),

          content: (
            <SlabFieldsWrapper>
              <SlabFields
                setIsSlabModalOpen={setIsSlabModalOpen}
                structure={structure.childNodes}
                stepsToAutoAdd={stepToAutoAdd}
                metricValue={metricValue}
                handleSave={handleSave}
                givenSlabDataArray={slabData}
                commonDynamicLabels={commonDynamicLabels}
                currencySymbol={currencySymbol}
              />
            </SlabFieldsWrapper>
          ),
        }}
      </Modal>
    </>
  );
};

export default SlabModal;