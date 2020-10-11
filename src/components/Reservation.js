import React, { useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import Driving from './Driving'
import UserInput from './UserInput'
import { setUserLocationRequest } from '../store/thunks' 

const Reservation = ({ onSetUserLocation }) => {
    useLayoutEffect(() => {
         navigator.geolocation.watchPosition((position) => {
            onSetUserLocation(position.coords.latitude, position.coords.longitude)
            //onSetUserLocation(`${position.coords.latitude},${position.coords.longitude}`)
        })
    }, [])

    return (
        <div className="container">
            <div className="map-container mt-5">
                <div className="card-deck">
                    <UserInput />
                    <Driving />
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    onSetUserLocation: (lat,lng) => dispatch(setUserLocationRequest(lat,lng))
})

export default connect(null, mapDispatchToProps)(Reservation)