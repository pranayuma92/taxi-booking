const initialState = {
    distance: 0,
    duration: 0,
    price: 0,
    pickup: '',
    dropoff: '',
    origin: '',
    destination: '',
    center: '',
    userLocation: {}
}

export const reservation = (state = initialState, action) => {

    const { type, payload } = action
    switch(type){
        case 'SET_DESTINATION': {
            const { data : { pickup, dropoff } } = payload
            return {
                ...state,
                pickup: pickup,
                dropoff: dropoff
            }
        }

        case 'SEARCH_DESTINATION': {
            const { data} = payload
            return {
                ...state,
                origin: data[0],
                destination: data[1]
            }
        }

        case 'SET_SUMMARY': {
            const { data: { duration, distance, price} } = payload
            return {
                ...state,
                duration: duration,
                distance: distance,
                price: price
            }
        }

        case 'SET_CENTER_LOCATION': {
            const { center } = payload
            return {
                ...state,
                center: center
            }
        }

        case 'SET_USER_LOCATION': {
            const { data } = payload
            return {
                ...state,
                userLocation: data
            }
        }

        default:
            return state
    }
}