import React from 'react';

const EventSelectField = function(props) {

    return (
        <div>
            <label htmlFor="event-select" >{props.label}</label>
            <select className="" name="event-select" id="event-select" onChange={props.changeEvent} value={props.selectedOpt || ''}>
                <option value="">{props.defaultOptText}</option>
                {props.eventOpts.map(opt => (
                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    )
}

export default EventSelectField;