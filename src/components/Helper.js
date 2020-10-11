export const replaceChar = (string) => {
    return string.replace(/ /g, '+').replace(',', '%2C')
}

export const toMMSS = num => Math.floor(num / 60)  +' m '+ (num % 60)  + ' s'

export const toKM = num => Math.floor(num / 1000 ) + ' KM'

export const getPrice = num => 'Rp. ' + Math.floor(num / 1000 ) * 2500