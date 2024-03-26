export type tSendNotificationParam = {
  smsToBeSent?: boolean;
  smsMessage?: string;
  emailToBeSent?: boolean;
  emailSubject?: string;
  emailMessage?: string;
  ivrToBeSent?: boolean;
  ivrMessage?: string;
  whatsappToBeSent? : string;
  templateName? : string;
  templateId? : string;
  whatsappMessage? : string;
  templateLanguage? : string;
  templateDynamicTags? : Record<string,string>
};

export type tSelectedRows = {
  [key: string]: Record<string, any>;
}

export type tOrderMiddleMileNotificationModalEntryProps = {
  selectedRows: tSelectedRows,
  templateDataIndex: number,
  openModal: boolean,
  onClose: () => void,
}
