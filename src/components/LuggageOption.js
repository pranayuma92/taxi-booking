import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setLuggage, setQty } from '../store/thunks'

const LuggageOption = ({ size, price, total, qty, onSetLuggage, onSetQty }) => {
    const [ date, setDate ] = useState(null)
    const [ time, setTime ] = useState(null)
    const [ multiple, setMultiple ] = useState(false)
    const [ pickupDate, setPickupDate ] = useState(null)
    const [ pickupTime, setPickupTime ] = useState(null)

    useEffect(() => {
        if(!size) onSetLuggage('small')
    },[])

    const getSize = (e) => {
        onSetLuggage(e.target.id.toLowerCase())
    }

    const handleQty = mod => {
        if(mod === 'add' && qty < 20 ) onSetQty(qty+1)
        if(mod === 'subs' && qty > 1) onSetQty(qty-1)
    }

    return (
        <div className="luggage-option-container">
            <p>luggage option</p>
            <div className="luggage-size-option">
                <button onClick={getSize} id="small">Small</button>
                <button onClick={getSize} id="medium">Medium</button>
                <button onClick={getSize} id="large">Large</button>
            </div>
            <div className="luggage-choosen">
                <h3>{size} luggage</h3>
            </div>
            <div className="field-control">
                <label for="date">Drop off date</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            </div>
            <div className="field-control">
                <label>Drop off time</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                    <option>--time--</option>
                </select>
            </div>
            <div className="field-control inline">
                <input id="multiple" type="checkbox" onChange={() => setMultiple(!multiple)} value={multiple} checked={multiple}/>
                <label for="multiple">Multiple day</label>
            </div>
            { multiple && 
                <>
                    <div className="field-control">
                        <label for="pickup-date">Pickup date</label>
                        <input type="date" id="pickup-date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}/>
                    </div> 
                    <div className="field-control">
                        <label>Pickup time</label>
                        <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                            <option>--time--</option>
                        </select>
                    </div>
                </>
            }
            <div>
                Your luggage detail:
                <p>{size} - {price}</p>
                <p>total: {total}</p>
            </div>
            <button onClick={() => handleQty('add')}>+</button>
            <span>{qty}</span>
            <button onClick={() => handleQty('subs')}>-</button>
        </div>
    )
}

const mapStateToProps = state => ({
    size: state.luggage.size,
    price: state.luggage.price,
    total: state.luggage.total,
    qty: state.luggage.qty 
})

const mapDispatchToProps = dispatch => ({
    onSetLuggage: size => dispatch(setLuggage(size)),
    onSetQty: qty => dispatch(setQty(qty))
})

export default connect(mapStateToProps, mapDispatchToProps)(LuggageOption)