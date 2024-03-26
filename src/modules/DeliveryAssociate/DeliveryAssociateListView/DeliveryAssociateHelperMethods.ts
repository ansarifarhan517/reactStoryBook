import  { sendGA } from '../../../utils/ga';


export const handleActionBarButtonClick = (id: string,
    setShowDeletionConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setShowChangePassword: React.Dispatch<React.SetStateAction<boolean>>,
    setShowNotify: React.Dispatch<React.SetStateAction<boolean>>,
    setShowBulkUpdate: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    switch (id) {
        case 'delete':
            sendGA('ListView ActionBar','Delivery Associate Button Click - Delete');
            setShowDeletionConfirmation(true);
            break;
        case 'update':
            sendGA('ListView ActionBar','Delivery Associate Button Click - Update');
            setEditMode(true);
            break;
        case 'duplicate':
            handleDuplicate();
            break;
        case 'more':
            break;
        case 'changePwd':
            sendGA('ListView ActionBar','Delivery Associate Button Click - Change Password');
            setShowChangePassword(true);
            break;
        case 'notify':
            sendGA('ListView ActionBar','Delivery Associate Button Click - Notify');
            setShowNotify(true);
            break;
        case 'bulkUpdate':
            sendGA('ListView ActionBar','Delivery Associate Button Click - Bulk Update');
            setShowBulkUpdate(true);
            break;
    }
}
const handleDuplicate = () => {
    return {};
};



export const dynamicLabelMapping = (dynamicLabels: any) => {
    return {
        bulkUpdateWeeklyOffTooltip: `Helps in planning the ${dynamicLabels.order} according to the availability of ${dynamicLabels.deliveryboy_s}. ${dynamicLabels.deliveryboy_s} will automatically marked as ${dynamicLabels.Absent} on their weekly-off day`,
        bulkUpdateSkillsetToolip: `Set this field to ensure that your ${dynamicLabels.deliveryboy_s} are assigned appropriate type of ${dynamicLabels.order}`,
        bulkupdateConfirmation: `On changing the Office, beats created for the ${dynamicLabels.deliveryboy_s}(s) would be de-linked. Do you wish to continue?`,
        bulkUpdatebranchNameTooltip: `This ${dynamicLabels?.branches} manager will be able to view and track the ${dynamicLabels.deliveryboy_s}. Ensures ${dynamicLabels.deliveryboy_s} are assigned ${dynamicLabels.order} of their ${dynamicLabels?.branches} only. Use this field to ensure that your ${dynamicLabels.deliveryboy_p} are assigned ${dynamicLabels.order} of their ${dynamicLabels?.branches}`,
        inactiveDeliveryBoy: `You can't mark inactive ${dynamicLabels.deliveryboy_s}`,

    }
}

