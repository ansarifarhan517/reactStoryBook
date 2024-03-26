import { IEditDetails } from "../../../utils/mongo/interfaces";
import { InlineEditActions } from "./InlineEdit.actions";

export interface IInlineEditState {
    editDetails?: IEditDetails;
};

export const initialState: IInlineEditState = {
};

const IInlineEditReducer = (state = initialState, action: InlineEditActions): IInlineEditState => {

    switch (action.type) {
        case '@@inlineEdit/SET_EDIT_DETAILS': {
            const { rowId, columnId, value, hasError } = action.payload;
            return {
                ...state,
                editDetails: {
                    ...state.editDetails,
                    [rowId]: {
                        ...state.editDetails?.[rowId],
                        [columnId]: {
                            value,
                            hasError,
                        },
                    },
                },
            };
        }

        case '@@inlineEdit/CLEAR_EDIT_DETAILS': {
            return {
                ...state,
                editDetails: {},
            };
        }
        default:
        return state;
    }
}

export default IInlineEditReducer;