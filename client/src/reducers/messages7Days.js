import { ACTION_TYPES } from "../actions/messages7Days";

const initialState = {
    list: []
}
//team.list
export const messages7Days = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL:
            return {
                ...state,
                list: [...action.payload]
            }
        default:
            return state;
    }
}