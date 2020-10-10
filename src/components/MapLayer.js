import React, { useEffect, useRef } from 'react';
import Marker from '../assets/icon/marker.png'

const MapLayer = ({ center, zoom, locations, marker, theme, labels }) => {
    const refMap = useRef(null)
    const L = window.L

    const Icon = L.icon({
        iconUrl: marker,
        iconSize: [40, 40],
    })

    useEffect(() => {
        initMap()
    }, [])
    
    const renderMarker = (map) => {
        locations 
            ? locations.map(ltlg => L.marker(ltlg, {icon: Icon}).addTo(map)) 
            : L.marker(center, {icon: Icon}).addTo(map)
    }

    const initMap = () => {
        const map = L.map(refMap.current, {                
            center: center,  
            zoom: zoom,                         
        })

        L.tileLayer(
            `https://cartodb-basemaps-{s}.global.ssl.fastly.net/${theme}_${labels}/{z}/{x}/{y}.png`
        ).addTo(map)

        renderMarker(map)
    }

    return <div ref={refMap}></div>
}

MapLayer.defaultProps = {
    center: [-6.229728, 106.6894312],
    zoom: 11,
    location: [],
    marker: Marker,
    theme: 'light',
    labels: 'all'
}

export default MapLayer