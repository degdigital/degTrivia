import React from 'react';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';
import KillSwitch from './SystemTab/KillSwitch.jsx';
import ResetApp from './SystemTab/ResetApp.jsx';

class SystemTabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAppDisabled: false //TODO: get from DB
        };
    }

    disableApp() {
        //TODO: call to firebase, on return
        this.setState({
            isAppDisabled: true
        })
    }

    resetApp() {
        //TODO: call to firebase, on return
        this.setState({
            isAppDisabled: false
        })
    }

    render() {
        return (
            <div>
                <h2>This tab holds settings that will affect the entire system.</h2>
                <QuestionDuration />
                <hr />
                <KillSwitch disableApplication={this.disableApp.bind(this)} isAppDisabled={this.state.isAppDisabled} />
                <hr />
                <ResetApp resetApplication={this.resetApp.bind(this)} />
            </div>
        )
    }
}

export default SystemTabContent;