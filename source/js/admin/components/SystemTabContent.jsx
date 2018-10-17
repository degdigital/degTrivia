import React from 'react';
import { connect } from 'react-redux';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';
import KillSwitchEngage from './SystemTab/KillSwitchEngage.jsx';
import ResetApp from './Shared/ResetApp.jsx';

import systemService from '../services/systemService';

import {fetchQuestionDuration, onQDurationChange} from '../actions/actions';

class SystemTabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionDuration: null
        };

        this.props.fetchQuestionDuration();

    }

    static getDerivedStateFromProps(props, state) {
        const retVal = {};
        if (props.questionDuration !== state.questionDuration) {
            retVal.questionDuration = props.questionDuration;
        }
        return retVal;
    }


    updateQuestionDuration(newTime) {
        systemService.updateQuestionDuration(newTime);
    }

    render() {
        return (
            <div>
                <h2>This tab holds settings that will affect the entire system.</h2>
                <div className="columns columns--two">
                    <div className="column">
                        { this.state.questionDuration ? 
                            <QuestionDuration updateDuration={this.updateQuestionDuration.bind(this)} 
                                questionDuration={this.state.questionDuration}
                                onQDurationChange={this.props.onQDurationChange} /> :
                            null
                        }
                    </div>
                    <div className="column">
                        <KillSwitchEngage isAppDisabled={this.props.isAppDisabled} />
                        <hr />
                        <ResetApp />
                    </div>
                </div>
                
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
        onQDurationChange: input => dispatch(onQDurationChange(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemTabContent);