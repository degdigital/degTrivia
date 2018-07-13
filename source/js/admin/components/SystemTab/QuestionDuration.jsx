import React from 'react';

import {fetchQuestionDuration} from '../actions/actions';
import { connect } from 'react-redux';

class QuestionDuration extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            questionDuration: 0
        };

        this.props.fetchQuestionDuration();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.questionDuration !== state.questionDuration) {
            return {
                questionDuration: props.questionDuration
            }
        }
        return null;
    }

    updateVal(e) {
        this.setState({
            questionDuration: e.target.value
        });
    }

    updateQuestionDuration(e) {
        e.preventDefault();
        this.props.updateDuration(this.state.questionDuration * 1000);
    }

    render() {
        return (
            <form className="questionDuration-form" onSubmit={this.updateQuestionDuration.bind(this)}>
                <label htmlFor="questionDuration">Question Duration (seconds)</label>
                <input className="questionduration-input" 
                    id="questionDuration" 
                    name="questionDuration" 
                    type="number" 
                    onChange={this.updateVal.bind(this)} 
                    required
                    value={this.state.questionDuration}
                />
                <button type="submit">Update</button>
            </form>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        questionDuration: data.question.duration,
    }
}

export default connect(mapStateToProps, {fetchQuestionDuration})(QuestionDuration);