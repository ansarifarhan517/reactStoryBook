// export const hybridRouteTo = (route: string) => {
//   window.open(`${window.location.origin}${window.location.pathname}#/${route}`);
// }
export const hybridRouteTo = (route?: string) => {
  if (route) {
    window.location.href = `${window.location.origin}${window.location.pathname}#/${route}`
  }
}

export const routeContains = (key: string): boolean => {
  return window.location.hash.indexOf(key) > -1
}

export const getQueryParams = (): Record<string, any> => {
  const url = window.location.hash
  const queryString = url.substr(url.indexOf('?'), url.length)
  const queryParamsIter: any = new URLSearchParams(queryString)
  const queryParams = {}
  Array.from(queryParamsIter).forEach(([key, value]: any) => {
    queryParams[key] = value
  })
  return queryParams
}

export const upsertUrlParam = (key: string, value: string) => {
  // if (history.pushState) {
  const hashTokens = window.location.hash.split('?')
  let searchParams = new URLSearchParams(hashTokens?.[1] || '');
  searchParams.set(key, value);
  let newurl = window.location.protocol + "//" + window.location.host + '/' + hashTokens[0] + '?' + searchParams.toString();
  window.history.pushState({ path: newurl }, '', newurl);
  // }
}
export interface IQueryParams {
  key: string
  value: string
}
export const setUrlParamList = (params: IQueryParams[]) => {
  const hashTokens = window.location.hash.split('?')
  let searchParams = new URLSearchParams();
  params.forEach((p) => {
    if (p.key) {
      searchParams.set(p.key, p.value);
    }
  })

  const searchParamsString = searchParams.toString()
  let newurl = window.location.protocol + "//" + window.location.host + '/' + hashTokens[0] +
    (searchParamsString ? '?' + searchParams.toString() : '');
  window.history.pushState({ path: newurl }, '', newurl);
}
export const createURLParams = (key: string, value: string) => {

  const hashTokens = window.location.hash.split('?')
  let searchParams = new URLSearchParams(hashTokens?.[1] || '');
  searchParams.set(key, value);
  return '?' + searchParams.toString();

}

export const createURLParamList = (params: IQueryParams[]) => {

  let searchParams = new URLSearchParams();
  params.forEach((p) => {
    if (p.key) {
      searchParams.set(p.key, p.value);
    }
  })

  const searchParamsString = searchParams.toString()

  return searchParamsString ? '?' + searchParams.toString() : ''
}


export const upsertUrlParamList = (params: IQueryParams[]) => {
  const hashTokens = window.location.hash.split('?')
  let searchParams = new URLSearchParams(hashTokens?.[1] || '');
  params.forEach((p) => {
    if (p.key) {
      searchParams.set(p.key, p.value);
    }
  })
  let newurl = window.location.protocol + "//" + window.location.host + '/' + hashTokens[0] + '?' + searchParams.toString();
  window.history.pushState({ path: newurl }, '', newurl);
}

export const deleteUrlParam = (key: string) => {
  const hashTokens = window.location.hash.split('?')
  let searchParams = new URLSearchParams(hashTokens?.[1] || '');
  searchParams.delete(key)
  let newurl = window.location.protocol + "//" + window.location.host + '/' + hashTokens[0] + '?' + searchParams.toString();
  window.history.pushState({ path: newurl }, '', newurl);
}
