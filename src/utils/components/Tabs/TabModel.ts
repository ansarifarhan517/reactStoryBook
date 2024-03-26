import { ReactNode } from 'react';
export interface ITabButton {
  id: string;
  selected: boolean;
  onClick: () => void;
  children: any;
}

export interface ITabPanel {
  id: string;
  selected: boolean;
  children: ReactNode;
}

export interface ITabs {
  selected: string;
  onSelect: Function;
  children: ReactNode;
}

export interface ITabProps {
    id: string;
    label: string;
    children: ReactNode;
    icon?: ReactNode;
}


export interface ITabIndicator {
    tabButtons: HTMLButtonElement;
    tabIndicator: HTMLSpanElement;
    selected: string;
}

export interface ITab {
    children: ReactNode;
    icon?: ReactNode;
    id: string;
    label: string;
}