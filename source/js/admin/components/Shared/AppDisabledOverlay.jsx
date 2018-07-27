import React from 'react';
import ResetApp from './ResetApp.jsx';

const AppDisabledOverlay = function(props) {
    return (
        <div className="">
            {props.content}
            <ResetApp />
        </div>
    )
}

export default AppDisabledOverlay;