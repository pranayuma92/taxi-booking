import React, { useLayoutEffect, useRef, useState }  from 'react'
import { connect } from 'react-redux'
import DistanceIcon from '../assets/icon/distance.png'
import DurationIcon from '../assets/icon/clock.png'
import Flag from '../assets/icon/maps-and-flags.png'
import { setSummaryRequest } from '../store/thunks'

const Driving = ({ center, origin, destination, distance, duration, onSetSummary }) => {
    const mapRef = useRef(null)
    const H = window.H
    let hMap
    let platform

    useLayoutEffect(() => {
        initMap()

        return () => {
            hMap.dispose()
        }
    }, [mapRef, center, origin, destination])
    
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

    const calculateRouteFromAtoB = (platform) => {
        const router = platform.getRoutingService(null, 8)
        const routeRequestParams = {
            routingMode: 'fast',
            transportMode: 'car',
            origin: origin, 
            destination: destination,  
            return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        }
      
        if(destination){
            router.calculateRoute(
                routeRequestParams,
                onSuccess,
                onError
            )
        }
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

        onSetSummary(distance, duration, distance)
    }

    return (
        <div className="card">
            <div className="map-canvas" ref={mapRef} style={{ height: "450px", width: "100%" }}></div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 with-right">
                        <div className="map-detail">
                            <img src={DistanceIcon} height="40" />
                            <div className="inner-detail">
                                <small>Total Distance</small>
                                <h4>{distance}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="map-detail">
                            <img src={DurationIcon} height="40" />
                            <div className="inner-detail">
                                <small>Total Time</small>
                                <h4>{duration}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    center: state.reservation.center,
    origin: state.reservation.origin,
    destination: state.reservation.destination,
    distance: state.reservation.distance,
    duration: state.reservation.duration,
    price: state.reservation.price,
})

const mapDispatchToProps = dispacth => ({
    onSetSummary: (distance, duration, price) => dispacth(setSummaryRequest(distance, duration,price))
})

export default connect(mapStateToProps, mapDispatchToProps)(Driving)