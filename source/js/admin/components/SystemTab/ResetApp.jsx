import React from 'react';

export default class ResetApp extends React.Component {

    resetApp() {
        if(confirm('Are you sure you want to disable the application?')) {
            this.props.resetApplication();
        }
    }

    render() {
        return (
            <div>
                <button id="resetApp"
                    name="resetApp"
                    onClick={this.resetApp.bind(this)}
                >Reset Application</button>
            </div>
            
        )
    }
}