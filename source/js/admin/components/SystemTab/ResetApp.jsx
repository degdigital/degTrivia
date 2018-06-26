import React from 'react';

export default function ResetApp(props) {

    function resetApp() {
        if(confirm('Are you sure you want to disable the application?')) {
            props.resetApplication();
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