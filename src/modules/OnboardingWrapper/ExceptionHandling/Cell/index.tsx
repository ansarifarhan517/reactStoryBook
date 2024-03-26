import React from "react";
import { ComponentType } from "react";
import { Cell } from 'react-table'
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import store from "../../../../utils/redux/store";
import { exceptionStatusMappingCell, exceptionTypeMapping, IDropDownOption, orderStatusMappings } from "../ExceptionHandling.models";
import { CenteredContentWrapper, NumberCountWrapper } from "../ExceptionHandlingStyledComponents";
import {getFormattedDate} from "../utils"

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export const ALL_EXCEPTIONS_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    exceptionStage: React.memo(({ value }: Cell<any>) => {
        return <CenteredContentWrapper title={value}><NumberCountWrapper>{value.length}</NumberCountWrapper></CenteredContentWrapper>
    }, (p, n) => p.value === n.value),

    exceptionAppliesTo: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value.toString()}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),

    exceptionType: React.memo(({ value }: Cell<any>) => {
        const exceptionTypes = store.getState().exceptionHandling.lookup.exceptionTypes;
        const selectedException = exceptionTypes.filter((e) => e.clientRefMasterCd === value)?.[0]?.clientRefMasterDesc;
        return <TextOverflowEllipsis title={selectedException}>{selectedException}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    isActiveFl: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = store.getState().dynamicLabels;
        return <TextOverflowEllipsis title={value ? dynamicLabels.active : dynamicLabels.inactive}>{value ? dynamicLabels.active : dynamicLabels.inactive}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    exceptionRejectionTime: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value})
}

export const ALL_EXCEPTIONS_EDITABLE_CELL_MAPPING = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.active && dynamicLabels.inactive) {
            return [
                { value: 'Y', label: dynamicLabels.active, tooltipText: dynamicLabels.active },
                { value: 'N', label: dynamicLabels.inactive, tooltipText: dynamicLabels.inactive },
            ]
        } else {
            return []
        }
    },
    exceptionStage: async () => {
        const exceptionStages = store.getState().exceptionHandling.lookup.exceptionStages;
        if (exceptionStages.length > 0) {
            return exceptionStages.map((exceptionStage: IDropDownOption) => {
                return {
                    value: exceptionStage.name, label: exceptionStage.name, tooltipText: exceptionStage.name
                }
            })
        } else {
            return []
        }
    },
    exceptionType: async () => {
        const exceptionTypes = store.getState().exceptionHandling.lookup.exceptionTypes;
        if (exceptionTypes.length > 0) {
            return exceptionTypes.map((exceptionType: IDropDownOption) => {
                return {
                    value: exceptionType.clientRefMasterCd, label: exceptionType.clientRefMasterDesc, tooltipText: exceptionType.clientRefMasterDesc
                }
            })
        } else {
            return []
        }
    },
    exceptionAppliesTo: async () => {
        const exceptionAppliesTo = store.getState().exceptionHandling.lookup.exceptionAppliesTo;
        if (exceptionAppliesTo.length > 0) {
            return exceptionAppliesTo.map((exceptionApplies: IDropDownOption) => {
                return {
                    value: exceptionApplies.name, label: exceptionApplies.name, tooltipText: exceptionApplies.name
                }
            })
        } else {
            return []
        }
    },
    exceptionMode: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.manual && dynamicLabels.eventBased) {
            return [
                { value: 'Manual', label: dynamicLabels.manual, tooltipText: dynamicLabels.eventBased },
                { value: 'Event Based', label: dynamicLabels.eventBased, tooltipText: dynamicLabels.eventBased },
            ]
        } else {
            return []
        }
    }
}

export const ORDER_EXCEPTIONS_LISTVIEW_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    moduleStatus: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={orderStatusMappings[value]}>{orderStatusMappings[value]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    exceptionStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = store.getState().dynamicLabels;
        return <TextOverflowEllipsis title={dynamicLabels[exceptionStatusMappingCell[value]]}>{dynamicLabels[exceptionStatusMappingCell[value]]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    exceptionType: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={exceptionTypeMapping[value]}>{exceptionTypeMapping[value]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    createdOnDt: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value}),
    exceptionResolutionTime: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value}),
      exceptionRejectionTime: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value})



      

}

