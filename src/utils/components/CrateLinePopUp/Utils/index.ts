export const PrepareCrateItemData = (crateData: any) => {
    // let data = []
    let ItemData = {}

    // console.log('prepare Crate Date', crateData, crateColumns, crateItemsColumns)

    crateData?.forEach((c: any, index: number) => {
        ItemData = Object.values(ItemData).length > 0 ? {
            ...ItemData,
            [index]: [...c?.shipmentlineitems]
        } : {
                [index]: [...c?.shipmentlineitems]
            }
    })
    console.log(crateData)
    return ItemData
}

export const prepareEmptyCrateData = (columns: any) => {

    let temp = {}
    Object.values(columns)?.forEach((c: any) =>
        temp = Object.keys(temp).length > 0 ? {
            ...temp,
            [c.id]: '',
            isDeleteFl: 'N'
        } : {
                [c.id]: '',
                isDeleteFl: 'N'
            }
    )
    return temp
}

export const prepareShipmentLineItemsObject = (arr: any[]) => {
    if (arr?.length !== 0) {

        return arr.filter((a: any) => {
            return a?.isDeleteFl === 'N' || a?.id
        }
        )
    }
    return false
}


export const PrepareAutomatedValidatingData = (crate: any, crateColumns: any, crateItems: any, crateItemColumns: any) => {
    console.log(crate, crateColumns, crateItems, crateItemColumns)
    let flag = undefined
    let flag2 = undefined
    flag = Object.values(crateColumns).every((c: any) => {
        if (Object.keys(c?.validation)?.length > 0) {
            flag2 = crate.every((co: any) => {
                if (c?.validation?.required) {
                    if (co?.[c.id]) {
                        if (co?.[c.id] !== '') {
                            return true
                        } else {
                            console.log('incomplete on required')
                            return false
                        }
                    } else {
                        console.log('incomplete on required')
                        return false
                    }
                } else {
                    return true
                }
            })

            return flag2

        } else {
            return true
        }
    })
    return flag


}