import { IMongoField } from '../../../utils/mongo/interfaces';


export const createButtonDropdownOptions = (structure: IMongoField): any => {
    // return Object.values(structure).map(button => {
    if (structure?.childNodes) {
        return Object.entries(structure?.childNodes).map((button) => {
            if (button[1].childNodes && Object.values(button[1].childNodes)?.length) {
                return {
                    label: button[1].label,
                    id: button[0],
                    value: button[1].label,
                    options: [...createButtonDropdownOptions(button[1])]
                };
            } else {
                return {
                    label: button[1].label,
                    id: button[0],
                    value: button[1].label
                };
            }

        })

    }
    return;
    // })
}