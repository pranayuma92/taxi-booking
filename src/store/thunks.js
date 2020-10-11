import { setDestination, searchDestination, setSummary, setUserLocation, setCenterLocation } from './actions'
import { replaceChar, toKM, toMMSS, getPrice } from '../components/Helper'

const URL = process.env.REACT_APP_GEOCODING_URL
const REVGEOCODING_URL = process.env.REACT_APP_REVGEOCODING_URL
const API_KEY = process.env.REACT_APP_API_KEY

export const searchDestinationRequest = (pickup, dropoff) => async (dispatch, getState) => {
    try {
        const destination = { pickup, dropoff }
        const { reservation: { center }} = getState()
    
        dispatch(setDestination(destination))
        const orResponse = await fetch(`${URL}?at=${center.lat},${center.lng}&countryCode=IDN&q=${replaceChar(pickup)}&apiKey=${API_KEY}`)
        const orResult = await orResponse.json()
    
        const desResponse = await fetch(`${URL}?at=${center.lat},${center.lng}&countryCode=IDN&q=${replaceChar(dropoff)}&apiKey=${API_KEY}`)
        const desResult = await desResponse.json()
    
    
        if(orResult && desResult) {
            const orLat = orResult.items[0].position.lat
            const orLng = orResult.items[0].position.lng
    
            const desLat = desResult.items[0].position.lat
            const desLng = desResult.items[0].position.lng
    
            dispatch(
                searchDestination([
                    `${orLat},${orLng}`,
                    `${desLat},${desLng}`
                ])
            )
        }
    } catch(err){
        dispatch(displayAlert(err))
    }
}

export const setSummaryRequest = (distance, duration) => dispatch => {
    const data = {
        distance: toKM(distance),
        duration: toMMSS(duration),
        price: getPrice(distance)
    }

    dispatch(setSummary(data))
}

export const setUserLocationRequest = (lat,lng) => async dispatch => {

    dispatch(setCenterLocation({lat: lat, lng: lng}))
    const response = await fetch(`${REVGEOCODING_URL}?at=${lat},${lng}&apiKey=${API_KEY}`)
    const result = await response.json()

    dispatch(setUserLocation(result.items[0]))
}

export const displayAlert = text => () => {
    alert(text)
}