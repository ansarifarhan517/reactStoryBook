import { ICrateData, ICrateItemData } from "../AddOrderForm/AddOrderForm.models";

export const updateCounter = (value: Array<ICrateData>, type: string, id?: string) => {
    var counter = 0;
    if (type == 'crate') {
        value.forEach((e: ICrateData) => {
            if (e.isDeleteFl == 'N') {
                e.crateCounter = ++counter;
            }
        })
    } else if (type == 'item') {
        value.forEach((e: ICrateData) => {
            if (e.id == id) {
                if (e.shipmentlineitems && e.shipmentlineitems.length) {
                    e.shipmentlineitems.forEach((ee: ICrateItemData) => {
                        if (ee.isDeleteFl == 'N') {
                            ee.itemCount = ++counter;
                        }
                    })

                }
            }
        })
    }
}