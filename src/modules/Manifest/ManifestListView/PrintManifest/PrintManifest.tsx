
import React, { useEffect } from 'react';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import moment from "moment";
import useClientProperties from '../../../common/ClientProperties/useClientProperties';


const PrintManifest = ({ printData, printTableStructure, handlePrint, isPrint }: any) => {

    const logoS3Path = JSON.parse(localStorage?.getItem('userAccessInfo') || '')['clientLogo']
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.manifest)
    const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
    const currentDate = moment(new Date()).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' hh:mm a')

    useEffect(() => {

    },[printTableStructure, printData])

    useEffect(() => {
        if (isPrint) {
            handlePrint()
        }
    }, [isPrint])


    return(
        <>
            <div id='printTable' >
                <div>
                    <div className="colmd4">
                        <img src={logoS3Path} alt='logo' style={{ height: '30px', width: '120px' }} />
                    </div>
                    <div className="colmd4" style={{ textTransform: 'uppercase', textAlign:'center', top:'30px', fontFamily: 'OpenSans-Semibold', fontSize: '11px'}}>
                        <b>{dynamicLabels.manifest}</b>
                    </div>
                    <div className="colmd4" style={{textAlign:'right', top:'30px', fontFamily: 'OpenSans-Semibold', fontSize: '11px'}}>
                        {dynamicLabels.date} : {currentDate}
                    </div>
                </div>

                {printData &&
                <div>
                    <table className="table table-condensed table-hover table-striped" style={{width:'100%', position:'relative', top:'2px'}}>
                        <thead>
                            <tr className="drsHeader" style={{textAlign:'center', height:'30px'}}>
                                <th colSpan={4}><b>{dynamicLabels.manifestNo}:</b> {printData[0]?.manifestId}</th>
                                <th colSpan={5}><b>{dynamicLabels.hubLbl} {dynamicLabels.name}:</b> {printData[0]?.branchName}</th>
                                <th colSpan={5} rowSpan={2} style={{width:'100px'}}><b>{dynamicLabels.hubLbl} {dynamicLabels.address}:</b> {printData[0]?.branchAddress}</th>
                            </tr>
                            <tr className="drsHeader" style={{textAlign:'left', height:'30px'}}>
                                <th colSpan={4}><b>{dynamicLabels.manifest} {dynamicLabels.date}:</b> {moment(printData[0]?.manifestUpdatedDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' hh:mm a') }</th>
                                <th colSpan={5}><b>{dynamicLabels.noOf} {dynamicLabels.order_p}:</b> {printData[0]?.totalOrders}</th>
                            </tr>
                        </thead>
                    </table>
                    {printTableStructure &&  
                        <table  style={{width:'100%', position:'relative', top:'5px'}}>
                            <thead>
                                <tr>
                                    {Object.values(printTableStructure.columns).map((col: any) => {
                                        return <th>{col.label}</th>
                                    })}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                { printData[0].shipmentsLst?.map((row: any) => {
                                    return <tr id={row.orderNo}><td>{row.orderNo}</td><td>{row.orderState}</td><td>{row.originAddress}</td><td>{row.destinationAddress}</td><td>{row.packageStatusCd}</td></tr>
                                })}
                            </tbody>
                        </table>
                    }
                </div>
                }


                <div style={{width:'100%', position:'relative', top:'60px'}}>
                    <div className="colmd6 ">
                        <div style={{fontWeight:'bold' }}>{dynamicLabels.checkedBy}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.name}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.signature}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.date}:</div>
                    </div>
                    <div className="colmd6 " style={{float:'right', position:'relative', left:'200px'}}>
                        <div style={{fontWeight:'bold' }}>{dynamicLabels.handedoverBy}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.name}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.signature}:</div>
                        <div style={{padding:'5px'}}>{dynamicLabels.date}:</div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PrintManifest