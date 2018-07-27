import React from 'react';
import systemService from '../../services/systemService';

export default function ResetApp(props) {

    function resetApp() {
        if(confirm('Are you sure you want to disable the application?')) {
            systemService.resetApplication();
        }
    }

    return (
        <div>
            <button id="resetApp"
                name="resetApp"
                onClick={resetApp}
            >Reset Application</button>
        </div>
    )
}