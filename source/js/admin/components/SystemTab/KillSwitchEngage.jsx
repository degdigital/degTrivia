import React from 'react';

import systemService from '../../services/systemService';

export default function KillSwitchEngage(props) {
    function disableApp() {
        if(confirm('Are you sure you want to disable the application?')) {
            systemService.disableApplication();
        }
    }

    const disabledMessage = props.isAppDisabled ? <p>Application is currently disabled.</p> : null;
    return (
        <div>
            <div className="field">
                <label htmlFor="disableAll">Disable Application</label>
                <button id="disableAll"
                    name="disableAll"
                    onClick={disableApp}
                    disabled={props.isAppDisabled}
                >Disable Application</button>
            </div>
            {disabledMessage}
        </div>
    )
}