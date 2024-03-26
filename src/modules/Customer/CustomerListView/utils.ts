

const manipulateStructure = (response) => {
    let manipulatedStructure = response.columns
      if (manipulatedStructure.nodeCount) {
        manipulatedStructure.nodeCount.searchable = true;
        manipulatedStructure.nodeCount.fieldType = 'customfieldnodecount'
      }
     const structure = {
        columns: {...manipulatedStructure},
        buttons: {...response.buttons}
    }
 return structure

}

const manipulateData = (response) => {
    const results = response.data.results.map((row) => {
        return row
      })
    const listData = {
        ...response.data,
        results,
        moreResultsExists: response.moreResultsExists
    }
    return listData
}

const manipulateCount = (response) => {
    const totalCount = response.moreResultsExists ? 10000 : response.data.totalCount;
    return totalCount
}

export {manipulateStructure, manipulateData, manipulateCount}