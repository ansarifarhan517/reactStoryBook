export interface IFormProps {
    /** Pending - Add Form Formats for each */
    [key: string]: any
  }
  export type tDatePickerChildren = {
    value?: Date
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedDay?:React.Dispatch<React.SetStateAction<string>>
    setNextCounter?:React.Dispatch<React.SetStateAction<number>>
    setPreviousCounter?:React.Dispatch<React.SetStateAction<number>>
    setCounter?:React.Dispatch<React.SetStateAction<number>>
    selectedDay?:string
    previousCounter?:number
    nextCounter?:number
    counter?:number
  }
  
  export interface ITerritoryList {
    isActiveFl: boolean
    isDefault: boolean
    profileId: number
    profileName: string
  }
  
  export interface IUserList {
  clientActivityEnabled: boolean
  handOverEnabled: boolean
  isActiveFl: boolean
  isHandOverComplete: boolean
  timezoneChanged: boolean
  userId: number
  userName: string
  }
  
  export interface IPlanningProfileList{
    isActiveFl: boolean
    isDefault: boolean
    profileId: number
    profileName: string
  }
  export interface IBranchList{
    branchDescription: string
    branchId: number
    clientNodeId: number
    id: number
    name: string
  }