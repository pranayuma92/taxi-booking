import { setDestination, searchDestination, setSummary, setUserLocation, setCenterLocation } from './actions'
import { replaceChar, toKM, toMMSS, getPrice, getMapUrl } from '../components/Helper'

const URL = process.env.REACT_APP_GEOCODING_URL
const REVGEOCODING_URL = process.env.REACT_APP_REVGEOCODING_URL
const API_KEY = process.env.REACT_APP_API_KEY

export const searchDestinationRequest = (pickup, dropoff) => async (dispatch, getState) => {
    try {
        const { reservation: { center, userLocation }} = getState()
        
        const destination = { 
            pickup: pickup.concat(`, ${userLocation.address.county}`), 
            dropoff: dropoff.concat(`, ${userLocation.address.county}`)
        }
    
        dispatch(setDestination(destination))
        Promise.all([
            fetch(getMapUrl(center.lat, center.lng, userLocation.address.countryCode, pickup)).then(resp => resp.json()),
            fetch(getMapUrl(center.lat, center.lng, userLocation.address.countryCode, dropoff)).then(resp => resp.json())
        ]).then(value => {
            const origin = value[0].items[0].position
            const dest = value[1].items[0].position

            dispatch(
                searchDestination([
                    `${origin.lat},${origin.lng}`,
                    `${dest.lat},${dest.lng}`
                ])
            )
        }).catch(err => dispatch(displayAlert(err)))
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