import React from "react";
import { GroupOptions, ReactSortable, SortableEvent } from "react-sortablejs";
import { IFieldSettings } from "../../../modules/OnboardingWrapper/CustomForms/CustomForms.models";
 
interface ItemType {
  id: string;
  name: string;
}
 
interface IProps{
  list: Array<IFieldSettings> | Array<ItemType> | any,
  setList:any,
  children?:any
  sort?: boolean
  group?: string | GroupOptions
  onClone?: (currentItem: IFieldSettings, evt: SortableEvent) => IFieldSettings;
}

export const DraggableComponent = ({list,setList,children,sort,onClone,group}:IProps) => {
  return (
    <ReactSortable sort={sort} group={group} clone={onClone} list={list} setList={setList}>
      {children}
    </ReactSortable>
  );
};

