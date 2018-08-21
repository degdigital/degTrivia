import React from 'react';

const NonDegersField = function(props) {
    return (
        <div className="field">
            <label htmlFor="non-deg-filter" className="label">View non-DEG-ers only</label>
            <input name="non-deg-filter"
                className="input"
                id="non-deg-filter" 
                onChange={props.changeEvent}
                type="checkbox">
            </input>
        </div>
    );
}

export default NonDegersField;