import React from 'react'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import ScheduledChangesPopup from './ScheduledChangesPopup'
import ViewChanges from './ViewChanges'

export interface IEditModePopup {

    handleSubmitForm: (value: boolean) => void
}

const EditModePopup = ({ handleSubmitForm }: IEditModePopup) => {
    const viewChanges = useTypedSelector(state => state.saas.plans.viewChanges)
    const scheduledChangesDiscardPopup = useTypedSelector(state => state.saas.plans.scheduledChangesDiscardPopup)

    return <>{viewChanges && <ViewChanges />}
        {scheduledChangesDiscardPopup &&
            <ScheduledChangesPopup
                handleSubmitForm={handleSubmitForm}
            />}
    </>



}
export default EditModePopup