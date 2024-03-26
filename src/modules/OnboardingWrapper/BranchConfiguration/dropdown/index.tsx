import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import store from '../../../../utils/redux/store';
import { IHolidayCalendar } from '../BranchConfiguration.models';

const BRANCH_CONFIGURATION_DROPDOWN_OPTIONS_MAPPING = {
    
    isActiveFl: (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.active},
            {value: 'N', label: dynamicLabels.inactive}
        ]
    },

  
    daysOfWeek: async (dynamicLabels: Record<string, string>) => {
     
        let daysOfWeek = store.getState().branchConfiguration.listview.daysOfWeek
        if (daysOfWeek?.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.daysOfWeek, {
                url: apiMappings.common.lookup.daysOfWeek,
            })

            daysOfWeek = data.map((persona: any) => ({
                label: persona?.clientRefMasterDesc,
                value: persona?.clientRefMasterDesc,
                id: persona?.id,
                title: persona?.name
            }))
  
        }
  
        if (daysOfWeek && daysOfWeek?.length > 0) {
            return daysOfWeek
        } else {
            return []
        }
    },
    acceptOrderOnHolidaysFl: async (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.Yes},
            {value: 'N', label: dynamicLabels.No}
        ]
    },
    holidayCalendar: async () => {
        const holidayCalendarList = store.getState().branchConfiguration.lookup.holidayCalendar;

        if (holidayCalendarList && holidayCalendarList?.length > 0) {

            const holidayCalendarOptions = holidayCalendarList.map((holidayCalendar: IHolidayCalendar) => ({
                label: holidayCalendar?.calendarName,
                value: holidayCalendar?.calendarName,
                id: holidayCalendar?.calendarId,
                title: holidayCalendar?.calendarName
            }))
            return holidayCalendarOptions;
        } else {
            return []
        }
    }


}

export default BRANCH_CONFIGURATION_DROPDOWN_OPTIONS_MAPPING