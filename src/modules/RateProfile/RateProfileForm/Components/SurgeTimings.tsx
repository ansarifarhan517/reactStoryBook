import React from "react"; 
import {
  Grid,
  TextInput,
  Box,
  Modal,
  ModalHeader,
  IconButton,
  SectionHeader,
} from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { useFieldArray, useForm } from "react-hook-form";
import { SectionHeaderContainer } from "../../../../utils/components/Form/Form.styles";
// import ogData from "../data.json";
import {
  RepeatButtonsWrapper,
  ModalFooterButtonsWrapper,
} from "../../../../utils/components/GroupRepeat/styled";
import moment from "moment";

interface ISurgeTimingsProps {
  structure: any;
  formInstance: any;
  dynamicLabels?: Record<string, string>;
  name:string  
  data?:any,
  ogData:any
}

interface ISurgeStructureArray {
  dayOfWeek: any,
  startTime: Date,
  endTime: Date,
}

interface ISurgTimingObject {
  items: ISurgeStructureArray[]
}

const SurgeTimings = (props: ISurgeTimingsProps) => {
  const { structure, formInstance, name, data: data2, ogData } = props;

  const { setValue, getValues } = formInstance;

  const [surgeTimingModal, setSurgeTimingModal] = React.useState(false);

  const data: any = ogData["surgeTimings"];

  const fInstance = useForm<any>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {
      items: [
        {
          dayOfWeek: undefined,
          startTime: undefined,
          endTime: undefined,
        },
      ],
    },
  });

  const { control, handleSubmit, reset, getValues: getVals } = fInstance;

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const [count, setCount] = React.useState(0)

const handleOpen = () => {
  setSurgeTimingModal(true)
  repopulate()
}

  const repopulate = () => {
    const values = getValues()?.surchargeMappings?.surchargeSurgeTime?.surgeTimings
    setCount(values?.length || 0);

    const newObj = !!values && values?.map((obj:any) => {
      let startTime = obj?.startTime
      let endTime = obj?.endTime

      if(typeof startTime === 'number' ) {
        startTime = moment(obj?.startTime).toDate()
      } else {
        startTime = obj?.startTime?.replace('T','')
        startTime = startTime.replace('Z','')
        startTime = moment(obj?.startTime, `YYYY-MM-DDTHH:mm:ss`).toDate()
      } 

      if(typeof endTime === 'number' ) {
        endTime = moment(obj?.endTime).toDate()
      } else {
        endTime = obj?.endTime?.replace('T','')
        endTime = endTime.replace('Z','')
        endTime = moment(obj?.endTime, `YYYY-MM-DDTHH:mm:ss`).toDate()
      }
      

      const daysOfWeek = typeof obj?.dayOfWeek === 'string' ? obj?.dayOfWeek : obj?.dayOfWeek?.value
      return {
        dayOfWeek: { label: daysOfWeek,value: daysOfWeek, name:daysOfWeek , id: daysOfWeek },
        startTime: startTime,
        endTime:  endTime,
      }
    })
    !!newObj && reset({ items: newObj });
  }


  const handleRemove = (index:number) => {

    const values = getVals().items
    const newArray = [...values]
    newArray.splice(index,1)

    !!newArray && reset({items: newArray})
  }

  React.useEffect(() => {
    repopulate()

  },[data2])

  const onSubmit = (obj: ISurgTimingObject) => {
    const newObj = obj?.items?.map((obj:ISurgeStructureArray) => {
      return {
        dayOfWeek: typeof obj?.dayOfWeek !== 'string' ? obj?.dayOfWeek?.id : obj?.dayOfWeek,
        startTime: moment(obj?.startTime).format('YYYY-MM-DDTHH:mm:ss')+'Z',
        endTime: moment(obj?.endTime).format('YYYY-MM-DDTHH:mm:ss')+'Z'
      }
    })

    setValue(`${name}`, newObj);
    setSurgeTimingModal(false)
    
    setCount(newObj?.length || 0);

  };
 const checkModalHeight = () => {
  let modal = document.getElementById('modal-body-id');
  let height= modal?.offsetHeight;
  if(height && (height >= 0.6 * window.innerHeight)){
    if(modal){
      modal.style.maxHeight =  0.7 * window.innerHeight+'px';
      modal.style.overflow = "auto";
    }
  }
  else{
    modal? modal.style.maxHeight = "unset" : null
    modal?  modal.style.overflow = "unset": null
  }
 }
  return (
    
    <div className="SurgeTimingWrapper">
  
      <TextInput
        fullWidth
        name={structure.name}
        className={`formFieldWrapper-${structure.name}`}
        placeholder={structure.label}
        label={structure.label}
        required={structure.required}
        id={structure.name}
        value={`${count ? count : 0} Surge Timings`}
        onClick={handleOpen}
        variant="withIcon"
        iconVariant={"add"}
        iconSize={15}
        onIconClick={handleOpen}
      />
      <Modal
        open={!!surgeTimingModal}
        onToggle={() => {}}
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
                  <div className="ScrollableBody" style={{ width: "100%" }}>
                    {fields.map((props: any, index: number) => {
                 
                      return (
                        <div style={{display:'flex'}} key={props.id}>
                          <Grid item xs={10} sm={10} md={10} key={`${props.id}-GridParent`}>
                            <Grid container spacing="5px" key={`${props.id}-Grid`}>
                              <Grid
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                key={`items[${index}].daysOfWeek.${props.id}`}
                            
                              >
                                <FormField
                                  key={`${props.id}.dayOfWeek`}
                                  name={`items[${index}].dayOfWeek`}
                                  meta={data.dayOfWeek}
                                  formInstance={fInstance}
                                  // defaultValue={props.dayOfWeek}
                                  defaultValue={
                                    typeof props.dayOfWeek === "string"
                                      ? {
                                          label: props.dayOfWeek,
                                          value: props.dayOfWeek,
                                          name: props.dayOfWeek,
                                          id: props.dayOfWeek,
                                        }
                                      : props.dayOfWeek
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                key={`items[${index}].startTime.${props.id}`}
                              >
                                <FormField
                                  key={`${props.id}.startTime`}
                                  name={`items[${index}].startTime`}
                                  meta={data.startTime}
                                  formInstance={fInstance}
                                  defaultValue={props.startTime}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                key={`items[${index}].endTime.${props.id}`}
                              >
                                <FormField
                                  key={`${props.id}.endTime`}
                                  name={`items[${index}].endTime`}
                                  meta={data.endTime}
                                  formInstance={fInstance}
                                  defaultValue={props.endTime}
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
                              {fields.length != 1 &&
                                fields.length - 1 !== index && (
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
                                    checkModalHeight();
                                    append({ dayOfWeek: undefined, startTime: undefined, endTime: undefined})}
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

export default SurgeTimings;
