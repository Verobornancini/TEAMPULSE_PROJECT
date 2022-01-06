import { ACTION_TYPES } from "../actions/sendPolls";

const initialState = {
    list: []
}
//team.list
export const sendPolls = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SEND:
            return {
                ...state,
                list: [...state.list, action.payload]
            }
        default:
            return state;
    }
}