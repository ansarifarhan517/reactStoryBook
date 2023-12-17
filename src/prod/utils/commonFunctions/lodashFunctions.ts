//Writing isEqual Function to replace lodash functions

const isEqual = (firstObject, secondObject) => {

    if (typeof(firstObject) !== typeof(secondObject)) {
        return false;
    }

    if (firstObject === null || secondObject === null || firstObject === undefined || secondObject === undefined) {
        return firstObject === secondObject
    }

    if (typeof(firstObject) !== 'object') {
        return firstObject === secondObject
    }

    const keys1 = Object.keys(firstObject);
    const keys2 = Object.keys(secondObject);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!isEqual(firstObject[key], secondObject[key])) {
            return false;
        }
    }
    return true;
}


//Writing cloneDeep function to replace lodash function

const cloneDeep = (value) => {
    if (typeof(value) !== 'object' || value === null) {
        return value
    }

    let clone;

    if (Array.isArray(value)) {
        clone = [];
        for (let i = 0; i < value.length; i++) {
            clone[i] = cloneDeep(value[i])
        }
    } else {
        clone = {};
        for (let key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                clone[key] = cloneDeep(value[key]);
            }
        }
    }
    return clone
}

//writing debounce logic to replace the lodash ones

const debounce = (func, delay) => {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export { debounce, isEqual, cloneDeep }