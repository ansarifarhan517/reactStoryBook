import { ICategory, ICategoryData } from './interfaces'

export const prepareAllArray = (
  dataArray: ICategoryData[],
  category: ICategory[],
  allLabel: string
) => {
  let mainArray = {}

  const newDataArray = dataArray.filter((f: any) => f.hideInAll !== true)
  category.forEach((m) => {
    const arr = dataArray.filter((f: any) => f.categoryId === m.id)
    mainArray = {
      ...mainArray,
      [m.id]: [...arr]
    }
  })
  const categoryObject = {
    id: 'all',
    value: 'all',
    label: allLabel as string
  }
  return {
    category: [categoryObject, ...category],
    data: {
      all: newDataArray,
      ...mainArray
    }
  }
}
