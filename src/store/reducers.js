const initialState = {
    price: 0,
    size: '',
    total: 0,
    qty: 0,
    reservation: {}
}

export const luggage = (state = initialState, action) => {

    const { type, payload } = action
    switch(type){
        case 'SET_LUGGAGE_SIZE': {
            const { data : { price, size, qty, total} } = payload
            return {
                ...state,
                size: size,
                price: price,
                total: total,
                qty: qty
            }
        }

        case 'SET_LUGGAGE_QTY': {
            const { data: { total, qty }} = payload
            return {
                ...state,
                total: total,
                qty: qty
            }
        }

        case 'SET_DATE_RESERVATION':
            const { data } = payload
            return {
                ...state,
                reservation: data
            }

        default:
            return state
    }
}