import { fetchRequestObjectKey } from "../Mappings/backendKeyMapping";

export const processValues = (values : any) => {
    if(values === undefined) return {};

    let backendRequestObject = {};
    for(let objKey in values) {
        let array = objKey.split('_');
        let type = array[array.length - 1];
        let fieldKey = array.slice(0, array.length - 1).join('_');
        
        switch(type) {
            case "MULTISELECT": {
                let backendKey = fetchRequestObjectKey(fieldKey);
                let multiSelectValues = values[objKey].map((item : any) => item.value);
                let prevBackendKeyValues = backendRequestObject.hasOwnProperty(backendKey) ? backendRequestObject[backendKey] : [];

                if(multiSelectValues?.length > 0) {
                    backendRequestObject = {
                        ...backendRequestObject,
                        [backendKey]: [
                            ...prevBackendKeyValues,
                            ...multiSelectValues
                        ]
                    }
                }
                break;
            }
            case "TOGGLE": {
                let backendKey = fetchRequestObjectKey(fieldKey);
                backendRequestObject = {
                    ...backendRequestObject,
                    [backendKey]: values[objKey]
                }
                break;
            }
            default: 
                break;
        }
    }

    return backendRequestObject;
}