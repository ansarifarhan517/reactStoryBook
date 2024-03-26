// import ga from '../../../utils/ga';
import ga from '../../../../../../utils/ga';



export const handleActionBarButtonClick = (id: string,
    setShowDeletionConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setShowChangePassword: React.Dispatch<React.SetStateAction<boolean>>,
    setShowNotify: React.Dispatch<React.SetStateAction<boolean>>,
    setShowBulkUpdate: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').clientId;
    const userId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userId;
    console.log(clientId + userId);
    switch (id) {
        case 'delete':
            ga.event({
                category: 'ListView ActionBar',
                action: 'Delivery Associate Button Click - Delete',
                label: `${clientId} - ${userId}`
            })
            setShowDeletionConfirmation(true);
            break;
        case 'update':
            ga.event({
                category: 'ListView ActionBar',
                action: 'Delivery Associate Button Click - Update',
                label: `${clientId} - ${userId}`
            })
            setEditMode(true);
            break;
        case 'duplicate':
            handleDuplicate();
            break;
        case 'more':
            break;
        case 'changePwd':
            ga.event({
                category: 'ListView ActionBar',
                action: 'Delivery Associate Button Click - Change Password',
                label: `${clientId} - ${userId}`
            })
            setShowChangePassword(true);
            break;
        case 'notify':
            ga.event({
                category: 'ListView ActionBar',
                action: 'Delivery Associate Button Click - Notify',
                label: `${clientId} - ${userId}`
            })
            setShowNotify(true);
            break;
        case 'bulkUpdate':
            ga.event({
                category: 'ListView ActionBar',
                action: 'Delivery Associate Button Click - Bulk Update',
                label: `${clientId} - ${userId}`
            })
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

