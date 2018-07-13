import React from 'react';
import { connect } from 'react-redux';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';
import KillSwitchEngage from './SystemTab/KillSwitchEngage.jsx';
import ResetApp from './SystemTab/ResetApp.jsx';

import listenService from '../services/dbListenService';
import systemService from '../services/systemService';

import {fetchQuestionDuration, onQDurationChange} from '../actions/actions';

class SystemTabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAppDisabled: false,
            questionDuration: null
        };

        this.props.fetchQuestionDuration();
        this.bindListenEvents();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.questionDuration !== state.questionDuration) {
            return {
                questionDuration: props.questionDuration
            }
        }
        return null;
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
                { this.state.questionDuration ? 
                    <QuestionDuration updateDuration={this.updateQuestionDuration.bind(this)} 
                        questionDuration={this.state.questionDuration}
                        onQDurationChange={this.props.onQDurationChange} /> :
                    null
                }
                <hr />
                <KillSwitchEngage disableApplication={this.disableApp.bind(this)} isAppDisabled={this.state.isAppDisabled} />
                <hr />
                <ResetApp resetApplication={this.resetApp.bind(this)} />
            </div>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        questionDuration: data.question.duration,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestionDuration: () => dispatch(fetchQuestionDuration()),
        onQDurationChange: input => dispatch(onQDurationChange(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemTabContent);