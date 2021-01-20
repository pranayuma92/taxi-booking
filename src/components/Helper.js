const URL = process.env.REACT_APP_GEOCODING_URL
const REVGEOCODING_URL = process.env.REACT_APP_REVGEOCODING_URL
const API_KEY = process.env.REACT_APP_API_KEY

export const replaceChar = (string) => {
    return string.replace(/ /g, '+').replace(',', '%2C')

    // return string.replace(/ /g, '+').concat('%2C+pekanbaru')
}

export const toMMSS = num => Math.floor(num / 60)  +' m '+ (num % 60)  + ' s'

export const toKM = num => Math.floor(num / 1000 ) + ' KM'

export const getPrice = num => 'Rp. ' + Math.floor(num / 1000 ) * 2500

export const getMapUrl = (lat, lng, countryCode, location) => {
    return `${URL}?at=${lat},${lng}&countryCode=${countryCode}&q=${replaceChar(location)}&apiKey=${API_KEY}`
}