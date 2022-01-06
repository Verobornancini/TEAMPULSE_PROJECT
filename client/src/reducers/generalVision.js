import { ACTION_TYPES } from "../actions/generalVision";

const initialState = {
    list: []
}
//team.list
export const generalVision = (state = initialState, action) => {
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