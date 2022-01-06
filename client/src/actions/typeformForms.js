import api from "./api"

export const ACTION_TYPES = {
    FETCH_ALL: 'FETCH_ALL'
}


export const fetchAll = () => dispatch => {
    console.log('fetchAll')
    api.typeformForms().fetchAll()
        .then(res => {
            console.log('then res')
            console.log(res.data)

            dispatch({
                type: ACTION_TYPES.FETCH_ALL,
                payload: res.data
            })
            console.log('despues de dispatch')
        })
        .catch(err => console.log(err))

}