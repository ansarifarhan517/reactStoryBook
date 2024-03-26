import React, { useState, useEffect } from "react";
import { RepeatButtonsWrapper } from "../../../../utils/components/GroupRepeat/styled";
import { FlexContainer } from "../../ListView/BonusesList.styles";
import { useForm, useFieldArray } from "react-hook-form";
import { TextInput, Grid, IconButton, useToast } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { FieldValues } from "react-hook-form/dist/types/form";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { isFloat } from "../../../../utils/helper";
import { FormFieldWrapper } from "../BonusesForm.styles";

const getToFieldNames = (length: number) => {
  const arrayWithFieldNames: string[] = [];
  for (let i = 0; i <= length - 1; i++) {
    arrayWithFieldNames.push(`slabs[${i}].toValue`);
  }
  return arrayWithFieldNames;
};

const areAllFieldsFilled = (values: any, metricValue: string = 'ORDER_COUNT') => {
  return values?.every((obj: any, index: number) => {
    if (values?.length - 1 === index && index !== 0) {
      return (obj.fromValue !== '0') && !!obj.fromValue && !!obj.rate && !!obj.rateType;
    } else {
      return (metricValue === 'HOURS_ON_DUTY' || obj.fromValue !== '0') && !!obj.fromValue && !!obj.rate && !!obj.rateType && !!obj.toValue;
    }
  });
};

const greaterThan = (values: any) => {
  let flag = false;
  flag = values?.every((element: any, index: number) => {
    return index < values.length - 1
      ? parseFloat(element?.fromValue) <= parseFloat(element?.toValue)
      : true;
  });
  return flag;
};

const changeToValueOnRemove = (
  index: number,
  ToValueArray: any,
  stepper: number
) => {
  const newArray = [...ToValueArray];
  newArray.splice(index, 1);

  const newness = newArray?.map((obj: any, idx: number) => {
    if (idx > 0 && idx >= index) {
      return {
        ...obj,
        fromValue: parseInt(newArray[idx - 1]?.toValue) + stepper,
        toValue: obj?.toValue ? obj?.toValue : "",
      };
    } else {
      return obj;
    }
  });
  return newness;
};

interface ISlabFieldsProps {
  setIsSlabModalOpen;
  structure: any;
  stepsToAutoAdd: number;
  handleSave: any;
  metricValue?: string;
  givenSlabDataArray?: any;
  commonDynamicLabels: any;
  currencySymbol: any;
}

