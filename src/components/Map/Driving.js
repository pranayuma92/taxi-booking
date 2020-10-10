import React, { useLayoutEffect, useRef, useState }  from 'react'
import DistanceIcon from '../../assets/icon/distance.png'
import DurationIcon from '../../assets/icon/clock.png'
import Flag from '../../assets/icon/maps-and-flags.png'

const Driving = () => {
    const mapRef = useRef(null)
    const URL = process.env.REACT_APP_GEOCODING_URL
    const API_KEY = process.env.REACT_APP_API_KEY
    const H = window.H
    let hMap
    let platform

    const [distanceValue, setDistance] = useState(0)
    const [durationValue, setDuration] = useState(0)
    const [price, setPrice] = useState(0)
    const [pickup, setPickup] = useState(null)
    const [dropoff, setDropoff] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [destination, setDestination] = useState(null)
    const [center, setCenter] = useState({ lat: 0.5125877, lng: 101.488521 })
    const [inCenter, setInCenter] = useState(null)

    useLayoutEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
            setInCenter(`${position.coords.latitude},${position.coords.longitude}`)
        })

        initMap()

        return () => {
            hMap.dispose()
        }
    }, [mapRef, center, destination])
    
    const initMap = () => {
        if (!mapRef.current) return

        platform = new H.service.Platform({
            apikey: process.env.REACT_APP_API_KEY
        })

        const defaultLayers = platform.createDefaultLayers()
        hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            center: center,
            zoom: 11,
            pixelRatio: window.devicePixelRatio || 1
        })

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap))
        const ui = H.ui.UI.createDefault(hMap, defaultLayers)

        const desMark = destination && destination.split(',')
        const MarkerIcon = new H.map.Icon(Flag, {size: {w: 40, h: 40}})
        const Marker = new H.map.Marker({lat: desMark && desMark[0], lng: desMark && desMark[1]}, {icon: MarkerIcon})
        hMap.addObject(Marker)
        
        calculateRouteFromAtoB (platform)
    }

    const search = async () => {
        setDistance(0)
        setDuration(0)
        setPrice(0)

        const orResponse = await fetch(`${URL}?at=${inCenter}&countryCode=ID&q=${replaceChar(pickup)}&apiKey=${API_KEY}`)
        const orResult = await orResponse.json()

        const desResponse = await fetch(`${URL}?at=${inCenter}&countryCode=ID&q=${replaceChar(dropoff)}&apiKey=${API_KEY}`)
        const desResult = await desResponse.json()

        if(orResult){
            const orLat = orResult.items.[0].position.lat
            const orLng = orResult.items.[0].position.lng
            setCenter({lat: orLat, lng: orLng})
            setOrigin(`${orLat},${orLng}`)
            console.log(`${orLat},${orLng}`)
        }

        if(desResult){
            const desLat = desResult.items.[0].position.lat
            const desLng = desResult.items.[0].position.lng
            setDestination(`${desLat},${desLng}`)
        }

        console.log(orResult, desResult)

    }

    const replaceChar = (string) => {
       return string.replace(/ /g, '+').replace(',', '%2C')
    }

    const calculateRouteFromAtoB = (platform) => {
        const router = platform.getRoutingService(null, 8)
        const routeRequestParams = {
            routingMode: 'fast',
            transportMode: 'car',
            origin: origin, 
            destination: destination,  
            return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        }
      
        router.calculateRoute(
            routeRequestParams,
            onSuccess,
            onError
        )
    }

    const onSuccess = (result) => {
        const route = result.routes[0]
      
        addRouteShapeToMap(route)
        addManueversToMap(route)
        addSummaryToPanel(route)
    }

    const onError = (error) => {
        console.log('Can\'t reach the remote server');
    }

    const addRouteShapeToMap = (route) => {
        route.sections.forEach((section) => {
            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline)
      
            let polyline = new H.map.Polyline(linestring, {
                style: {
                    lineWidth: 4,
                    strokeColor: '#ff8110'
                }
            })
      
            hMap.addObject(polyline)
          
            hMap.getViewModel().setLookAtData({
                bounds: polyline.getBoundingBox()
            })
        })
    }

    const addManueversToMap = (route) => {
        const svgMarkup = '<svg width="18" height="18" ' +
            'xmlns="http://www.w3.org/2000/svg">' +
                '<circle cx="8" cy="8" r="8" ' +
                'fill="#ff8110" stroke="white" stroke-width="1"  />' +
            '</svg>'
        const dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}})
        const group = new  H.map.Group()

        let i
        let j

        route.sections.forEach((section) => {
            let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray()
      
            let actions = section.actions
         
            for (i = 0;  i < actions.length; i += 1) {
                let action = actions[i]
                const marker =  new H.map.Marker({
                    lat: poly[action.offset * 3],
                    lng: poly[action.offset * 3 + 1]
                }, { icon: dotIcon })
                marker.instruction = action.instruction
                group.addObject(marker)
            }

            hMap.addObject(group);
        })
    }

    
const addSummaryToPanel = (route) => {
    let duration = 0
    let distance = 0
  
    route.sections.forEach((section) => {
        distance += section.travelSummary.length
        duration += section.travelSummary.duration
    })

    setDistance(toKM(distance))
    setDuration(toMMSS(duration))
    setPrice(getPrice(distance))
}

const toMMSS = num => Math.floor(num / 60)  +' m '+ (num % 60)  + ' s'

const toKM = num => Math.floor(num / 1000 ) + ' KM'

const getPrice = num => 'Rp. ' + Math.floor(num / 1000 ) * 2500


    return (
        <div className="container">
            <div className="map-container mt-5">
                <div className="card-deck">
                    <div className="card">
                        <div className="card-body">
                            <div style={{textAlign: 'center', margin: '30px 0'}}>
                                <h4>My online taxi</h4>
                            </div>
                            <div className="input-location-container">
                                <div className="input-location-field">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Enter pick-up location" value={pickup} onChange={(e) => setPickup(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="input-location-field">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Enter drop-off location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-location-field">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Add address"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <div>
                                <small>Total Cost</small>
                                <h4>{price}</h4>
                            </div>
                            <button type="button" className="btn btn-primary orange" onClick={search}>Order</button>
                        </div>
                    </div>
                    <div className="card">
                        <div className="map-canvas" ref={mapRef} style={{ height: "450px", width: "100%" }}></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 with-right">
                                    <div className="map-detail">
                                        <img src={DistanceIcon} height="40" />
                                        <div className="inner-detail">
                                            <small>Total Distance</small>
                                            <h4>{distanceValue}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="map-detail">
                                        <img src={DurationIcon} height="40" />
                                        <div className="inner-detail">
                                            <small>Total Time</small>
                                            <h4>{durationValue}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Driving