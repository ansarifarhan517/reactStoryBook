import React from 'react'
import { TextInput } from 'ui-library';
import withRedux from '../../../../../utils/redux/withRedux';
import { DraggableComponent } from '../../../../../utils/components/Draggable/DraggableComponent';
import { TableCSS } from '../TrackerManagementStyledComponents';


const TableComponent = ({ structure, setStructures, tableArray, setTableData, questionIdentifier, allData }: any) => {

    const deleteTableRow = (key :number, id) => {
        const clonedTableValuea  = [...tableArray]
        clonedTableValuea.splice(key, 1);
        if(questionIdentifier === 'QUE_TRACKER_TYPE'){
            let arrayy = [{'QUE_SUPPLIER': allData?.[0]?.QUE_SUPPLIER,'QUE_TRACKER_TYPE': clonedTableValuea}]
            setTableData(arrayy)
        }
        else {
            let arrayy = [{'QUE_SUPPLIER': clonedTableValuea,'QUE_TRACKER_TYPE': allData?.[0]?.QUE_TRACKER_TYPE}]
            setTableData(arrayy)
        }
    }

    const handleSetDropdownValues = (newState: any, questionIdentifier) => {
        if(questionIdentifier === 'QUE_TRACKER_TYPE'){
            let arrayy = [{'QUE_SUPPLIER': allData?.[0]?.QUE_SUPPLIER,'QUE_TRACKER_TYPE': newState}]
            setTableData(arrayy)
        }
        else {
            let arrayy = [{'QUE_SUPPLIER': newState,'QUE_TRACKER_TYPE':  allData?.[0]?.QUE_TRACKER_TYPE}]
            setTableData(arrayy)
        }
    }

    return <TableCSS>
      <table className='sortable-table'>
        <thead>
            <tr>
                <th style={{width:'30px'}}></th>
                {Object.values(structure).map((column : any, index: number) => {
                    return <th style={{width: (index === 0 || index === 3)? '125px': 'auto'}}>{column.label}</th>
                })}
            </tr>
        </thead>
        <tbody ui-sortable='' >
            {tableArray && tableArray.length ?
                <DraggableComponent sort={true} list={tableArray} setList={(newState : any) => {handleSetDropdownValues(newState, questionIdentifier)}} >
                    {tableArray?.map((dropdownRow : any , index :number) => {
                        return <tr key={dropdownRow.id} >
                            <td style={{width:'30px',textAlign: 'center',verticalAlign: 'middle'}}><img src="images/Drag_Drop-Gray.svg" className="item-img"/></td>
                            <td style={{minWidth:'125px',verticalAlign: 'middle'}}>{index+1}</td>
                            <td style={{maxWidth:'315px', display:'table-cell',verticalAlign: 'middle'}}>{dropdownRow.newInputField ? <TextInput type="text" name='searchValue33' id='searchValues33' style={{border: 'none', borderBottom: '1px dashed black' }} variant='inline-edit'  onChange={(e: { target: { value: any } }) => dropdownRow.clientRefMasterCd = e.target.value}/> : dropdownRow.clientRefMasterCd}</td>
                            <td style={{maxWidth:'315px',display:'table-cell',verticalAlign: 'middle'}}>{dropdownRow.newInputField ? <TextInput type="text" name='searchValue22'  id='searchValue22' style={{border: 'none', borderBottom: '1px dashed black' }} variant='inline-edit' onChange={(e: { target: { value: any } }) => dropdownRow.clientRefMasterDesc = e.target.value}/> : dropdownRow.clientRefMasterDesc}</td>
                            <td style={{width:'125px',verticalAlign: 'middle'}} id={questionIdentifier}><div className="col-md-1 item-wrp" style={{top: '10px'}} onClick={() => deleteTableRow(index, questionIdentifier)}>
                            <i className="logi-icon icon-Product-Icons_Trash-FIll tracker-delete-action"></i>
                            </div></td>
                        </tr>
                     })}
                </DraggableComponent>: <></>
            }
        </tbody>
    </table></TableCSS>
}

export default withRedux(TableComponent)