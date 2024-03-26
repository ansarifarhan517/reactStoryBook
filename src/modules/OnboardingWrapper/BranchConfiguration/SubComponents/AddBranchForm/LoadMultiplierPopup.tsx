import React from "react";
import {
  Grid,
  TextInput,
  Box,
  Modal,
  ModalHeader,
  IconButton,
  SectionHeader,
  useToast,
  withToastProvider

} from "ui-library";
import FormField from '../../../../../utils/components/Form/FormField'
import { useFieldArray, useForm } from "react-hook-form";
import { SectionHeaderContainer } from "../../../../../utils/components/Form/Form.styles";
import ogData from "./data.json";
import {
  RepeatButtonsWrapper,
  ModalFooterButtonsWrapper,
} from "../../../../../utils/components/GroupRepeat/styled";
import { convertToDate, isEmpty, prepareLoadMultiplierObject, ValidateStartTimeEndTime } from "../../utils";
import { OverNightShiftContent } from "../../BranchConfigurationStyledComponents";
import { useEffect } from "react";

const checkModalHeight = () => {
  let modal = document.getElementById('modal-body-id');
  let height = modal?.offsetHeight;
  if (height && (height >= 0.6 * window.innerHeight)) {
    if (modal) {
      modal.style.maxHeight = 0.7 * window.innerHeight + 'px';
      modal.style.overflow = "auto";
    }
  }
  else {
    modal ? modal.style.maxHeight = "unset" : null
    modal ? modal.style.overflow = "unset" : null
  }
}

const addModalScroll = (flag: boolean) => {
  let modal = document.getElementById('modal-body-id');
  if (flag) {
    if (modal) {
      modal.style.maxHeight = 0.7 * window.innerHeight + 'px';
      modal.style.overflow = "auto";
    }
  } else {
    modal ? modal.style.maxHeight = "unset" : null
    modal ? modal.style.overflow = "unset" : null
  }
}


const Emptyitems = [{
  daysOfWeek: undefined,
  startTime: undefined,
  endTime: undefined,
  loadFactor: undefined
}]

const getwatchFields = (fieldName: string, length: number) => {
  var foo = [];

  for (var i = 0; i <= length - 1; i++) {
    foo.push(`items[${i}].${fieldName}`);
  }
  return foo;
};
interface ISurgeTimingsProps {
  structure: any;
  formInstance: any;
  dynamicLabels?: Record<string, string>;
  name: string
  data?: any,
  clientData?: any
  messagePlacement?: "center" | "start" | "end"
  loadMultiplierRequiredError?:boolean
}

export interface ILoadMultiplierStructureArray {
  daysOfWeek: any,
  startTime: Date,
  endTime: Date,
  loadFactor: number
}

interface ILoadMultiplierObject {
  items: ILoadMultiplierStructureArray[]
}

