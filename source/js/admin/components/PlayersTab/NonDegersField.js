import React from 'react';

const NonDegersField = function(props) {
    return (
        <div>
            <label htmlFor="non-deg-filter">View non-DEG-ers only</label>
            <input name="non-deg-filter" 
                id="non-deg-filter" 
                onChange={props.changeEvent}
                type="checkbox">
            </input>
        </div>
    );
}

export default NonDegersField;