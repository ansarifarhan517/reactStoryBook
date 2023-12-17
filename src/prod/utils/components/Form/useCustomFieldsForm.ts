import { useTypedSelector } from './../../redux/rootReducer';
import { ICustomFieldsEntity, IMongoFormStructure } from './../../mongo/interfaces';
import moment from 'moment-timezone'

export type tCustomFieldExecutableKey = 'file'
export type tCustomFieldExecutables = Record<tCustomFieldExecutableKey, () => Promise<boolean>>

export const useCustomFieldsForm = () => {
  const clientProperties = useTypedSelector(state => state.clientProperties)

  const getCustomFieldsFormData = (customFields: ICustomFieldsEntity[] = []): Record<string, any> => {
    const formData = {}
    customFields.forEach(({ type, value, field }) => {
      switch (type) {
        case 'date':
          formData[field] = value && moment.utc(value).tz(clientProperties?.TIMEZONE?.propertyValue)?.format('YYYY-MM-DDTHH:mm:ss')
          break

        case 'time':
          formData[field] = value && new Date(value)
          break

        case 'datetime':
          formData[field] = value && moment.utc(value).tz(clientProperties?.TIMEZONE?.propertyValue)?.format('YYYY-MM-DDTHH:mm:ss')
          break

        case 'file':
          formData[field] = {
            newFiles: [],
            existingFiles: value && [{ id: value, shortUrl: value, filename: value.split('/')[1]!==''? value.split('/')[1]: value.replace(/^.*[\\\/]/, ''), index: 0 }],
            deletedFiles: []
          }
          break

        default:
          formData[field] = value
          break
      }
    });

    return formData
  }

  const generateCustomFieldsFormData = (structure: IMongoFormStructure, data: any): Record<string, any> => {
    const customFieldsSection = structure?.['additional information']
    const payload = {}

    if (!customFieldsSection) {
      return payload
    }

    Object.keys(customFieldsSection).forEach(async (fieldKey) => {
      const fieldType = customFieldsSection[fieldKey].fieldType
      switch (fieldType) {
        case 'file':
          payload[fieldKey] = ''

          if (data[fieldKey]?.existingFiles.length) {
            payload[fieldKey] = data[fieldKey]?.existingFiles[0]?.shortUrl || ''
          }

          if (data[fieldKey]?.newFiles.length) {
            payload[fieldKey] = data[fieldKey]?.newFiles[0]?.shortUrl || ''
          }
          break

        default:
          payload[fieldKey] = data[fieldKey]
      }
    })

    return payload
  }

  const generateCustomFieldsFormDataAllSection = (structure: IMongoFormStructure, data: any): Record<string, any> => {

    const payload = {}
    Object.keys(structure).map((sectionName) => {
      Object.keys(structure[sectionName]).map((fieldKey) => {
        const fieldType = structure[sectionName][fieldKey].fieldType
        const customefiled = structure[sectionName][fieldKey].customField
        if (customefiled) {
          switch (fieldType) {
            case 'file':
              payload[fieldKey] = ''

              if (data[fieldKey]?.existingFiles.length) {
                payload[fieldKey] = data[fieldKey]?.existingFiles[0]?.shortUrl ? { val:data[fieldKey]?.existingFiles[0]?.shortUrl, type:fieldType} : ''
              }

              if (data[fieldKey]?.newFiles.length) {
                payload[fieldKey] = data[fieldKey]?.newFiles[0]?.shortUrl ? { val:data[fieldKey]?.newFiles[0]?.shortUrl, type:fieldType} : ''
              }
              break

              case 'date':
                var dateVal = data[fieldKey] && moment.utc(data[fieldKey]).tz(clientProperties?.TIMEZONE?.propertyValue)?.format('YYYY-MM-DDTHH:mm:ss')
                if(dateVal != undefined)
                  payload[fieldKey] = { val:dateVal, type:fieldType}
                break
      
              default:
                payload[fieldKey] = { val:data[fieldKey], type:fieldType}
          }
        }

      })
    })
    return payload
  }

  
 



  return { getCustomFieldsFormData, generateCustomFieldsFormData,generateCustomFieldsFormDataAllSection }
}
