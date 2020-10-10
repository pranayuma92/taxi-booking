import { setLuggageSize, setLuggageQty } from './actions'

export const setLuggage = size => dispatch => {
    let luggage = {
        size: size,
        qty: 1
    } 

    if(size === 'small') luggage.price = 100
    if(size === 'medium') luggage.price = 150
    if(size === 'large') luggage.price = 200

    luggage.total = (luggage.price * luggage.qty)

    dispatch(setLuggageSize(luggage))
}

export const setQty = qty => (dispatch, getState) => {
    const { luggage: { price } } = getState()

    let luggage = {
        qty: qty,
        total: (price * qty)
    }

    dispatch(setLuggageQty(luggage))

}

export const displayAlert = text => () => {
    alert(text)
}