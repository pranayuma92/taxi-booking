import React, { useLayoutEffect, useRef } from 'react'

const Map = ({ center, zoom }) => {
    const mapRef = useRef(null)
    let hMap

    useLayoutEffect(() => {
        initMap()

        return () => {
            hMap.dispose()
        }
    }, [mapRef, center])

    const initMap = () => {
        if (!mapRef.current) return

        const H = window.H
        const platform = new H.service.Platform({
            apikey: process.env.REACT_APP_API_KEY
        })

        const defaultLayers = platform.createDefaultLayers()
        hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            center: { lat: center[0], lng: center[1] },
            zoom: zoom,
            pixelRatio: window.devicePixelRatio || 1
        })

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap))
        const ui = H.ui.UI.createDefault(hMap, defaultLayers)

        const Marker = new H.map.Marker({lat:center[0], lng:center[1]})
        hMap.addObject(Marker)
    }

    return <div className="map" ref={mapRef} style={{ height: "500px" }} />

}

Map.defaultProps = {
    center: [-6.229728, 106.6894312],
    zoom: 7
}

export default Map
