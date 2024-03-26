export const isEmpty = (obj: object) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const usePagination = (data:Array<Record<string, any>>, currentPage: number, pageSize: number) => {
    const indexOfLastRecord = currentPage * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    const currentList = data.slice(indexOfFirstRecord, indexOfLastRecord);
   
    return currentList;
}    
