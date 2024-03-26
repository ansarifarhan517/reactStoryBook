
export interface IConsentManagementListData {
  isActiveFl: boolean;
  id: number;
  persona: string;
  name: string;
  options: {
    consentTypeId: number;
    triggerFields: Array<string>;
    showConsentOnLogin: boolean;
    logout: boolean;
    expiryDays?: number | null;
  };
}

export interface IConsentManagementListDataPayload {
  hasError?: boolean;
  message?: string;
  moreResultsExists?: false;
  uniquePersonas: string[];
  data: Array<IConsentManagementListData>;
}

export interface IConsentManagementState {
  listview: {
    data: IConsentManagementListDataPayload;
    uniquePersonas: string[];
    loading: boolean;
    activeConsentData: IConsentManagementListData;
    isAddConsentEnabled: boolean;
  };
}