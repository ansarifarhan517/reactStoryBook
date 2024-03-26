import React, { useState } from "react";
import {
  useForm,
  useFieldArray,

  // useWatch
} from "react-hook-form";
import { Grid, IconButton, TextInput, useToast, withToastProvider } from "ui-library";
import { RepeatButtonsWrapper, ModalFooterButtonsWrapper } from "./styled";
import FormField from "../Form/FormField";
import { BasicCostWrapper } from "./styled";
import { withThemeProvider } from "../../theme";

const getwatchFields = (length: number) => {
  var foo = [];

  for (var i = 0; i <= length - 1; i++) {
    foo.push(`items[${i}].toValue`);
  }
  return foo;
};

const getWatchRateType = (length: number) => {
  var foo = [];

  for (var i = 0; i <= length - 1; i++) {
    foo.push(`items[${i}].rateType`);
  }
  return foo;
}

const Validate = (values: any) => {
  return values?.every((obj: any, index: number) => {
    if (values?.length - 1 === index) {
      return !!obj.fromValue && !!obj.rate && !!obj.rateType;
    } else {
      return !!obj.fromValue && !!obj.rate && !!obj.rateType && !!obj.toValue;
    }
  });
};

const GreaterThan = (values: any) => {
  let flag = false
  flag = values?.every((element: any, index: number) => {
    if (index < values.length - 1) {
      if (parseFloat(element?.fromValue) < parseFloat(element?.toValue)) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  })
  return flag
}

const changeToValueOnRemove = (index: number, ToValueArray: any, stepper: number) => {

  const newArray = [...ToValueArray]
  newArray.splice(index, 1)

  const newness = newArray?.map((obj: any, idx: number) => {
    if (idx > 0 && idx >= index) {
      return {
        ...obj,
        fromValue: parseInt(newArray[idx - 1]?.toValue) + stepper,
        toValue: obj?.toValue ? obj?.toValue : ''
      }
    } else {
      return obj
    }
  })
  return newness
}

const moduleNameMapping = {
  distance: 0.1,
  volume: 0.1,
  weight: 0.1,
  piece: 1,
  CODhandlingFees: 0.1,
  insurance: 0.1,
};

const getMetric = (clientMetrics: any, dynamicLabels: any, moduleName: any) => {
  const obj = clientMetrics?.find((obj: any) => obj?.propertyKey?.toLowerCase() === moduleName?.toLowerCase())
  return dynamicLabels[obj?.propertyValue] ? dynamicLabels[obj?.propertyValue] : obj?.propertyValue.toLowerCase()
}

const BasicCostInput = ({
  data,
  handleModalShow,
  handleData,
  getBasedRates,
  moduleName,
  currencySymbol,
  clientMetrics,
  dynamicLabels,
  dropdownOptions
}: any) => {
  const stepper = moduleNameMapping[moduleName];

  const formInstance = useForm<any>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {
      items: [
        {
          fromValue: undefined,
          toValue: undefined,
          rateType: undefined,
          rate: undefined,
        },
      ],
    },
  });

  const { register, control, handleSubmit, watch, setValue, getValues, reset } =
    formInstance;

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const toast = useToast()

  const watchItemInput = watch([...getwatchFields(fields.length)]);
  const watchRateTypeSelect = watch([...getWatchRateType(fields.length)])
  const [zeroError, setZeroError] = useState([""]);
  const [error, setError] = useState([false]);
  const [fromError, setFromError] = useState([false]);
  const [rateError, setrateError] = useState([false]);
  const [currSymbol, setCurrSymbol] = useState("$");




  React.useEffect(() => {
    setCurrSymbol(currencySymbol);
    dynamicLabels
  }, [currencySymbol, clientMetrics, dynamicLabels]);

  console.log(watchRateTypeSelect)

  console.log(formInstance?.formState.isDirty);

  React.useEffect(() => {
    const defaultVal = getBasedRates();

    const newVal =
      !!defaultVal &&
      defaultVal.map((obj: any, index: number) => {
        let values = {};

        Object.keys(obj).forEach((key: any) => {
          let value
          if (key === "rateType") {
            value = obj?.[key]
          } else {
            if (obj?.[key] === 0 || obj?.[key]) {
              if (index === defaultVal?.length - 1 && key === 'toValue') {
                value = undefined
              } else {
                value = parseFloat(obj[key])
              }
            } else {
              value = undefined
            }
          }
          values = {
            ...values,
            [key]: value
          };
        });
        return values;
      });

    !!defaultVal && reset({ items: newVal });

    const ToValue = getValues();
    const ToArray = ToValue?.["items"].map((obj: any) => obj?.toValue);
    const length = ToValue?.["items"]?.length - 1;
    ToArray[length] = ToValue?.items?.[length - 1]?.toValue ? (parseFloat(ToValue?.items?.[length - 1]?.toValue) + stepper).toFixed(1) : undefined
    setToPlaceholder([...ToArray]);

  }, []);

  const [toPlaceholder, setToPlaceholder] = useState<string[]>([]);

  const someAction = () => {
    const values = getValues();
    const length = values?.items.length;

    parseFloat(watchItemInput[`items[${length - 1}].toValue`]) > 0
      ? append({
        fromValue:
          (parseFloat(watchItemInput[`items[${length - 1}].toValue`]) +
            stepper).toFixed(1),
        toValue: undefined,
        rateType: undefined,
        rate: undefined,
      })
      : length > 1 && changeFromValue(watchItemInput);
  };

  const handleToChange = (index: number) => {
    if (positiveValueCheck(index, 1, "to", error, setError)) {
      someAction();
      const ToValue = getValues();
      const ToArray = ToValue?.["items"].map((obj: any) => obj.toValue);
      ToArray[index + 1] = (parseFloat(ToValue?.items?.[`${index}`].toValue) + stepper).toFixed(1);
      setToPlaceholder([...ToArray]);
    }
  };
  const handleFromChange = (index: number) => {
    positiveValueCheck(index, 0, "from", fromError, setFromError);
  };

  const handleRateChange = (index: number) => {
    positiveValueCheck(index, 2, "rate", rateError, setrateError);
  };



  const addErrorAt = (index: number, valueError: any, setvalueError: any) => {
    const errorArr = [...valueError];
    errorArr[index] = true;
    setvalueError([...errorArr]);
  };

  const removeErrorAt = (index: number, valueError: any, setvalueError: any) => {
    const errorArr = [...valueError];
    errorArr[index] = false;
    setvalueError([...errorArr]);
  };

  const removeElementCompletely = (index: number) => {
    const errorArr = [...error];
    if (index > -1) {
      errorArr.splice(index, 1);
    }
    setError([...errorArr]);
  };

  const changeFromValue = (watchItemInput: any) => {
    Object.keys(watchItemInput).forEach((key, index) => {
      setValue(
        `items[${index + 1}].fromValue`,
        parseFloat(watchItemInput[key]) + stepper
      );
    });

    console.log(watchItemInput);
  };

  const greaterThanFrom = (index: number, newIndex: number, valueError: any, setvalueError: any) => {
    const fromValue: any = getValues(`items[${index}].fromValue`);
    const toValue: any = getValues(`items[${index}].toValue`);
    if (parseFloat(toValue) < parseFloat(fromValue)) {
      // debounce
      setTimeout(() => {
        addErrorAt(index, valueError, setvalueError);
        const errorArr = [...zeroError];
        errorArr[newIndex] = "greaterThanFromerror";
        setZeroError([...errorArr]);
      }, 1500);
    } else {
      // debounce
      setTimeout(() => {
        removeErrorAt(index, valueError, setvalueError);
        const errorArr = [...zeroError];
        errorArr[newIndex] = "false";
        setZeroError([...errorArr]);
      }, 1500);
    }

    return parseFloat(toValue) > parseFloat(fromValue);
  };



  let objectMap = {
    'from': 'fromValue',
    'to': 'toValue',
    'rate':'rate'
  }

  const positiveValueCheck = (index: number, newIndex: number, type: string, valueError: any, setvalueError: any) => {
    const toValue: any = getValues(`items[${index}].toValue`);

    let value: any = getValues(`items[${index}].${objectMap[type]}`)

    if (type === "to" && toValue >= 0) {
      greaterThanFrom(index, newIndex, valueError, setvalueError);
    }

    if (parseFloat(value) < 0) {
      // debounce
      setTimeout(() => {
        const errorArr1 = [...valueError];
        errorArr1[index] = true;
        setvalueError([...errorArr1]);

        const errorArr = [...zeroError];
        errorArr[newIndex] = "Zeroerror";
        setZeroError([...errorArr]);
      }, 1500);
      return false;
    } else {
      // debounce
      setTimeout(() => {
        if (type == "from" || type == "rate") {
          const errorArr1 = [...valueError];
          errorArr1[index] = false;
          setvalueError([...errorArr1]);

          const errorArr = [...zeroError];
          errorArr[newIndex] = "false";
          setZeroError([...errorArr]);
        }
      }, 1500);
      return true;
    }
  };

  const handleAppend = () => {
    const values = getValues();

    const flag = values?.items?.every((obj: any) => {
      return !!obj.fromValue && !!obj.rate;
    });

    const lastValue = values?.items[values.items.length - 1]?.fromValue || watchItemInput[`items[${length - 1}].toValue`]

    flag
      ? append({
        fromValue:
          (parseFloat(lastValue) +
            stepper).toFixed(1),
        toValue: undefined,
        rateType: undefined,
        rate: undefined,
      })

      : toast.add("Please enter values in the fields", 'warning', false);
  };

  const onSubmit = async (data: any) => {
    // const values = getValues()['items'];

    const isDirty = formInstance!.formState!.isDirty;
    if (data.items[0].rateType === undefined) {
      data["items"][0].rateType = fields[0].rateType;
    }

    // if not dirty then just close the modal
    if (isRemove || isDirty) {
      const flag = Validate(data.items);

      if (flag) {

        const flag2 = GreaterThan(data.items)
        if (!flag2) {
          toast.add(
            "To Value is greather than From",
            "warning",
            false
          );
        } else {
          handleModalShow && handleModalShow(false);
          const newData = data.items.map((d: any) => {
            return {
              ...d,
              rateType:
                typeof d?.rateType === "string"
                  ? d?.rateType
                  : d?.rateType?.value,
            };
          });
          handleData(newData);
        }

      } else {

        toast.add(
          "Please fill the values",
          "warning",
          false
        );
      }
    } else {
      handleModalShow && handleModalShow(false);
    }
  };

  const [isRemove, setIsRemoved] = useState(false)

  const handleRemove = (index: number) => {
    // remove(index);
    removeElementCompletely(index);
    someAction();
    const ToValue = getValues()
    const neARray = changeToValueOnRemove(index, ToValue.items, stepper)
    reset({ items: neARray });

    const ToArray = neARray?.map((obj: any) => obj?.toValue);

    ToArray[neARray?.length - 1] = neARray?.[neARray.length - 2]?.toValue ? (parseFloat(neARray?.[neARray.length - 2]?.toValue) + stepper).toFixed(1) : '';
    setToPlaceholder([...ToArray]);
    setIsRemoved(true)

  };

  const metric = getMetric(clientMetrics, dynamicLabels, moduleName)

  return (
    <BasicCostWrapper>

      <div className="">
        {toPlaceholder &&
          fields.map((props, index) => {

            let RateLabel = `Rate (${currSymbol})`
            if (moduleName === 'CODhandlingFees' || moduleName === 'insurance') {
              const rateType = Object.values(watchRateTypeSelect)?.[index]
              if (rateType) {
                if (typeof rateType === 'string') {
                  RateLabel = rateType === 'Percentage' ? `Rate (%)` : `Rate (${currSymbol})`
                } else {
                  RateLabel = rateType.value === 'Percentage' ? `Rate (%)` : `Rate (${currSymbol})`
                }
              }
            }

            return (
              <Grid container spacing="10px" key={props.id}>
                <Grid item xs={10} sm={10} md={10} key={props.id}>
                  <Grid container spacing="5px" key={props.id}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key={`items[${index}].fromValue-grid`}
                    // key={props.id}
                    >
                      <TextInput
                        key={`${props.id}.fromValue`}
                        fullWidth
                        // index={index}
                        name={`items[${index}].fromValue`}
                        label={moduleName === 'CODhandlingFees' || moduleName === 'insurance' ? `${data.fromValue.label} (${currSymbol})` : metric ? `${data.fromValue.label} (in ${metric})` : `${data.fromValue.label}`}
                        maxLength={255}
                        ref={register()}
                        type="number"
                        defaultValue={props.fromValue}
                        disabled={index !== 0}
                        placeholder="From"
                        error={fromError[index] && (zeroError[0] == "greaterThanFromerror" || zeroError[0] == "Zeroerror")}
                        errorMessage={
                          fromError[index] ? (zeroError[0] == "Zeroerror" ? "Value should be greater than zero" : "Value should be greater than To") : ""
                        }
                        onChange={() => handleFromChange(index)}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key={`items[${index}].toValue-grid`}
                    >
                      <TextInput
                        fullWidth
                        ref={register()}
                        type="text"
                        // index={index}
                        label={moduleName === 'CODhandlingFees' || moduleName === 'insurance' ? `${data.toValue.label} (${currSymbol})` : metric ? `${data.toValue.label} (in ${metric})` : `${data.toValue.label}`}
                        // data-id={random}
                        name={`items[${index}].toValue`}
                        key={`${props.id}.toValue`}
                        defaultValue={props.toValue}
                        disabled={index !== 0 && fields.length - 1 === index}
                        onChange={() => handleToChange(index)}
                        error={error[index] && (zeroError[1] == "greaterThanFromerror" || zeroError[1] == "Zeroerror")}
                        errorMessage={
                          error[index] ? (zeroError[1] == "Zeroerror" ? "Value should be greater than zero" : "To should be greater than From") : ""
                        }
                        placeholder={
                          // fields[index]?.fromValue ? `Greater than ${parseFloat(fields[index]?.fromValue)} and above` : ` `
                          toPlaceholder?.[index]
                            ? `Greater than ${parseFloat(
                              toPlaceholder[index]
                            )} and above`
                            : "To"
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key={`items[${index}].rateType-grid`}
                    >
                      <FormField
                        key={`${props.id}.rateType`}
                        name={`items[${index}].rateType`}
                        meta={data.rateType}
                        // index={index}
                        // id={`items[${index}].rateType`}
                        options={dropdownOptions[data.rateType.lookupType]}
                        formInstance={formInstance}
                        defaultValue={
                          typeof props.rateType === "string"
                            ? {
                              label: props.rateType,
                              value: props.rateType,
                              name: props.rateType,
                              id: props.rateType,
                            }
                            : props.rateType
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key={`items[${index}].rate-grid`}
                    >
                      <TextInput
                        fullWidth
                        ref={register()}
                        // index={index}
                        type="number"
                        label={RateLabel}
                        maxLength={255}
                        name={`items[${index}].rate`}
                        defaultValue={props.rate}
                        key={`${props.id}.rate`}
                        placeholder="rate"
                        error={rateError[index]}
                        errorMessage={
                          rateError[index] ? "Value should be greater than zero" : ""
                        }
                        onChange={() => handleRateChange(index)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  className="grid-item rateProfileForm"
                >
                  <RepeatButtonsWrapper>
                    {fields.length != 1 && fields.length - 1 !== index && (
                      <IconButton
                        onClick={() => {
                          handleRemove(index);
                        }}
                        color="red"
                        disabled={false}
                        iconVariant="icomoon-close"
                        iconSize="xs"
                        onlyIcon
                        className="icon-Remove"
                      />
                    )}
                    {(fields.length == 1 || fields.length - 1 == index) && (
                      <IconButton
                        onClick={handleAppend}
                        color="green"
                        disabled={false}
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
      </div>
      <Grid container>
        <ModalFooterButtonsWrapper>
          <IconButton
            iconVariant="icomoon-tick-circled"
            iconSize={11}
            primary
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </IconButton>
          <IconButton
            iconVariant="icomoon-close"
            iconSize={11}
            onClick={() => {
              handleModalShow && handleModalShow(false);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </IconButton>
        </ModalFooterButtonsWrapper>
      </Grid>
    </BasicCostWrapper>
  );
};

export default withThemeProvider(
  withToastProvider(BasicCostInput, "toast-inject-here")
);