export const ORDER_EXCEPTIONS_EDITABLE_CELL_MAPPING = {
    exceptionStatus: async () => {
        const exceptionStatusList = store.getState().exceptionHandling.lookup.exceptionStatus;
        if (exceptionStatusList.length > 0) {
            return exceptionStatusList.map((exceptionStatus: IDropDownOption) => {
                return {
                    value: exceptionStatus.clientRefMasterCd, label: exceptionStatus.clientRefMasterDesc, tooltipText: exceptionStatus.clientRefMasterDesc
                }
            })
        } else {
            return []
        }
    },
    exceptionType: async () => {
        const exceptionTypeList = store.getState().exceptionHandling.lookup.exceptionTypes;
        if (exceptionTypeList.length > 0) {
            return exceptionTypeList.map((exceptionType: IDropDownOption) => {
                return {
                    value: exceptionType.clientRefMasterCd, label: exceptionType.clientRefMasterDesc, tooltipText: exceptionType.clientRefMasterDesc
                }
            })
        } else {
            return []
        }
    },
    moduleStatus: async () => {
        const orderStatusList = store.getState().exceptionHandling.lookup.orderStatus;
        if (orderStatusList.length > 0) {
            return orderStatusList.map((orderStatus: IDropDownOption) => {
                return {
                    value: orderStatus.clientRefMasterCd, label: orderStatusMappings[orderStatus.clientRefMasterCd], tooltipText: orderStatusMappings[orderStatus.clientRefMasterCd]
                }
            })
        } else {
            return []
        }
    }
}

export const MANIFEST_EXCEPTION_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    moduleStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels =  useTypedSelector((state) => state.dynamicLabels);
        return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    exceptionStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = store.getState().dynamicLabels;
        return <TextOverflowEllipsis title={dynamicLabels[exceptionStatusMappingCell[value]]}>{dynamicLabels[exceptionStatusMappingCell[value]]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    exceptionType: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={exceptionTypeMapping[value]}>{exceptionTypeMapping[value]}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    createdOnDt: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value}),
    exceptionResolutionTime: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value}),
  exceptionRejectionTime: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,'')}>{getFormattedDate(value,'')}</TextOverflowEllipsis>
      }, (p, n) => {return p.value === n.value})
      
}

export const MANIFEST_EXCEPTION_EDITABLE_CELL_MAPPING = {
    moduleStatus: async (dynamicLabels: Record<string, string>) => {
        return [
            { value: "NOTSCANNED", label: dynamicLabels["NOTSCANNED"], tooltipText: dynamicLabels["NOTSCANNED"]},
            { value: "INSCANNED", label: dynamicLabels["INSCANNED"], tooltipText: dynamicLabels["INSCANNED"] },
            { value: "OUTSCANNED", label: dynamicLabels["OUTSCANNED"], tooltipText: dynamicLabels["OUTSCANNED"] },
            { value: "HANDEDOVER", label: dynamicLabels["HANDEDOVER"], tooltipText: dynamicLabels["HANDEDOVER"] },
            { value: "CLOSED", label: dynamicLabels["CLOSED"], tooltipText: dynamicLabels["CLOSED"] },
        ]
    },
    exceptionStatus: async () => {
        const exceptionStatusList = store.getState().exceptionHandling.lookup.exceptionStatus;
        if (exceptionStatusList.length > 0) {
            return exceptionStatusList.map((exceptionStatus: IDropDownOption) => {
                return {
                    value: exceptionStatus.clientRefMasterCd, label: exceptionStatus.name, tooltipText: exceptionStatus.name
                }
            })
        } else {
            return []
        }
    },
    exceptionType: async () => {
        const exceptionTypeList = store.getState().exceptionHandling.lookup.exceptionTypes;
        if (exceptionTypeList.length > 0) {
            return exceptionTypeList.map((exceptionType: IDropDownOption) => {
                return {
                    value: exceptionType.clientRefMasterCd, label: exceptionType.clientRefMasterDesc, tooltipText: exceptionType.clientRefMasterDesc
                }
            })
        } else {
            return []
        }
    },
}