
export const updateAdditionalDetailsCount = (values : Array<any>) => {
    let count = 0
    if(values?.length == 0){
        return null;
    }
    values?.map((value,index) => {        
      if(value?.isDeleteFl == 'N'){
        value.count = ++count;
      }
    })
    return count !== 0 ? count : null;
  }