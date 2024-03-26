import React from 'react'
import { BorderButton } from './AddDynamicTags';
import TagsTableView from './TagsTableView';

const DynamicTagsTableComponent = ({ optionList, orderTagList, setOrderTagList, dynamicLabels, getNotifyTagsArray, setUpdateState, fromAlerts = false ,isWhatsappTouched= false, setIsWhatsappTouched}) => {

    const handleDropdownSelection = (value, index) => {
        const newTags = orderTagList.map((tag, idx) => index == idx ? { ...tag, value: value } : tag);
        setOrderTagList(newTags);
        fromAlerts ? (!isWhatsappTouched && setIsWhatsappTouched?.(true)) : setUpdateState(true);
    }
    
    const deleteTableRow = (index) => {
        setOrderTagList(prevData => [
            ...prevData.slice(0, index),
            ...prevData.slice(index + 1)
        ]);
        fromAlerts ? (!isWhatsappTouched && setIsWhatsappTouched?.(true)) : setUpdateState(true);
    }

    const handleSetDropdownValues = (newState) => {
        setOrderTagList(newState)
        fromAlerts ? (!isWhatsappTouched && setIsWhatsappTouched?.(true)) : setUpdateState(true);
    }

    const handleAddDropdown = () => {
        setOrderTagList((prevTags) => {
            return [
                ...(prevTags || []),
                { key: (prevTags.length + 1).toString(), value: '', mode: 'add' }
            ];
        });
    }

    return <>
        <div>
            <TagsTableView optionList={optionList} handleDropdownSelection={handleDropdownSelection} isDraggableView={true} getNotifyTagsArray={getNotifyTagsArray} dynamicLabels={dynamicLabels}  data={orderTagList} setData={(newState: any) => { handleSetDropdownValues(newState) }} deleteRow={deleteTableRow}/>
        </div>
        <BorderButton id={`Add dyamic-tags-actionBar-Button`} onClick={handleAddDropdown}> + {dynamicLabels?.add} Dynamic Tags</BorderButton>
    </>
}

export default DynamicTagsTableComponent

