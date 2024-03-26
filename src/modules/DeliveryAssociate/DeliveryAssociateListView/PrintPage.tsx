import React, { Fragment, useEffect } from 'react';
import { IListViewColumn } from 'ui-library'
import { IRowData } from './DeliveryAssociate.models';
import { StyledPrintPage } from './StyledDeliveryAssociate';



const PrintPage = ({ columns, data, handlePrint, isPrint }: any) => {
    const headerList = columns?.map((column: any) => column.Header)
    const columnPropertyList = columns?.map((column: IListViewColumn) => column.accessor)
    const logoS3Path = JSON.parse(localStorage?.getItem('userAccessInfo') || '')['clientLogo']

    useEffect(() => {
        if (isPrint) {
            handlePrint()
        }
    }, [isPrint])



    const body = data?.map((row: IRowData) => {
        return <tr key={row.deliveryMediumMasterId}>{
            columnPropertyList.map((columnKey: string, index: number) => {
                if (columnKey === 'customFieldsJSONString' && row[columnKey]) {
                    //"[{"type": "checkbox", "field": "cf_xcvbnm", "value": "N"}, {"type": "checkbox", "field": "cf_sdfghj", "value": "N"}, {"type": "text", "field": "cf_commission", "value": "9"}]"
                    const groupOfProperties = JSON.parse(row[columnKey] || '[]')
                    groupOfProperties.map((customProperty: any) => {
                        if (columnPropertyList.includes(customProperty?.field)) {
                            //td
                            return <td key={customProperty.field + row.deliveryMediumMasterId}>{customProperty.value || ""}</td>
                        }
                        return <Fragment key={customProperty.field + row.deliveryMediumMasterId} />
                    })
                } else if (typeof columnKey === 'object' && row[columnKey]) {
                    // { deliveryMediumMasterId: 243129, type: "LOGOUT"}
                    const objectTypePropKeys = Object.keys(row[columnKey])
                    Object.values((nestedProp: any, index: number) => {
                        if (columnPropertyList.includes(objectTypePropKeys[index])) {
                            //td
                            return <td key={nestedProp + row.deliveryMediumMasterId + index}>{nestedProp}</td>
                        } return <Fragment key={nestedProp + row.deliveryMediumMasterId + index} />
                    })

                }
                //td
                return <td key={row.deliveryMediumMasterId + index}>{row[columnKey] ? row[columnKey] : ""}</td>

            })
        }
        </tr >
    })


    return (
        <StyledPrintPage id='printTable' style={{ display: 'none' }} >
            <img src={logoS3Path} alt='logo' style={{ fontSize: '13px', color: '#555', padding: '10px 0px 10px 0px', display: 'block', height: '60px', width: '60px' }} />
            <table style={{ overflow: 'auto' }}>
                <thead>
                    <tr>
                        {headerList?.map((header: string, index: number) => {
                            return <th key={header + index}>{header} </th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </StyledPrintPage>
    )

}

export default PrintPage