import api from "./api"

export const ACTION_TYPES = {
    SEND: 'send'
}



export const create = (data, onSuccess) => dispatch => {
    api.sendPolls().send(data)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.SEND,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}