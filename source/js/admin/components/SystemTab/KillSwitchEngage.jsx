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
                <label className="label" htmlFor="disableAll">Disabling the application will send all players to the error screen</label>
                <button id="disableAll"
                    className="button button--alt"
                    name="disableAll"
                    onClick={disableApp}
                    disabled={props.isAppDisabled}
                >Disable Application</button>
            </div>
            {disabledMessage}
        </div>
    )
}