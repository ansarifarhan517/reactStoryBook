import moment from 'moment';
import useClientProperties from '../modules/common/ClientProperties/useClientProperties';

export const getFormattedDate = (dateVal: string) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    return moment(dateVal).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`);
}

export const isInteger = (n: any) => {
    return ((typeof n === 'number') && (n % 1 === 0));
}

export const isFloat = (n: any) => {
    return ((typeof n === 'number') && (n % 1 !== 0));
}

export const isNumber = (n: any) => {
    return (typeof n === 'number');
}

export const twoDigitStringFormatter = (str: string) => {
    const splittedString = str.split('.')
    let decimalSlicing = splittedString[1] ? splittedString[1] : ''
    if (decimalSlicing && decimalSlicing.length > 2) {
        decimalSlicing = decimalSlicing.slice(0, 2)
        return `${splittedString[0]}.${decimalSlicing}`

    }
    return str
}
export const getUrlVars = (qs: string) => {
    qs = qs.split("+").join(" ")
  
    var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g
  
    while ((tokens = re.exec(qs))) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    }
  
    return params
  }
  



export const converMessageByDynamicLabel = (label: string,dynamicLabels:Record<string,string>) => {
    let newLabel = label.replaceAll('${deliveryBoy}', dynamicLabels?.deliveryboy_s)
    newLabel=newLabel.replaceAll('${deliveryBoys}', dynamicLabels?.deliveryboy_p)
    return newLabel
}

export const createHashMaps = (arr: any[]) => {
    let HashMapArray = {}
    arr && arr.length && arr.forEach(
        (m: any) =>
        (HashMapArray = {
            ...HashMapArray,
            [m.value]: m
        })
    )
    return HashMapArray
}

export const convertStringToDate = (input: string,format:string) => {
    const isValidDateEntered = moment(input, `${format}`).isValid()
    if (isValidDateEntered) {
        return moment(input, `${format}`).toDate()
    }
    return undefined
}

export const dateToString = (d: Date,format:string) => {
    return moment(d).format(format)
}

export const getSelectValuesArray = (hsetArray: any, value: string) => {
    const arrayOfValues: any[] = []
    const valueArr = value.split(',')
    valueArr.forEach((v: string) => {
        if (v && hsetArray[v]) {
            arrayOfValues.push(hsetArray[v])
        }
    })
    return arrayOfValues
}
