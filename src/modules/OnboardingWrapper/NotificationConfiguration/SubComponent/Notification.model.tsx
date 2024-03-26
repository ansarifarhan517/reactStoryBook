import { EditorState } from "draft-js";

export type tDeletePayload = {
  id?: string;
  name?: string;
  smsMessage?: string;
  emailSubject?: string;
  emailBody?: string;
};

export type tUpdatedObj = {
  clientId?: number;
  emailBody: string;
  emailSubject: string;
  id?: string;
  isActiveFl: boolean;
  isDeleteFl: boolean;
  isEmailActiveFl: boolean;
  isIvrActiveFl: boolean;
  isSmsActiveFl: boolean;
  name: string;
  notificationType?: string;
  smsMessage: string;
  ivrMessage?: string;
  default?: boolean;
  isWhatsappActiveFl: boolean;
  templateName? : string;
  templateId? : string;
  whatsappMessage? : string;
  templateLanguage? : string;
  templateDynamicTags? : Record<string, string>
};

export type tPayload = {
  id?: string;
  name?: string;
  smsMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  isActiveFl?: boolean;
  isSmsActiveFl?: boolean;
  isEmailActiveFl?: boolean;
  ivrMessage?: string;
  isIvrActiveFl?: boolean;
  isWhatsappActiveFl?: boolean;
  templateName?: string;
  templateId?: string;
  whatsappMessage?: string;
  templateLanguage?: string;
  templateDynamicTags? : Record<string, string>
  orderedDynamicTags? :  Record<string, string>
};

export interface ICurrentStep {
  stepName?: string;
  stepNameLabel?: string;
  questions?: Array<{
    questionIdentifier: string;
    questionLabelKey: string;
    questionLabel: string;
    questionDescLabelKey: string;
    questionDescLabel: string;
  }>;
  [key: string]: any;
}

export type tCustomerNotificationProps = {
  currentStep: ICurrentStep;
  dynamicLabels: Record<string, string>;
  isLoading: boolean;
  structureColumns: never[];
  columnsData: never[];
  showAccordion: boolean;
  expanded: string;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  messageTemplateSetting: boolean;
  setMessageTemplateSetting: React.Dispatch<React.SetStateAction<boolean>>;
  stateUpdated: boolean;
  setUpdateState: React.Dispatch<React.SetStateAction<boolean>>;
  updatedObj: tUpdatedObj;
  setUpdatedObj: React.Dispatch<React.SetStateAction<{} | tUpdatedObj>>;
  toast: any;
  handleToggle: (accordianId: string, isExpanded?: boolean) => void;
  setColumnsData: React.Dispatch<React.SetStateAction<never[]>>;
  getColumnsData: () => Promise<void>;
  currentNotification: string;
  ivrAccess: boolean;
};
export type tTableArray = {
   key: string,
   value: string;
}
export type tGetNotifyTagsArray = {
  labelValue: string;
  value: string;
  key: string;
  url?: string;
  isCustomField?: boolean;
};

export interface IBreadcrumbOptionsProps {
  id: string;
  label: string;
}

export type tMessageTemplateSettingPageProps = {
  stateUpdated: boolean;
  setUpdateState: React.Dispatch<React.SetStateAction<boolean>>;
  updatedObj: tUpdatedObj;
  setUpdatedObj: React.Dispatch<React.SetStateAction<{} | tUpdatedObj>>;
  setMessageTemplateSetting: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
  getColumnsData: () => Promise<void>;
  dynamicLabels: Record<string, string>;
  currentNotification: string;
  ivrAccess: boolean;
  currentStep: ICurrentStep;
  columnsData: any;
};

export type tNotificationComponentProps = {
  structureColumns: any;
  columnsData: tUpdatedObj[];
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setColumnsData: React.Dispatch<React.SetStateAction<never[]>>;
  toast: any;
  setMessageTemplateSetting: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdatedObj: React.Dispatch<React.SetStateAction<{} | tUpdatedObj>>;
  dynamicLabels: Record<string, string>;
  currentNotification: string;
  ivrAccess: boolean;
};

export type tSMSNotificationProps = {
  editorStateSMS: EditorState;
  SMSEditorOnChange: (newEditorState: EditorState) => void;
  mentionSuggesstionsProp: {
    text: string;
    value: string;
  }[];
  dynamicLabels: Record<string, string>;
  tags: any;
  setEditorStateSMS: React.Dispatch<React.SetStateAction<EditorState>>;
};

export type tIVRNotificationProps = {
  editorStateIVR: EditorState;
  IVREditorOnChange: (newEditorState: EditorState) => void;
  mentionSuggesstionsProp: {
    text: string;
    value: string;
  }[];
  dynamicLabels: Record<string, string>;
  tags: any;
  setEditorStateIVR: React.Dispatch<React.SetStateAction<EditorState>>;
};

export type tEmailNotificationProps = {
  editorStateEmailSubject: EditorState;
  EmailSubjectEditorOnChange: (newEditorState: EditorState) => void;
  editorStateEmailBody: EditorState;
  EmailBodyEditorOnChange: (newEditorState: EditorState) => void;
  mentionSuggesstionsProp: {
    text: string;
    value: string;
  }[];
  dynamicLabels: Record<string, string>;
  tags: any;
  setEditorStateEmailBody: React.Dispatch<React.SetStateAction<EditorState>>;
  setEditorStateEmailSubject: React.Dispatch<React.SetStateAction<EditorState>>;
};

export type tDeleteModalProps = {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: tDeletePayload;
  setColumnsData: React.Dispatch<React.SetStateAction<never[]>>;
  toast: any;
  dynamicLabels: Record<string, string>;
  currentNotification: string;
};

export type tCustomerNotificationEntryProps = {
  currentStep: ICurrentStep;
  currentNotification: string;
};

export type tTagsFields = {
  customFieldModules?: [];
  id?: string;
  notificationKeys?: tGetNotifyTagsArray | [];
  notificationType?: string;
  tagGroupMappingList?: [];
}


export type tOrdertags = {
  key: string;
  value: string;
  chosen?: string;
  selected? : string;
  mode?: string;
}

export type tOptionList = {
  value: string;
  label: string;
  title: string;
}

export type tNotifyList = {
  key: string;
  value: string;
  labelValue: string;
}

export type tWhatsappNotificationProps = {
    whatsappToggle? : boolean,
    optionList?: tOptionList[]
    orderTagList?: tOrdertags[]| undefined;
    setOrderTagList?: React.Dispatch<React.SetStateAction<string[]>>;
    templateName: string | undefined;
    setTemplateName?: React.Dispatch<React.SetStateAction<string>>;
    templateId: string | undefined;
    setTemplateId?:React.Dispatch<React.SetStateAction<string>>;
    templateLanguage: string | undefined;
    setTemplateLanaguage?: React.Dispatch<React.SetStateAction<string>>;
    whatsappMessage : string 
    setWhatsappMessage?: React.Dispatch<React.SetStateAction<string>>;
    dynamicLabels?: Record<string,string>;
    templateDynamicTags?: Record<number,string>;
    getNotifyTagsArray?: tNotifyList[]
    setUpdateState?: React.Dispatch<React.SetStateAction<boolean>>;
    isViewMode?: boolean
    fromAlerts?: boolean
    isWhatsappTouched? :boolean
    setIsWhatsappTouched?:  React.Dispatch<React.SetStateAction<boolean>>;
    handleChange?: (key: string, value: string) => void;
}