const LoadMultiplierPopup = (props: ISurgeTimingsProps) => {
  const { structure, formInstance, name, clientData, messagePlacement, loadMultiplierRequiredError } = props;

  const { setValue, getValues } = formInstance;

  const [surgeTimingModal, setSurgeTimingModal] = React.useState(false);
  const [errorArr, setErrorArr] = React.useState<null | any[]>(null)
  const data: any = ogData;


  const fInstance = useForm<any>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {
      items: [
        {
          daysOfWeek: undefined,
          startTime: undefined,
          endTime: undefined,
          loadFactor: undefined
        },
      ],
    },
  });

  const { control, handleSubmit, reset, getValues: getVals, watch } = fInstance;

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const [count, setCount] = React.useState(0)

  const handleOpen = () => {
  
    setSurgeTimingModal(true)
    repopulate()
  }

  useEffect(() => {
    setCount(clientData?.loadMultipliers?.length || 0)
  }, [clientData])

  const repopulate = () => {
    const values = getValues()?.loadMultipliers
    if (isEmpty(values)) {
      reset({ items: Emptyitems });
      setCount(0)
    } else {
      setCount(values?.length || 0);
      const newObj = !!values && values?.map((obj: any) => {
        const { startTime, endTime } = convertToDate(obj.startTime, obj.endTime)
        const daysOfWeek = typeof obj?.daysOfWeek === 'string' ? obj?.daysOfWeek : obj?.daysOfWeek?.value
        return {
          daysOfWeek: { label: daysOfWeek, value: daysOfWeek, name: daysOfWeek, id: daysOfWeek },
          startTime: startTime,
          endTime: endTime,
          loadFactor: typeof obj?.loadFactor === 'string' ? parseFloat(obj?.loadFactor) : obj?.loadFactor
        }
      })
      !!newObj ? reset({ items: newObj }) : reset({ items: Emptyitems });
      setTimeout(() => {
        addModalScroll(values?.length > 3)
      },[1000]) 
     
    }

  }

  const toast = useToast()

  const [saveClicked, setSaveClicked] = React.useState(false)

  const watchItemInput = watch([...getwatchFields('endTime', fields.length), ...getwatchFields('startTime', fields.length),  ...getwatchFields('daysOfWeek', fields.length) , ...getwatchFields('loadFactor', fields.length)])

  const handleRemove = (index: number) => {

    const values = getVals().items
    const newArray = [...values]
    newArray.splice(index, 1)
    !!newArray && reset({ items: newArray })
    // remove error arr
    const errors = errorArr && errorArr !== null && [...errorArr]
    errors && errors?.splice(index,1)
    !!errors && setErrorArr([...errors])
  }

  const handleAdd = () => {
    const values = getVals().items
    let flag = true;
    values?.forEach((obj: any) => {
      const daysOfWeek = typeof obj?.daysOfWeek === 'string' ? obj?.daysOfWeek : obj?.daysOfWeek?.id
      if (!daysOfWeek || !obj?.startTime || !obj?.endTime || !obj?.loadFactor) {
        
        toast.add("Please enter values in the fields", 'warning', false);
        flag = false
      }
    })
    flag && append({ daysOfWeek: undefined, startTime: undefined, endTime: undefined })
    flag && setSaveClicked(false)
    checkModalHeight();
   
  }

  React.useEffect(() => {
    repopulate()
  }, [])

  const onSubmit = (obj: ILoadMultiplierObject) => {
    const newObj = obj?.items?.map((obj: ILoadMultiplierStructureArray) => {
      return {
        daysOfWeek: typeof obj?.daysOfWeek !== 'string' ? obj?.daysOfWeek?.id : obj?.daysOfWeek,
        startTime: obj?.startTime ? `${obj?.startTime?.getHours() < 10 ? '0' + obj?.startTime?.getHours() : obj?.startTime?.getHours()}:${obj?.startTime?.getMinutes() < 10 ? '0' + obj?.startTime?.getMinutes() : obj?.startTime?.getMinutes()}` : undefined,
        endTime: obj?.endTime ? `${obj?.endTime?.getHours() < 10 ? '0' + obj?.endTime?.getHours() : obj?.endTime?.getHours()}:${obj?.endTime?.getMinutes() < 10 ? '0' + obj?.endTime?.getMinutes() : obj?.endTime?.getMinutes()}` : undefined,
        loadFactor: obj?.loadFactor ? typeof obj?.loadFactor === 'string' ? parseFloat(obj?.loadFactor) : obj?.loadFactor : undefined
      }
    })
    const modifiedObject = prepareLoadMultiplierObject(obj?.items)
    console.log(modifiedObject)


    if (isEmpty(obj?.items)) {
      setValue(`${name}`, Emptyitems);
      setCount(0);
      setSurgeTimingModal(false)
    } else {

      let flag = true;
      let errorArr: never[] = []
      newObj?.forEach((obj: any, index: number) => {
        const daysOfWeek = typeof obj?.daysOfWeek === 'string' ? obj?.daysOfWeek : obj?.daysOfWeek?.id
        if (!daysOfWeek) {
          flag = false
          errorArr[`${index}`] = {
            ...errorArr[`${index}`],
            daysOfWeek: true
          }
        } 

        if (!obj?.startTime) {
          flag = false
          errorArr[`${index}`] = {
            ...errorArr[`${index}`],
            startTime: true
          }
        }
        if (!obj?.endTime) {
          flag = false
          errorArr[`${index}`] = {
            ...errorArr[`${index}`],
            endTime: true
          }
        }
        if (!obj?.loadFactor) {
          flag = false
          errorArr[`${index}`] = {
            ...errorArr[`${index}`],
            loadFactor: true
          }
        } 
      })
      errorArr?.length > 0 ? setErrorArr([...errorArr]) : setErrorArr(null)
     
      if (flag) {
        if (ValidateStartTimeEndTime(newObj)) {
          setValue(`${name}`, newObj);
          setCount(newObj?.length || 0);
          setSurgeTimingModal(false)
        } else {
          toast.add('Timings for Load Multiple cannot overlap', 'warning', false)
        }
      }
    }
    setSaveClicked(true)
  };


  return (
    <div className="LoadMultiplierPopup" style={{ padding: '0px 15px', width:'100%' }}>
      <TextInput
        fullWidth
        name={`${structure.fieldName}-dummy`}
        className={`formFieldWrapper-${structure.fieldName}`}
        placeholder={structure.label}
        label={structure.label}
        required={structure.required}
        id={structure.name}
        value={`${count ? count : 0} ${structure.label}`}
        onClick={handleOpen}
        variant="withIcon"
        iconVariant={"add"}
        iconSize={15}
        onIconClick={handleOpen}
        tooltipMesaage={structure.infoFlag ? structure.tooltipLabel : ''}
        messagePlacement={messagePlacement || "center"}
        error={!count && loadMultiplierRequiredError}
        errorMessage={!count && loadMultiplierRequiredError ? 'Load Multiplier is mandatory' : ''}
      />
      <Modal
        open={!!surgeTimingModal}
        onToggle={() => { }}
        size="lg"
        width="900px"
      >
        {{
          header: (
            <ModalHeader
              width="100%"
              headerTitle={structure.label}
              imageVariant="icomoon-close"
              handleClose={() => {
                setSurgeTimingModal(false);
              }}
            />
          ),

          content: (
            <div className="">
              <Box
                horizontalSpacing="10px"
                display="block"
                justifyContent="flex-start"
              >
                <div>
                  <SectionHeaderContainer>
                    <SectionHeader headerTitle={`${structure.label} Details`} />
                  </SectionHeaderContainer>
                </div>
                {/* surge Timings */}
                <div className="ScrollableBody" style={{ width: "100%"}}>
                  {fields.map((props: any, index: number) => {
                    return (
                      <div style={{ display: 'flex' }} key={props.id}>
                        <Grid item xs={10} sm={10} md={10} key={`${props.id}-GridParent`}>
                          <Grid container spacing="5px" key={`${props.id}-Grid`}>
                            <Grid
                              item
                              xs={3}
                              sm={3}
                              md={3}
                              key={`items[${index}].daysOfWeek.${props.id}`}

                            >
                              <FormField
                                key={`${props.id}.daysOfWeek`}
                                name={`items[${index}].daysOfWeek`}
                                meta={data?.daysOfWeek}
                                formInstance={fInstance}
                                defaultValue={
                                  typeof props?.daysOfWeek === "string"
                                    ? {
                                      label: props.daysOfWeek,
                                      value: props.daysOfWeek,
                                      name: props.daysOfWeek,
                                      id: props.daysOfWeek,
                                    }
                                    : props.daysOfWeek
                                }
                                requiredError={saveClicked && !watchItemInput[`items[${index}].daysOfWeek`]}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sm={3}
                              md={3}
                              key={`items[${index}].startTime.${props.id}`}
                            >
                              <FormField
                                key={`${props?.id}.startTime`}
                                name={`items[${index}].startTime`}
                                meta={data?.startTime}
                                formInstance={fInstance}
                                defaultValue={props?.startTime}
                                // requiredError={errorArr && errorArr?.length > 0 && errorArr?.[index]?.startTime}
                                requiredError={saveClicked && !watchItemInput[`items[${index}].startTime`]}
                                timeInterval={15}
                              />

                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sm={3}
                              md={3}
                              key={`items[${index}].endTime.${props?.id}`}
                            >
                              <FormField
                                key={`${props?.id}.endTime`}
                                name={`items[${index}].endTime`}
                                meta={data?.endTime}
                                formInstance={fInstance}
                                defaultValue={props?.endTime}
                                requiredError={saveClicked && !watchItemInput[`items[${index}].endTime`]}
                                timeInterval={15}
                              />
                              <OverNightShiftContent>
                                {watchItemInput[`items[${index}].startTime`]?.getTime() > watchItemInput[`items[${index}].endTime`]?.getTime() ? 'Overnight' : ''}
                              </OverNightShiftContent>

                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sm={3}
                              md={3}
                              key={`items[${index}].loadFactor.${props.id}`}
                            >
                              <FormField
                                key={`${props?.id}.loadFactor`}
                                name={`items[${index}].loadFactor`}
                                meta={data?.loadFactor}
                                formInstance={fInstance}
                                defaultValue={props?.loadFactor}
                                requiredError={saveClicked && !watchItemInput[`items[${index}].loadFactor`]}
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
                          <RepeatButtonsWrapper style={{ height: '100%' }}>
                            {fields.length != 1 &&
                              (
                                <IconButton
                                  onClick={() => {
                                    checkModalHeight();
                                    handleRemove(index)
                                  }}
                                  color="red"
                                  disabled={false}
                                  iconVariant="icomoon-close"
                                  iconSize="xs"
                                  onlyIcon
                                  className="icon-Remove"
                                />
                              )}
                            {(fields.length == 1 ||
                              fields.length - 1 == index) && (
                                <IconButton
                                  onClick={() => {
                                    handleAdd()

                                  }
                                  }
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
                      </div>
                    );
                  })}
                </div>
                {/* surge Timings ends */}
              </Box>
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
                    setSurgeTimingModal && setSurgeTimingModal(false);
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </IconButton>
              </ModalFooterButtonsWrapper>
            </div>
          )
        }}
      </Modal>
    </div>
  );
};

export default withToastProvider(LoadMultiplierPopup, "toast-inject-here");
