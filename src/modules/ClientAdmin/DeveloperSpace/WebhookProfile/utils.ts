import { IAdditionalWebhookRecord } from "./OrganizationWebhookProfile/WebhookProfile.reducer"

export const addAdditionalHeader = (existingHeaders: IAdditionalWebhookRecord[]) => {
    const currentTimeStamp = new Date().getTime();
    const additionalWebhook = {
        [`Header-${currentTimeStamp}`]: {
            id: `Header-${currentTimeStamp}`,
            name: `Header-${currentTimeStamp}`,
            class: `Header-${currentTimeStamp}`,
        },
        [`Value-${currentTimeStamp}`]: {
            id: `Value-${currentTimeStamp}`,
            name: `Value-${currentTimeStamp}`,
            class: `Value-${currentTimeStamp}`,
        }
    }

    return [...existingHeaders, ...[additionalWebhook]]
}