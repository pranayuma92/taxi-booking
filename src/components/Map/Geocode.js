import React, { useState } from 'react'
import Map from './index'

const Geocode = () => {
    const URL = process.env.REACT_APP_GEOCODING_URL
    const API_KEY = process.env.REACT_APP_API_KEY

    const [address, setAddress] = useState(null)
    const [data, setData] = useState({})
    const [center, setCenter] = useState([-6.229728, 106.6894312])
    const [zoom, setZoom] = useState(7)

    const search = async address => {
        const response = await fetch(`${URL}?countryCode=ID&q=${address}&apiKey=${API_KEY}`)
        const result = await response.json()
        setData(result.items[0])
        setCenter([result.items.[0].position.lat, result.items.[0].position.lng])
        setZoom(14)
    }

    return (
        <div>
            <Map center={center} zoom={zoom} />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
            <button onClick={() => search(address)}>Cari</button>
            {   data &&
                <div>
                    <p>{data.title}</p>
                </div>
            }
        </div>
    )
}

export default Geocode