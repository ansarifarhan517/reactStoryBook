export const checkValues = (values : any) => {
    for(let objKey in values) {
        switch(typeof values[objKey]) {
            case "object": {
                if(Array.isArray(values[objKey])) {
                    if(values[objKey].length > 0) return true;
                } else {
                    if(Object.keys(values[objKey]).length > 0) return true;
                }
            }
            case "boolean": {
                if(values[objKey] === true) return true;
            }
            default:
                break;
        }
    }

    return false;
}