import { IMongoFormStructure } from "../../../../utils/mongo/interfaces"

export const generateCustomFieldsFormData = (structure: IMongoFormStructure, data: any): Record<string, any> => {
    const customFieldsSection = structure?.['additional information']
    const payload: any = []
  
    if (!customFieldsSection) {
      return payload
    }
    Object.keys(customFieldsSection).forEach(async (fieldKey) => {
      const fieldType = customFieldsSection[fieldKey].fieldType
  
      switch (fieldType) {
        case 'file':
  
          if (data[fieldKey]?.existingFiles.length) {
            payload.push({ field: fieldKey, value: data[fieldKey]?.existingFiles[0]?.shortUrl || '', type: fieldType })
          }
  
          if (data[fieldKey]?.newFiles.length) {
            payload.push({ field: fieldKey, value: data[fieldKey]?.newFiles[0]?.shortUrl || '', type: fieldType })
          }
          break
  
        default:
            if (data[fieldKey]) {
                payload.push({ field: fieldKey, value: data[fieldKey], type: fieldType })
            }
      }
    })
    return payload;
}

export const getTimezoneDateObject = (date) => {
    const utcToTzOffset = date['_offset'];
    let d = new Date(date);
    const localTzOffset = d.getTimezoneOffset();
    const totalOffset = utcToTzOffset + localTzOffset;
    if (totalOffset) {
      d.setMinutes(d.getMinutes() + totalOffset); 
    }
    return d;
} 