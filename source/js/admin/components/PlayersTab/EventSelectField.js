import React from 'react';

const EventSelectField = function(props) {
    return (
        <div>
            <label htmlFor="player-filter" >Filter by Event</label>
            <select className="" name="player-filter" id="player-filter" onChange={props.changeEvent}>
                <option value="">All Events</option>
                {props.eventOpts.map(opt => <option value={opt.id} key={opt.id}>{opt.name}</option>)}
            </select>
        </div>
    )
}

export default EventSelectField;