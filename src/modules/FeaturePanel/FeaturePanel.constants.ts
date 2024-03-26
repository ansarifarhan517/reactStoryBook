import { tIndustryType, tModelType, tSuperType } from '../../utils/common.interface'

export const tagSlugColorMapping = {
  default: '#5698d3',
  new: '#7dca5f',
  update: '#fcb043',
  revisit: 'rgba(150, 0, 150, 0.8)',
  explore: 'rgba(150, 0, 150, 0.8)'
}

export const productTags = new Set(['mile', 'allmile', 'haul'])
export const industryTags = new Set(['ecommerce', 'cep', 'cpg', 'retail', '3pl-logistics'])

export const industryBEToSlugMapping = {
  ECOMMERCE: 'ecommerce',
  COURIEREXPRESSANDPARCEL: 'cep',
  FMCGSECONDARY: 'cpg',
  RETAIL: 'retail',
  '3PLLOGISTICSPROVIDER': '3pl-logistics'
}

export const tagSlugToIdMapping = {
  new: 1681,
  update: 1682,
  revisit: 1683,
  explore: 1684,
  ecommerce: 1685,
  cep: 1686,
  cpg: 1687,
  retail: 1688,
  '3pl-logistics': 1689,
  mile: 65,
  allmile: 1679,
  haul: 1680
}

export const contentTagIds = new Set<number>([tagSlugToIdMapping.new, tagSlugToIdMapping.update, tagSlugToIdMapping.revisit, tagSlugToIdMapping.explore])
export const industryTagIds = new Set<number>([tagSlugToIdMapping.ecommerce, tagSlugToIdMapping.cep, tagSlugToIdMapping.cpg, tagSlugToIdMapping.retail, tagSlugToIdMapping['3pl-logistics']])
export const productTagIds = new Set<number>([tagSlugToIdMapping.mile, tagSlugToIdMapping.allmile, tagSlugToIdMapping.haul])

export const excludeAnnouncements = `${tagSlugToIdMapping.new},${tagSlugToIdMapping.update}`
export const excludeExplores = `${tagSlugToIdMapping.revisit},${tagSlugToIdMapping.explore}`

export const getPostsFilterTags = (type: 'announcement' | 'explore') => {
  let tags: number[] = []
  let tags_exclude: number[] = []

  const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')
  const userIndustryType: tIndustryType = userAccessInfo.industryType
  const industryTagId = userIndustryType ? tagSlugToIdMapping[industryBEToSlugMapping[userIndustryType]] : ''

  if (industryTagId) {
    tags.push(industryTagId)
    tags_exclude = [...tags_exclude, ...Array.from(industryTagIds).filter(tagId => tagId !== industryTagId)]
  }

  const modelType: tModelType = userAccessInfo.modelType
  const superType: tSuperType = userAccessInfo.superType

  let productTagId = tagSlugToIdMapping.mile
  if (superType === 'MIDDLEMILE') {
    productTagId = tagSlugToIdMapping.allmile
  }

  if (modelType === 'LH') {
    productTagId = tagSlugToIdMapping.haul
  }

  tags.push(productTagId)
  tags_exclude = [...tags_exclude, ...Array.from(productTagIds).filter((tagId) => tagId !== productTagId)]

  if (type === 'announcement') {
    tags.push(tagSlugToIdMapping.new)
    tags.push(tagSlugToIdMapping.update)
    tags_exclude = [...tags_exclude, ...Array.from(contentTagIds).filter((tagId) => tagId !== tagSlugToIdMapping.new && tagId !== tagSlugToIdMapping.update)]
  }

  if (type === 'explore') {
    tags.push(tagSlugToIdMapping.revisit)
    tags.push(tagSlugToIdMapping.explore)
    tags_exclude = [...tags_exclude, ...Array.from(contentTagIds).filter((tagId) => tagId !== tagSlugToIdMapping.revisit && tagId !== tagSlugToIdMapping.explore)]
  }

  return {
    tags: tags.join(','),
    tags_exclude: tags_exclude.join(',')
  }
}