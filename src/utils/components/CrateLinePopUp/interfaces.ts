
export interface IShipmentLineItemsProps {
    id: string
    isDeleteFl: 'N' | 'Y'
    [key:string]: any
}


export interface ICrate {
    id: string
    isDeleteFl: 'N' | 'Y'
    [key:string]: any
}

export interface ICrateColumnStructure {
    [key:string] : any
}
export interface ICrateLineProps {
    crateData: ICrate[]
    handleClose: () => void
    crateColumns: ICrateColumnStructure[]
    crateItemColumns: ICrateColumnStructure[]
    shipmentId?: string
    TemperatureDropdown?:any[]
    readMode:boolean
    handleSave: (obj:any) => void
}

export interface IExpandedProp {
    expanded: boolean
}

export interface IParentProps {
    crate:  ICrate[]
    handleDeleteCrate: (id:number) => void
    crateColumns:ICrateColumnStructure[]
    handleChange: (value:string,index: number, id: string ) => void
    crateItems:any 
    crateItemColumns: ICrateColumnStructure[]
    onAddCrateItem: (id:number) => void
    onDeleteCrateItem: (id:number, crateId:number) => void
    handleCrateItemChange:(value:string, index:number, id:string, crateId:number) => void
    TemperatureDropdown: any[] | undefined
    readMode: boolean
}

export interface IChildProps {
    crateId: string
    crateIndex: number
    crateItems:any 
    crateItemColumns:  ICrateColumnStructure[]
    onAddCrateItem: (id:number) => void
    onDeleteCrateItem: (id:number, crateId:number) => void
    handleCrateItemChange:(value:string, index:number, id:string, crateId:number) => void
    TemperatureDropdown: any[]
    readMode: boolean
}