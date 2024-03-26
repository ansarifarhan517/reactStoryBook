import React from 'react';
import { IFetchDataOptions, ISelectedRows } from "ui-library";
import { IExceptionData } from './SubCompoenent.models';
import RaiseExceptionModal from "./RaiseExceptionModal"
import { withReactOptimized } from '../../../utils/components/withReact';

interface IRaiseExceptionProps {
    setSelectedRows?: Function
    fetchOptions: IFetchDataOptions
    selectedRows: Array<IExceptionData> | ISelectedRows | []
    isShowRaiseExceptionModal: boolean
    setIsShowRaiseExceptionModal?: Function
    listViewType: string
    onClose?: Function
    handleFetchData?: Function
}
const RaiseExceptionModalWithReact = (props: IRaiseExceptionProps) => <RaiseExceptionModal {...props}/>

export default withReactOptimized(RaiseExceptionModalWithReact);