const SlabFields = ({
  setIsSlabModalOpen,
  structure,
  stepsToAutoAdd,
  metricValue,
  handleSave,
  givenSlabDataArray,
  commonDynamicLabels,
  currencySymbol,
}: ISlabFieldsProps) => {
  const metricLabel =
    metricValue === "HOURS_ON_DUTY"
      ? "Per Hour"
      : `Per ${commonDynamicLabels.order_s}`;
  const toast = useToast();
  type tSlabFields = {
    fromValue?: number;
    toValue?: number;
    rateType?: any;
    rate?: number;
  };

  type FormValues = {
    slabs: Array<tSlabFields>;
  };

  const slabDynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.payments.bonuses.slab
  );

  const formInstance = useForm<FormValues | FieldValues>({
    mode: "all",
    shouldUnregister: false,
    // Form will have slabs where initially there will be only 1 slab with all these values, that's why 1 object in the slabs array
    defaultValues: {
      slabs: [
        {
          fromValue: undefined,
          toValue: undefined,
          rateType: undefined,
          rate: undefined,
        },
      ],
    },
  });
  console.log(formInstance?.formState?.isDirty);

  const { register, control, handleSubmit, watch, setValue, getValues, reset } =
    formInstance;
  const { fields, append } = useFieldArray({ control, name: "slabs" });

  const watchToFields = watch([...getToFieldNames(fields.length)]);
  // const watchFromFields = watch([...getFromFieldNames(fields.length)]);

  // Local States
  const [hasError, setHasError] = useState([false]);
  const [toPlaceholder, setToPlaceholder] = useState<string[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);

  // Redux states
  const isUpdateForm = useTypedSelector(
    (state) => state.bonuses.form.isUpdateForm
  );

  /*******        UTILITIES       ***********/
  const addErrorAt = (index: number) => {
    setHasError((prevHasErrorState) => {
      prevHasErrorState[index] = true;
      return prevHasErrorState;
    });
  };

  const removeErrorAt = (index: number) => {
    setHasError((prevHasErrorState) => {
      prevHasErrorState[index] = false;
      return prevHasErrorState;
    });
  };

  const removeElementCompletely = (index: number) => {
    const errorArr = [...hasError];
    if (index > -1) {
      errorArr.splice(index, 1);
    }
    setHasError([...errorArr]);
  };

  const changeNextSlabFromValue = (watchToField: any) => {
    Object.keys(watchToField)?.forEach((toField, index) => {
      const toFieldValue = Math.abs(watchToField[toField]);
      setValue(
        `slabs[${index + 1}].fromValue`,
        metricValue === "HOURS_ON_DUTY"
          ? Number((toFieldValue + stepsToAutoAdd).toFixed(1))
          : parseInt(toFieldValue.toString()) + stepsToAutoAdd
      );
    });
  };

  const greaterThanFrom = (slabIndex: number) => {
    const fromValueAtIndex: any = getValues(`slabs[${slabIndex}].fromValue`);
    const toValueAtIndex: any = getValues(`slabs[${slabIndex}].toValue`);

    if (metricValue === 'HOURS_ON_DUTY' && parseFloat(toValueAtIndex) < parseFloat(fromValueAtIndex)) {
      // debounce
      setTimeout(() => {
        addErrorAt(slabIndex);
      }, 1500);
    } else if (metricValue !== 'HOURS_ON_DUTY' && parseInt(toValueAtIndex) < parseInt(fromValueAtIndex)) {
      setTimeout(() => {
        addErrorAt(slabIndex);
      }, 1500);
    }
    else {
      // debounce
      setTimeout(() => {
        removeErrorAt(slabIndex);
      }, 1500);
    }

    return parseFloat(toValueAtIndex) > parseFloat(fromValueAtIndex);
  };

  const addNewSlab = () => {
    const values = getValues();
    const totalSlabs = values?.slabs?.length;

    const secondLastSlabToValue = Math.abs(watchToFields[`slabs[${totalSlabs - 1}].toValue`]);
    secondLastSlabToValue
      ? append({
          fromValue:
            metricValue === "HOURS_ON_DUTY"
              ? Number((secondLastSlabToValue + stepsToAutoAdd).toFixed(1))
              : parseInt(secondLastSlabToValue.toString()) + stepsToAutoAdd,
          toValue: undefined,
          rateType: undefined,
          rate: undefined,
        })
      : totalSlabs > 1 && changeNextSlabFromValue(watchToFields);
  };

  /*******        FUNCTIONS       ***********/
  const toFieldClick = (slabIndex: number) => {
    greaterThanFrom(slabIndex);
    addNewSlab();
    const values = getValues();
    const toValuePlaceholderArray = values?.slabs?.map(
      (obj: any) => obj.toValue
    );

    const nextFromValue =
      metricValue === "HOURS_ON_DUTY"
        ? (
            parseFloat(toValuePlaceholderArray[slabIndex]) + stepsToAutoAdd
          ).toFixed(1)
        : parseInt(toValuePlaceholderArray[slabIndex]) + stepsToAutoAdd;
    toValuePlaceholderArray[slabIndex + 1] = Math.abs(Number(nextFromValue));
    setToPlaceholder([...toValuePlaceholderArray]);
  };

  const truncateToSingleDecimal = (
    value: number,
    slabIndex: number,
    fieldKey: "from" | "to"
  ) => {
    if (metricValue == "HOURS_ON_DUTY" && isFloat(value) && !isNaN(value)) {
      setValue(`slabs[${slabIndex}].${fieldKey}Value`, value.toFixed(1));
    } else if (metricValue !== "HOURS_ON_DUTY" && !isNaN(value)) {
      setValue(
        `slabs[${slabIndex}].${fieldKey}Value`,
        parseInt(value.toString())
      );
    }
  };

  const changeRatetype_DataType = (slabsDataArray: Array<tSlabFields>) => {
    return slabsDataArray?.map((slabData: tSlabFields) => {
      return {
        ...slabData,
        // For Saving data rateType input is Object -> Convert it to string
        // For Reading data rateType input is String -> Convert it to object
        rateType:
          typeof slabData?.rateType === "string"
            ? {
                label:
                  slabData.rateType === "Fixed" ? "Flat Rate" : metricLabel,
                value: slabData.rateType,
                name: slabData.rateType,
                id: slabData.rateType,
              }
            : slabData?.rateType?.value,
      };
    });
  };

  const fillGivenData = (providedData: any) => {
    // Manipulate rateType to change from String to Object
    const newData = changeRatetype_DataType(providedData);
    !!providedData && reset({ slabs: newData });
  };

  const addSlabOnClick = () => {
    const values = getValues();

    const isAllFormAndRateFilled = values?.slabs?.every((slabObject: any) => {
      return !!slabObject.fromValue && !!slabObject.rate;
    });

    const lastValue =
      values?.slabs[values?.slabs?.length - 1]?.fromValue ||
      watchToFields[`slabs[${values?.slabs?.length - 1}].toValue`];

    isAllFormAndRateFilled
      ? append({
          fromValue:
            metricValue === "HOURS_ON_DUTY"
              ? Number((parseFloat(lastValue) + stepsToAutoAdd).toFixed(1))
              : parseInt(lastValue) + stepsToAutoAdd,
          toValue: undefined,
          rateType: undefined,
          rate: undefined,
        })
      : toast.add(
          slabDynamicLabels.pleaseEnterValues ||
            "Please enter values in the fields",
          "warning",
          false
        );
  };

  const saveData = async (inputData: any) => {
    const slabData = inputData?.slabs;
    const isFormValuesChanged = formInstance?.formState?.isDirty;

    if (slabData[0].rateType === undefined) {
      slabData[0].rateType = fields[0].rateType;
    }

    if (isRemoved || isFormValuesChanged) {
        const isGreaterThan = greaterThan(slabData);
        if (isGreaterThan) {
          //Hide Modal
          setIsSlabModalOpen && setIsSlabModalOpen(false);

          // Manipulate rateType to change from Object to String
          const manipulatedArray = changeRatetype_DataType(slabData);
          handleSave(manipulatedArray);
        } else {
          toast.add(
            slabDynamicLabels.toValueLessThanFrom ||
              "To value can not be less than From",
            "warning",
            false
          );
        }
    } else {
      setIsSlabModalOpen && setIsSlabModalOpen(false);
    }
  };

  const handleRemove = (index: number) => {
    removeElementCompletely(index);
    greaterThanFrom(index);
    addNewSlab();
    const values = getValues();
    const tempArray = changeToValueOnRemove(
      index,
      values?.slabs,
      stepsToAutoAdd
    );
    reset({ slabs: tempArray });

    const toValueArray = tempArray?.map((obj: any) => obj?.toValue);

    toValueArray[tempArray?.length - 1] = tempArray?.[tempArray?.length - 2]?.toValue
      ? metricValue === "HOURS_ON_DUTY"
        ? (
            parseFloat(tempArray?.[tempArray?.length - 2]?.toValue) +
            stepsToAutoAdd
          ).toFixed(1)
        : parseInt(tempArray?.[tempArray?.length - 2]?.toValue) + stepsToAutoAdd
      : "";
    setToPlaceholder([...toValueArray]);
    setIsRemoved(true);
  };

  useEffect(() => {
    givenSlabDataArray && fillGivenData(givenSlabDataArray);
  }, [givenSlabDataArray]);

  const [localCurrSymbol, setLocalCurrencySymbol] = useState("$");
  useEffect(() => {
    setLocalCurrencySymbol(currencySymbol);
  }, [currencySymbol]);

  return (
    <>
      {fields?.map((field, slabIndex) => {
        const rateLabel = `Rate (${localCurrSymbol})`;

        return (
          <Grid
            container
            spacing="10px"
            key={field.id}
            className={`slab${slabIndex} whole-slab-container`}
          >
            <Grid item xs={10} sm={10} md={10} className="4fields-item">
              <Grid container spacing="5px" className="4fields-container">
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key={`slabs[${slabIndex}].fromValue`}
                  className={`slab[${slabIndex}]-fromValue`}
                >
                  <FormFieldWrapper>
                  <TextInput
                    key={`slabs[${slabIndex}].fromValue`}
                    name={`slabs[${slabIndex}].fromValue`}
                    fullWidth
                    label={structure.fromValue.label}
                    maxLength={255}
                    ref={register()}
                    type="number"
                    required={structure.fromValue.required}
                    defaultValue={field.fromValue}
                    disabled={slabIndex !== 0 || isUpdateForm} // If it's not the first Slab then disable this.
                    placeholder="From"
                    onBlur={(event) =>
                      truncateToSingleDecimal(
                        Math.abs(event.target.valueAsNumber),
                        slabIndex,
                        "from"
                      )
                    }
                  />
                  </FormFieldWrapper>
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key={`slabs[${slabIndex}].toValue-grid`}
                  className={`slab[${slabIndex}]-toValue`}
                > 
                <FormFieldWrapper>
                  <TextInput
                    key={`${field.id}.toValue`}
                    name={`slabs[${slabIndex}].toValue`}
                    fullWidth
                    label={structure.toValue.label}
                    maxLength={255}
                    ref={register()}
                    type="number"
                    defaultValue={field.toValue}
                    required={structure.toValue.required}
                    disabled={
                      (slabIndex !== 0 && fields?.length - 1 === slabIndex) ||
                      isUpdateForm
                    } // if it is first slab then don't disable else disable for last slab
                    onChange={() => toFieldClick(slabIndex)}
                    onBlur={(event) =>
                      truncateToSingleDecimal(
                        Math.abs(event.target.valueAsNumber),
                        slabIndex,
                        "to"
                      )
                    }
                    error={hasError[slabIndex]}
                    errorMessage={
                      hasError[slabIndex]
                        ? "Value should be greater than From"
                        : " "
                    }
                    placeholder={
                      toPlaceholder?.[slabIndex]
                        ? `Greater than ${toPlaceholder[slabIndex]} and above`
                        : "To"
                    }
                  />
                  </FormFieldWrapper>
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key={`slabs[${slabIndex}].rateType-grid`}
                  className={`slab[${slabIndex}]-rateType`}
                >
                  <FormFieldWrapper isDisabled={!structure.rateType.editable}>
                  <FormField
                    key={`${field.id}.rateType`}
                    name={`slabs[${slabIndex}].rateType`}
                    meta={structure.rateType}
                    formInstance={formInstance}
                    options={[
                      {
                        label: "Flat Rate",
                        value: "Fixed",
                        name: "Fixed",
                        id: "Fixed",
                      },
                      {
                        label: metricLabel,
                        value: "Per_Order",
                        name: "Per_Order",
                        id: "Per_Order",
                      },
                    ]}
                  />
                  </FormFieldWrapper>
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key={`slabs[${slabIndex}].rate-grid`}
                >
                  <FormFieldWrapper>
                  <TextInput
                    key={`${field.id}.rate`}
                    name={`slabs[${slabIndex}].rate`}
                    fullWidth
                    label={rateLabel}
                    maxLength={255}
                    ref={register()}
                    required={structure.rate.required}
                    type="number"
                    disabled={isUpdateForm}
                    defaultValue={field.rate}
                    placeholder={rateLabel}
                    onBlur={(event) => {
                      setValue(`slabs[${slabIndex}].rate`, Math.abs(event.target.valueAsNumber))
                    }}
                  />
                  </FormFieldWrapper>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              className="addition/deletion button"
              style={{ display: "flex" }}
            >
              <RepeatButtonsWrapper>
                {fields?.length != 1 && fields?.length - 1 !== slabIndex && (
                  <IconButton
                    onClick={() => {
                      handleRemove(slabIndex);
                    }}
                    color="red"
                    disabled={isUpdateForm}
                    iconVariant="icomoon-close"
                    iconSize="xs"
                    onlyIcon
                    className="icon-Remove"
                  />
                )}
                {(fields?.length == 1 || fields?.length - 1 == slabIndex) && (
                  <IconButton
                    onClick={addSlabOnClick}
                    color="green"
                    disabled={isUpdateForm}
                    iconVariant="add"
                    iconSize="xs"
                    onlyIcon
                    className="icon-Add"
                  />
                )}
              </RepeatButtonsWrapper>
            </Grid>
          </Grid>
        );
      })}
      <FlexContainer
        flexDirection="row"
        justifyContent="flex-end"
        width="100%"
        margin="20px 0 0 0"
      >
        <IconButton
          iconVariant="icomoon-save"
          iconSize={11}
          primary
          onClick={() => {
            if(areAllFieldsFilled(getValues().slabs, metricValue)){
              handleSubmit(saveData)();
            }else{
              toast.add(
                slabDynamicLabels.pleaseFillValues || "Please fill the values",
                "warning",
                false
              );
            }
          }}
          disabled={isUpdateForm || !formInstance.formState.isDirty}
        >
          Save
        </IconButton>
        <IconButton
          iconVariant="icomoon-close"
          iconSize={11}
          onClick={() => setIsSlabModalOpen(false)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </IconButton>
      </FlexContainer>
    </>
  );
};

export default SlabFields;
