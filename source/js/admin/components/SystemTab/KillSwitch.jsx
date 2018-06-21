import React from 'react';

export default class KillSwitch extends React.Component {

    disableApp() {
        if(confirm('Are you sure you want to disable the application?')) {
           this.props.disableApplication();
        }
    }

    render() {
        const disabledMessage = this.props.isAppDisabled ? <p>Application is currently disabled.</p> : null;
        return (
            <div>
                <div className="field">
                    <label htmlFor="disableAll">Disable Application</label>
                    <button id="disableAll"
                        name="disableAll"
                        onClick={this.disableApp.bind(this)}
                        disabled={this.props.isAppDisabled}
                    >Disable Application</button>
                </div>
                {disabledMessage}
            </div>
            
        )
    }
}