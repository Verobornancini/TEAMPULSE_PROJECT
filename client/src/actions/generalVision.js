import api from "./api"

export const ACTION_TYPES = {
    FETCH_ALL: 'FETCH_ALL'
}


export const fetchAll = () => dispatch => {
    api.generalVision().fetchAll()
        .then(res => {
            console.log(res.data)

            dispatch({
                type: ACTION_TYPES.FETCH_ALL,
                payload: res.data
            })
        })
        .catch(err => console.log(err))

}