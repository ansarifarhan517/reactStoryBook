type obj = Record<string, any>

const isEmpty = (value: any) => value === undefined || value === null || value === ''

const isArray = (target: string[]) => Object.prototype.toString.call(target) === '[object Array]'

const isObject = (target: obj) => typeof target === 'object' && target

const computeValue = (obj: obj, map: string): any => !isEmpty(map) && map.split('.').reduce((a, b) => ((a && !isEmpty(a[b])) ? a[b] : ''), obj)

type schema = {
  path: string,
  pattern?: RegExp,
  message: string,
  emptyCheck?: boolean,
  custom?: (model: any, value: string, params?: obj) => boolean,
}[]

const validatePayload = (schema: schema, model: obj, params = {}) => {
  const errorMap: obj = {}
  let count = 0
  schema.forEach(({
    path, custom, pattern, message, emptyCheck = false,
  }) => {
    const value = computeValue(model, path)
    const isInvalid = custom ? !custom(model, value, params) : (emptyCheck || value) && (pattern && !pattern.test(value))
    if (!errorMap[path] && isInvalid) {
      count += 1
      errorMap[path] = message
    }
  })

  return {
    isValid: count === 0,
    errorMap,
  }
}

const bemClass = (input: any = []) => {
  let [blk, elt, mods, className] = input
  const result: string[] = []
  if (isArray(elt) || isObject(elt)) {
    className = mods
    mods = elt
    elt = ''
  }

  const eltClass = elt ? `${blk}__${elt}` : blk
  result.push(eltClass)

  if (isArray(mods)) {
    mods.forEach((mod: any) => {
      const classStr = elt ? `${blk}__${elt}--${mod}` : `${blk}--${mod}`
      result.push(classStr)
    })
  }

  if (isObject(mods) && !isArray(mods)) {
    const modObjKeys = Object.keys(mods)
    modObjKeys.forEach((key) => {
      if (mods[key]) {
        const classStr = elt ? `${blk}__${elt}--${key}` : `${blk}--${key}`
        result.push(classStr)
      }
    })
  }

  if (className) {
    result.push(className)
  }

  return result.join(' ')
}

const getStorageType = (type: 'session' | 'local') => {
  if (type === 'local') {
    return localStorage
  }
  return sessionStorage
}

const setStorageItem = (type: 'session' | 'local', key: string, value: string) => getStorageType(type).setItem(key, value)

const getStorageItem = (type: 'session' | 'local', key: string) => getStorageType(type).getItem(key)

const removeStorageItem = (type: 'session' | 'local', key: string) => getStorageType(type).removeItem(key)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })

  return formattedDate
}
//@ts-expect-error
const objectToQueryString = (params: Record<string, string | number>) => new URLSearchParams(params).toString()

export {
  computeValue,
  validatePayload,
  bemClass,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  formatDate,
  objectToQueryString,
}
