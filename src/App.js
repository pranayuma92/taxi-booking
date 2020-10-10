import React from 'react';
import './App.css';

import Map from './components/Map'
import Geocode from './components/Map/Geocode'
import Driving from './components/Map/Driving'

const App = () => {
  return (
    <>
    {/* <Map center={[-6.229728, 106.6894312]} zoom={7}/> */}
    <Driving />
    </>
  )
}

export default App;
