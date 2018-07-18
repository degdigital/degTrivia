import React from 'react';
import { connect } from 'react-redux';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';
import KillSwitchEngage from './SystemTab/KillSwitchEngage.jsx';
import ResetApp from './SystemTab/ResetApp.jsx';

import systemService from '../services/systemService';

import {fetchQuestionDuration, fetchAppStatus, onQDurationChange} from '../actions/actions';

class SystemTabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionDuration: null
        };

        this.props.fetchQuestionDuration();
        this.props.fetchAppStatus();
    }

    static getDerivedStateFromProps(props, state) {
        const retVal = {};
        if (props.questionDuration !== state.questionDuration) {
            retVal.questionDuration = props.questionDuration;
        }
        return retVal;
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
                { this.state.questionDuration ? 
                    <QuestionDuration updateDuration={this.updateQuestionDuration.bind(this)} 
                        questionDuration={this.state.questionDuration}
                        onQDurationChange={this.props.onQDurationChange} /> :
                    null
                }
                <hr />
                <KillSwitchEngage disableApplication={this.disableApp.bind(this)} isAppDisabled={this.props.isAppDisabled} />
                <hr />
                <ResetApp resetApplication={this.resetApp.bind(this)} />
            </div>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        questionDuration: data.question.duration,
        isAppDisabled: data.isAppDisabled
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestionDuration: () => dispatch(fetchQuestionDuration()),
        fetchAppStatus: () => dispatch(fetchAppStatus()),
        onQDurationChange: input => dispatch(onQDurationChange(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemTabContent);