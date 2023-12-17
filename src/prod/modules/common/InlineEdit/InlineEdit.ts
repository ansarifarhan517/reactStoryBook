import store from '../../../utils/redux/store';
import { EmailRegex, MobileNumberRegex} from './constant'

import moment from 'moment';
import { REGEXPS } from '../../../utils/constants';

export function validateRows(editDetails:any ,columnStructure: any) {
    Object.keys(editDetails).forEach(rowId => {
        Object.keys(editDetails[rowId]).forEach(columnId => {
            const validations = columnStructure?.[columnId]?.validation;
            const value = editDetails[rowId][columnId].value;
            const fieldType = columnStructure?.[columnId]?.fieldType

            if (validations?.required && !value) {
                throw {
                    rowId,
                    columnId,
                    message: validations?.required?.message || `${columnStructure[columnId].label} is required.`,
                };
            }

            if (validations?.minlength && String(value).length < Number(validations?.minlength?.args)) {
                throw {
                    rowId,
                    columnId,
                    message:
                        validations?.minlength?.message ||
                        `${columnStructure[columnId].label} length must be more than ${validations?.minlength?.args} character(s).`,
                };
            }

            if (validations?.maxlength && String(value).length > Number(validations?.maxlength?.args)) {
                throw {
                    rowId,
                    columnId,
                    message:
                        validations?.maxlength?.message ||
                        `${columnStructure[columnId].label} length cannot be more than ${validations?.maxlength?.args} character(s).`,
                };
            }

            if (validations?.max && Number(value) > Number(validations?.max?.args)) {
                throw {
                    rowId,
                    columnId,
                    message:
                        validations?.max?.message ? `${columnStructure[columnId].label} - ${validations?.max?.message}` : `${columnStructure[columnId].label} Maximum value must be ${validations?.max?.args}.`,
                };
            }

            if (validations?.min && Number(value) < Number(validations?.min?.args)) {
                throw {
                    rowId,
                    columnId,
                    message:
                        validations?.min?.message ? `${columnStructure[columnId].label} - ${validations?.min?.message}` : `${columnStructure[columnId].label} Minimum value must be ${validations?.max?.args}.`,
                };
            }

            if(fieldType === 'text' && !REGEXPS.htmltags.test(value)) {
                throw {
                    rowId,
                    columnId,
                    message: 'HTML Tags are not allowed'
                };
            }
        });
    });
} 
   
export function validateRowSETimes(editDetails: any, columnStructure: any, selectedRows:any, clientPropertiesDt: string) {
    let applySTValidation;
    let applyETValidation;
    let newSTTimeStamp;
    let newETTimeStamp;
    Object.keys(editDetails).forEach(rowId => {
        Object.keys(editDetails[rowId]).forEach(columnId => {
            let cpDateFormat = clientPropertiesDt?.toUpperCase() || "DD/MM/YYYY"
            let referenceST = selectedRows[rowId]["startTimeWindow"]  // start time was touched
            let referenceET = selectedRows[rowId]["endTimeWindow"]  // end time was touched
            if (columnId === "endTimeWindow" || columnId === "startTimeWindow") {
                newSTTimeStamp = newSTTimeStamp = 0 ? 0 : newSTTimeStamp
                newETTimeStamp = newETTimeStamp = 0 ? 0 : newETTimeStamp
                if (columnId === "startTimeWindow") {
                    let parsedSTW = moment(editDetails[rowId]["startTimeWindow"]?.value, `${cpDateFormat} HH:mm`)
                    newSTTimeStamp = parsedSTW.valueOf()
                }
                if (columnId === "endTimeWindow") {
                    let parsedETW = moment(editDetails[rowId]["endTimeWindow"]?.value, `${cpDateFormat} HH:mm`)
                    newETTimeStamp = parsedETW.valueOf()
                }
                
                applySTValidation = newSTTimeStamp > 0
                applyETValidation = newETTimeStamp > 0
                let showSTGrtMesg = false
                let showETLessMesg = false
                if ( applySTValidation && applyETValidation) { //  both ST & ET were modified
                    showSTGrtMesg = (newETTimeStamp < newSTTimeStamp) // so compare new values
                } else if (applySTValidation) {
                    showSTGrtMesg = !editDetails[rowId]['endTimeWindow']?.value && (referenceET < newSTTimeStamp)
                } else if (applyETValidation) {
                    showETLessMesg = (newETTimeStamp < referenceST)
                }
                const labelTxtSTW = columnStructure["startTimeWindow"]?.label || "Start Time Window"
                const labelTxtETW = columnStructure["endTimeWindow"]?.label || "End Time Window"
                if (showSTGrtMesg) {
                    throw {
                        rowId,
                        columnId,
                        message: `${labelTxtSTW} cannot be greater than ${labelTxtETW}.`,
                    };
                } else if (showETLessMesg) {
                    throw {
                        rowId,
                        columnId,
                        message: `${labelTxtETW} cannot be lesser than ${labelTxtSTW}.`,
                    };
                }
            }
        });
    });
}  
    
export const ValidateEmail = (email: string) => {
    if (EmailRegex.test(email)) {
        return true
    }
    return false
}

export const ValidateNumber = (mobile: string) => {
    if (mobile === '' || MobileNumberRegex.test(mobile)) {
        return true
    } return false
}


export function throwError(error:any) {  
    store.dispatch({
        type: '@@inlineEdit/SET_EDIT_DETAILS',
        payload: {
            rowId: error.rowId,
            columnId: error.columnId,
            value: error.value,
            hasError: true,
        }
    })
}



