import React, { useEffect, useState } from "react";
import {
  ConditionWrapper,
  AddConditionWrapper,
  DropDownWrapper,
  ActionButtonWrapper,
} from "./styled";
import { FontIcon, IconButton, AdvFilterDropdown, useToast, Typography } from "ui-library";
import store from '../../../../utils/redux/store'
import {
    // generateUEID,
    // getObject,
    // removeObjectFromArray,
    // createSavedFiterDropdown,
     getString,
    // validateSort,
    // createNewArray,
    // arrayEquals
  } from '../Utils/index'

const Conditions = ({
  filterData,
  ThirdElement,
  fieldOperation,
  columnsData,
  onAddCondition,
  HSetColumnData,
  ThirdElementFormatter,
  sectionName,
}: any) => {
  console.log("fieldOperation", fieldOperation);
  const todaysDate = new Date();
  const [column, setColumn] = useState([]);
  const toast = useToast();
  const dynamicLabels= store.getState().dynamicLabels
  useEffect(() => {
    if (columnsData.length) {
      let refinedColumns: any = [];
      columnsData.map((col: any) => {
        refinedColumns.push({
          ...col,
          value: col.id,
          name: col.id,
          id: col.id,
          label: col.label,
          fieldType: col.fieldType,
        });
      });
      setColumn(refinedColumns);
    }
  }, [columnsData]);

  useEffect(() => {
    if (Object.keys(filterData)?.length && columnsData?.length) {
      Object.keys(filterData).map((key: any) => {
        let fieldType = columnsData?.filter(
          (column: any) => column.id == filterData[key].fieldId
        )?.[0]?.fieldType;
        let refinedOperations = Object.values(
          fieldOperation[fieldType]
            ? fieldOperation[fieldType]
            : fieldOperation["button"]
        ).map((operation: any) => {
          return {
            ...operation,
            label: operation.labelValue,
            name: operation.labelKey,
            value: operation.operation,
          };
        });
        let selectedOperation=refinedOperations.filter((op:any)=>op.operationSymbol==filterData[key].operationSymbol)?.[0]
        let newFieldType =selectedOperation?.operation === 'isnotempty' || selectedOperation?.operation === 'isempty'
        ? 'none'
        : (fieldType=='dropdown' && selectedOperation?.operation === 'in') || (fieldType=='dropdown' && selectedOperation?.operation === 'notin') || (fieldType=='select' && selectedOperation?.operation === 'in')
        ? 'multiselect'
        : fieldType;
        filterData[key] = {
          ...filterData[key],
          fieldOperation: refinedOperations,
          fieldType:fieldType,
          secondValue:selectedOperation,
          thirdElement: {
            type:newFieldType,
            value:filterData[key]?.filterData
          },
          customField: false,
          operationType:selectedOperation
        };
      });
    }
  }, [filterData, columnsData]);
  const initialState = {
    dropdownOptions: [...column],
    id: (Math.random() * 10000).toFixed(0),
    firstValue: undefined,
    fieldOperation: fieldOperation && Object.keys(fieldOperation).length ? [...fieldOperation["button"]] : "",
    showSecondField: false,
    showThirdField: false,
    fieldType: "",
    thirdElement: {
      type: undefined,
      value: "",
    },
    fieldId: "",
    operationSymbol: "",
    operationLabelKey: "",
    fieldLabelKey: "",
    labelValue: "",
    filterData: "",
    customField: false,
    editMode: true,
  };

  const [conditionsArr, setConditionsArr] = useState(
    filterData && Object.keys(filterData)?.length > 0
      ? filterData
      : { [initialState.id]: initialState }
  );
  const handleFirstDropdownChange = (id: number, valueObject: any) => {
    // let fieldType = columnsData.filter((data:any)=> data.id == value)?.[0]?.fieldType
    let refinedConditions = { ...conditionsArr };
    let refinedOperations = Object.values(
      fieldOperation[valueObject?.fieldType]
        ? fieldOperation[valueObject?.fieldType]
        : fieldOperation["button"]
    ).map((operation: any) => {
      return {
        ...operation,
        label: operation.labelValue,
        name: operation.labelKey,
        value: operation.operation,
      };
    });
    refinedConditions[id] = {
      ...conditionsArr[id],
      firstValue: { ...valueObject },
      showSecondField: true,
      fieldOperation: refinedOperations,
      fieldType: valueObject.fieldType,
      operationSymbol: "",
      operationLabelKey: "",
      secondValue: {},
      labelValue: "",
      thirdElement: {
        type: valueObject.fieldType,
        value:
          valueObject.fieldType === "calendar" ? [todaysDate, todaysDate] : "",
      },
      fieldId: valueObject.id,
      fieldLabelKey: valueObject?.label,
      customField: false,
      filterData: "",
    };
    setConditionsArr({ ...conditionsArr, ...refinedConditions });
  };
  const handleSecondDropdownChange = (id: string, e: any) => {
    console.log("HSetColumnData", HSetColumnData);
    const operationOptions = conditionsArr[id]?.fieldOperation;
    let obj = operationOptions;
    obj = obj || e;
    let newFieldType = conditionsArr[id]?.fieldType;
    if (
      (conditionsArr[id]?.fieldType == "dropdown" || conditionsArr[id]?.fieldType == "select") &&
      (e.value == "in" || e.value == "notin")
    ) {
      newFieldType = "multiselect";
    } else if (
      conditionsArr[id]?.fieldType == "multiselect" &&
      (e.value != "in" || e.value != "notin")
    ) {
      newFieldType = "dropdown";
    }
    let refinedConditions = { ...conditionsArr };
    refinedConditions[id] = {
      ...conditionsArr[id],
      showThirdField: !((e.labelKey === "isempty") || (e.labelKey === "isnotempty")),
      fieldType: newFieldType,
      operationSymbol: e.operationSymbol,
      operationLabelKey: e.labelKey,
      labelValue: e.labelValue,
      secondValue: e,
    };
    setConditionsArr({ ...conditionsArr, ...refinedConditions });
    onAddCondition(refinedConditions);
  };

  const handleThirdElementSetValue = (id: string, value: any) => {
    const filtervalue = Array.isArray(value)
      ? value.map((value: any) => {
            return value?.value;
          })?.toString()
      : value?.constructor === Object ? value.value : value;
    let refinedConditions = { ...conditionsArr };
    refinedConditions[id] = {
      ...conditionsArr[id],
      thirdElement: {
        type: refinedConditions[id].thirdElement?.type,
        value: value,
      },
      filterData: filtervalue,
    };
    setConditionsArr({ ...conditionsArr, ...refinedConditions });
    onAddCondition(refinedConditions);
    // )
  };
  const addNewRow = () => {
    const flag = Object.values(conditionsArr).map((condition: any) => {
      return condition.firstValue &&
        condition?.operationSymbol != "" &&
        condition?.thirdElement?.type !== ""
        ? true
        : false;
      //  return  condition.firstValue && condition?.operationSymbol !='' && (condition?.thirdElement?.type!=='' && condition?.thirdElement?.type=='none') ?  true : condition?.thirdElement?.value !=''
    });
    if (!flag.includes(false)) {
      const newFieldId =
        Object.keys(conditionsArr)?.[0] +
        Object.keys(conditionsArr)?.length +
        1;
      setConditionsArr({
        ...conditionsArr,
        [newFieldId]: { ...initialState, id: newFieldId },
      });
      console.log("conditionsArr", conditionsArr);
    } else {
      toast.add("Complete existing filter details first", "warning", false);
    }
  };
  const handleRemoveCondition = (id: any) => {
    let tempArr = { ...conditionsArr };
    delete tempArr[id];
    setConditionsArr(tempArr);
    onAddCondition(tempArr);
  };
  const getOptions = (options: any, conditionId: number) => {
    const tempConditions: any = [];
    conditionsArr &&
      Object.keys(conditionsArr)?.length &&
      Object.values(conditionsArr)?.map((condition: any) => {
        if (condition.id !== conditionId) {
          if (Object.keys(condition)?.includes("firstValue")) {
            const current = condition.firstValue;
            current
              ? tempConditions.push(
                  condition.firstValue
                    ? condition.firstValue
                    : condition?.firstValue?.value
                )
              : null;
          }
        }
      });
    const selectedIds = tempConditions.map((ser: any) => ser?.value);
    return options.filter((option: any) => !selectedIds.includes(option.id));
  };
  const activateEditMode=(id: string| number)=>{
    let tempArr = { ...conditionsArr };
    tempArr[id]={
      ...tempArr[id],
      editMode:true
    };
    setConditionsArr(tempArr);
    onAddCondition(tempArr);
  }
  const labelFormatter = React.useCallback(
    (data: any) => {
      if (ThirdElementFormatter) {
        return ThirdElementFormatter(data)
      } else {
        return data?.label || data?.value
      }
    },
    [ThirdElementFormatter]
  )
  return (
    <div>
      <ConditionWrapper>
        {Object.values(conditionsArr).map((conditions: any) => {
          return (<>
            {!conditions.editMode && <div className="RowSummaryWrapper">
            <Typography fontSize='14px' color='#646464'>
                        {(dynamicLabels[conditions.firstValue?.label] || conditions.firstValue?.label +
                          ' ' +(conditions.labelValue))}

                        <span
                          title={getString(
                            conditions.thirdElement?.label || conditions.thirdElement?.value
                          )}
                        >
                          {' ' +
                            getString(
                              labelFormatter(conditions.thirdElement)
                            )?.toString()}
                        </span>
                      </Typography>
              <ActionButtonWrapper>
                   <IconButton
                        onClick={() => activateEditMode(conditions.id)}
                        onlyIcon
                        iconVariant='icomoon-edit-empty'
                        iconSize='md'
                        color='black'
                        className="edit-button"
                      />
                       <IconButton
                        onClick={() => handleRemoveCondition(conditions.id)}
                        circle
                        iconVariant="icomoon-close"
                        iconSize={18}
                        color="error.lighterMain"
                        style={{ padding: "0px 5px" }}
                        className="delete-button"
                />
              </ActionButtonWrapper>
              </div>}
            {conditions.editMode && <div className="RowWrapper" key={conditions.id}>
              <DropDownWrapper className="InputWrapper">
                <AdvFilterDropdown
                  variant="form-select"
                  id="SelectColumn"
                  options={getOptions(column, conditions.id)}
                  placeholder="Select ..."
                  onChange={(value: any) => {
                    handleFirstDropdownChange(conditions.id, value);
                  }}
                  value={conditions.firstValue}
                />
              </DropDownWrapper>
              {conditions.showSecondField && (
                <DropDownWrapper className="InputWrapper">
                  <AdvFilterDropdown
                    placeholder="Select ..."
                    value={conditions.secondValue}
                    options={conditions.fieldOperation}
                    onChange={(e: any) => {
                      handleSecondDropdownChange(conditions.id, e);
                    }}
                  />
                </DropDownWrapper>
              )}
              { conditions.showThirdField && 
                <DropDownWrapper className="InputWrapper">
                <ThirdElement
                  key={conditions.id}
                  columnName={
                    conditions.firstValue?.value || conditions.firstValue
                  }
                  operationType={conditions?.operationType}
                  fieldType={conditions.fieldType}
                  value={conditions.thirdElement?.value}
                  setValue={(value: any) =>
                    handleThirdElementSetValue(conditions.id, value)
                  }
                  customSectionName={sectionName}
                  columns={columnsData}
                />
              </DropDownWrapper>
              }
              {/* { Object.values(conditionsArr)?.length>1 &&  */}
              <ActionButtonWrapper>
                <IconButton
                  onClick={() => handleRemoveCondition(conditions.id)}
                  circle
                  iconVariant="icomoon-close"
                  iconSize={18}
                  color="error.lighterMain"
                  style={{ padding: "0px 5px" }}
                  className="delete-button"
                />
              </ActionButtonWrapper>
              {/* } */}
            </div>}
          </>);
        })}
      </ConditionWrapper>

      <AddConditionWrapper
        onClick={() => {
          addNewRow();
        }}
      >
        <FontIcon variant="add" color="primary.main" size={10} />
        {"  "}Add Condition
      </AddConditionWrapper>
    </div>
 );
};

export default Conditions;
