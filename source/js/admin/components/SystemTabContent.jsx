import React from 'react';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';
import KillSwitchEngage from './SystemTab/KillSwitchEngage.jsx';
import ResetApp from './SystemTab/ResetApp.jsx';

import listenService from '../services/dbListenService';
import systemService from '../services/systemService';

class SystemTabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAppDisabled: false
        };

        this.bindListenEvents();
    }

    bindListenEvents() {
        // TODO: move this up the tree so other parts of the app can respond
        listenService.listenToAppDisableChange(val => {
            this.setState({
                isAppDisabled: val
            });
        });
    }

    disableApp() {
        systemService.disableApplication();
    }

    resetApp() {
        systemService.resetApplication();
    }

    updateQuestionDuration(newTime) {
        systemService.updateQuestionDuration(newTime);
    }

    render() {
        return (
            <div>
                <h2>This tab holds settings that will affect the entire system.</h2>
                <QuestionDuration updateDuration={this.updateQuestionDuration.bind(this)} />
                <hr />
                <KillSwitchEngage disableApplication={this.disableApp.bind(this)} isAppDisabled={this.state.isAppDisabled} />
                <hr />
                <ResetApp resetApplication={this.resetApp.bind(this)} />
            </div>
        )
    }
}

export default SystemTabContent;