export const searchDestination = data => ({
    type: 'SEARCH_DESTINATION',
    payload: { data }
})

export const setDestination = data => ({
    type: 'SET_DESTINATION',
    payload: { data }
})

export const setSummary = data => ({
    type: 'SET_SUMMARY',
    payload: { data }
})

export const setUserLocation = data => ({
    type: 'SET_USER_LOCATION',
    payload: { data }
})

export const setCenterLocation = center => ({
    type: 'SET_CENTER_LOCATION',
    payload: { center }
})