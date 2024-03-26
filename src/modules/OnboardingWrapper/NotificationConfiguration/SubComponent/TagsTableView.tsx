import React, { useMemo } from "react";
import { Box, DropDown } from 'ui-library';
import { DraggableComponent } from "../../../../utils/components/Draggable/DraggableComponent";

const TagsTableView = ({ optionList, handleDropdownSelection, data, setData, deleteRow, isViewMode, getNotifyTagsArray, dynamicLabels, isDraggableView }: any) => {
    const headers = useMemo(() => [dynamicLabels?.serialNumberKey || "Sr No.", dynamicLabels?.dynamicTags || "Dynamic Tags", dynamicLabels?.actionsKey || "Actions"], []);
    const findValueByKey = (keyToFind) => getNotifyTagsArray?.find((item) => item.key === keyToFind)?.labelValue;

    return (
        <>
            <table className='sortable-table'>
                <thead>
                    <tr>
                        {!isViewMode ? <th style={{ width: '30px' }}></th> : null}
                        {Object.values(headers).map((column: any, index: number) => {
                            return <th style={{ width: (index === 0 || index === 2) ? '125px' : '300px' }}>{column}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {isDraggableView ? 
                    <>
                        {data && data.length ?
                            <DraggableComponent sort={true} list={data} setList={setData} >
                                {data?.map((dropdownRow: any, index: number) => {
                                    return <tr key={dropdownRow.id} className='dynamic-tags-table'>
                                        <td className="draggable-icon"><img src="images/Drag_Drop-Gray.svg" alt="Draggable Icon" className="item-img" /></td>
                                        <td className="sr-no">{index + 1}</td>
                                        <td className="dynamic-tag">
                                            {dropdownRow?.mode === 'add' ?
                                                <Box className="draggable-cell-dropdown">
                                                    <DropDown
                                                        limitOptionsList={optionList && optionList.length}
                                                        value={dropdownRow?.value}
                                                        variant='dashed-dropdown'
                                                        optionList={optionList}
                                                        onChange={(value) => handleDropdownSelection(value, index)}
                                                        width="200px"
                                                    />
                                                </Box> : findValueByKey(dropdownRow?.value) 
                                            } 
                                        </td>
                                        <td className="sr-no" id={(index + 1).toString()}><Box className="item-wrp" pt="7px" onClick={() => deleteRow(index)} >
                                            <i className="logi-icon icon-Product-Icons_Trash-FIll tracker-delete-action"></i>
                                        </Box></td>
                                    </tr>
                                })}
                            </DraggableComponent> : null
                        }
                    </> : 
                    <>
                    {(Object.entries(data) as [string, string][]).map(([srNo, dynamicTags], index) => {
                        return <tr key={srNo} className='dynamic-tags-table'>
                            <td className="sr-no">{srNo}</td>
                            <td className="dynamic-tag">{findValueByKey(dynamicTags)}</td>
                            <td className="sr-no" id={(index + 1).toString()}><div className="col-md-1 item-wrp" style={{ top: '10px' }} aria-disabled={isViewMode}>
                                    <i className="logi-icon icon-Product-Icons_Trash-FIll tracker-delete-action" aria-disabled={isViewMode}></i>
                                </div></td>
                            </tr>
                        })}
                    </>
                    }
                </tbody>
            </table>
        </>
    )
};

export default TagsTableView;
