import { IBranchManagerStructure, IOperationTimingsStructure, IShiftTimingStructure } from "./BranchConfiguration.models";


export const addShiftTiming = (lastField: IShiftTimingStructure[], key: string, length: number, isBranchManagerTouched: boolean) => {
    let newList = lastField.map((field: IShiftTimingStructure) => {
        let keys = Object.keys(field);
        let lastIndex = keys[3].split("-")[1];      
        let newField = {
          ['shiftTimingId']: field.shiftTimingId ? field.shiftTimingId === lastField[0].shiftTimingId ? null: field.shiftTimingId : null,
          [`daysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[1]],
            id: `daysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `daysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `shiftDayOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          [`shiftStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[2]],
            id: `shiftStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `shiftStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `shiftStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          [`shiftEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[3]],
            id: `shiftEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `shiftEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `shiftEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          branchManagerId: key !== '' ? key : 'shiftTiming',
          isSaved: isBranchManagerTouched ? true : false
        };
  
        return newField;
      });

    return newList;
}

export const addOperationsTiming = (lastField: IOperationTimingsStructure[], length: number) => {
    let newList = lastField.map((field: IOperationTimingsStructure) => {
        let keys = Object.keys(field);
        let lastIndex = keys[3].split("-")[1];
        let newField = {
          operationsTimingId: field.operationsTimingId ? field.operationsTimingId === lastField[0].operationsTimingId ? null : field.operationsTimingId : null,
          [`operationsDaysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[1]],
            id: `operationsDaysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `operationsDaysOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `operationsDayOfWeek-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          [`operationsStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[2]],
            id: `operationsStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `operationsStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `operationsStartTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          [`operationsEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`]: {
            ...field[keys[3]],
            id: `operationsEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            fieldName: `operationsEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            labelKey: `operationsEndTime-${Number(lastIndex) === length ? Number(lastIndex)+10 : length}`,
            permission: true
          },
          isSaved: false
        };
        return newField;
      });

    return newList;
}

export const addManager = (lastField:IBranchManagerStructure[], length: number) => {
    let newList = lastField.map((field: IBranchManagerStructure) => {
        let keys = Object.keys(field);
        let newField = {
          branchManagerId: field?.branchManagerId ? field?.branchManagerId === lastField[0]?.branchManagerId ? null : field?.branchManagerId : null,
          [`managerContactName-${length}`]: { ...field[keys[1]], id: `managerContactName-${length}`, fieldName: `managerContactName-${length}`, labelKey: `managerContactName-${length}`, permission: true, required: false },
          [`managerMobileNumber-${length}`]: { ...field[keys[2]], id: `mobileNumber-${length}`, fieldName: `mobileNumber-${length}`, labelKey: `managerMobileNumber-${length}`, permission: true },
          [`managerWhatsappOptin-${length}`]: { ...field[keys[3]], id: `managerWhatsappOptin-${length}`, fieldName: `managerWhatsappOptin-${length}`, labelKey: `managerWhatsappOptin-${length}`, permission: true },
          [`managerEmailAddress-${length}`]: { ...field[keys[4]], id: `managerEmailAddress-${length}`, fieldName: `managerEmailAddress-${length}`, labelKey: `managerEmailAddress-${length}`, permission: true },
          [`shiftTiming-${length}`]: { ...field[keys[5]], id: `shiftTiming-${length}`, fieldName: `shiftTiming-${length}`, labelKey: `shiftTiming-${length}`, permission: true, required: false },
        };
        return newField;
      });
      return newList;
}