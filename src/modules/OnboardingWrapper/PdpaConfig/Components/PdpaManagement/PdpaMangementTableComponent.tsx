import React, { useState } from 'react'
import {  DropDown, Box } from 'ui-library';
import { BorderButton, SimpleTableCSS } from './PdpaManagementStyledComponent';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';

const PdpaMangementTableComponent = ({ dropDownOptions,tableArray,setTableData,handleDropdown, handleDelete }: any) => {
    const [value] = React.useState<string | undefined>()
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentManagement)


    const handleDropdownSelection = (value) => {
      setTableData(prevArr => [...prevArr, value]);
      setShowDropdown(false);
      handleDropdown(value);
    }

  return (
  <> 
  <SimpleTableCSS>
        <table className='simple-table'>
          <thead>
            <tr>
                <th style={{width:'30px'}}>Field</th>
                <th style={{width:'30px',textAlign:'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody >
          {tableArray && tableArray.length ?
          <>
          {tableArray?.map((item: any, index: number)=> {
           return <tr key={item}>
             <td>{item}</td>
             <td style={{width:'125px',verticalAlign: 'left', textAlign:'center'}} id={item}><div style={{top: '10px'}} onClick={() => handleDelete(item,index)}>
                        <i className="logi-icon icon-Product-Icons_Trash-FIll delete-action"></i>
                    </div></td> 
             </tr>
           })}
          </>: <></>
          }
          </tbody>
        </table>
        <Box fullWidth>
          {showDropdown && dropDownOptions?.length > 0  ? (
              <Box 
                fullWidth 
                style={{ 
                  padding: "15px 0", 
                  borderBottom: "1px solid #ddd",
                  ...(tableArray?.length > 0 && {
                    borderTop: "1px solid #ddd",
                  })
                }} 
              >
                  <DropDown
                    limitOptionsList={dropDownOptions.length}
                    variant="list-view"
                    optionList={dropDownOptions}
                    onChange={(value) => handleDropdownSelection(value)}
                    width="200px"
                    value={value}
                  />
              </Box>
          ) : (
            <></>
          )}
      </Box>
    </SimpleTableCSS>
    <BorderButton onClick={() => setShowDropdown(true)} disabled={dropDownOptions?.length === 0}>{dynamicLabels?.addNewTriggerFields}</BorderButton>
    </>
  )
}

export default PdpaMangementTableComponent;
