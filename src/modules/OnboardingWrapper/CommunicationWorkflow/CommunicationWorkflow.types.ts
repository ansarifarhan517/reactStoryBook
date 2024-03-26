import React from "react";

export type tOperation = {
    channel: string;
    operator?: string;
}

export type tLevel = {
    channels: string[];
    conditions?: tOperation[];
}

export type tLevelComponentProps = {
    data: tLevel;
    position: number;
    isLastLevel: boolean;
    availableChannelsToAdd: string[];
    dispatch: React.Dispatch<tReducerAction>;
    prevLevelChannels: string[] | undefined;
    channelLabelMap: tChannelLabelMap;  
    dynamicLabels: Record<string, string>;
}

export type tUpdateChannelComponentProps = {
    channels: string[];
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    position: number;
    availableChannelsToAdd: string[];
    dispatch: React.Dispatch<tReducerAction>;
    channelLabelMap: tChannelLabelMap;  
    dynamicLabels: Record<string, string>;
}

export type tUpdateConditionsComponentProps = {
    conditions: tOperation[];
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    position: number;
    dispatch: React.Dispatch<tReducerAction>;
    prevLevelChannels: string[] | undefined;
    channelLabelMap: tChannelLabelMap;  
    dynamicLabels: Record<string, string>;
}

export type tChannels = {
    clientRefMasterId: number;
    clientRefMasterType?: string;
    clientRefMasterCd: string;
    clientRefMasterDesc: string
    clientId?: number
    isDeleteFl?: string
    id?: number
    name?: string
}

export type tChannel = { name: string, mode: 'VIEW' | 'ADD', key: number  };

export type tDropdownOptions = { label: string; value: string, isSelected?: boolean }

export type tChannelLabelMap = Record<string, string>;

export type tReducerState = {
    levels: tLevel[];
    prevLevels: tLevel[];
    channelLabelMap: tChannelLabelMap;  
    availableChannelsToAdd: string[];
}

export enum ReducerType {
    SET_INITIAL_STATE = 'SET_INITIAL_STATE',
    ADD_LEVEL = 'ADD_LEVEL',
    REMOVE_LEVEL = 'REMOVE_LEVEL',
    SAVE_CHANNEL = 'SAVE_CHANNEL',
    SAVE_CONDITIONS = 'SAVE_CONDITIONS',
    RESET_LEVELS = 'RESET_LEVELS'
}

export type tReducerAction =
  | { 
        type: ReducerType.SET_INITIAL_STATE; 
        payload: { levels: tLevel[]; channelLabelMap: tChannelLabelMap } 
    }
  | { type: ReducerType.ADD_LEVEL; payload: tLevel }
  | { type: ReducerType.REMOVE_LEVEL; }
  | {
      type: ReducerType.SAVE_CHANNEL;
      payload: { position: number; updatedChannels: string[]; deletedChannels: string[] };
    }
  | {
      type: ReducerType.SAVE_CONDITIONS;
      payload: { position: number; updatedConditions: tOperation[] };
    }
  |  { type: ReducerType.RESET_LEVELS; }
