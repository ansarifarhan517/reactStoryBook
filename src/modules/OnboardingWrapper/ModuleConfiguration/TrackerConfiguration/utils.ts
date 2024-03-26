export const preparePayload = (formInputs: any) => {
  const {
      trackerModel,
      trackerTypeRefId,
      supplierRefId,
      ownership
  } = formInputs;

  const payload = {
      trackerModel:trackerModel,
      trackerTypeRefId:trackerTypeRefId ? trackerTypeRefId['clientRefMasterId']:null,
      supplierRefId: supplierRefId ? supplierRefId['clientRefMasterId']:null,
      ownership: ownership ? ownership['clientRefMasterId']: null
  }
  return payload
  
}