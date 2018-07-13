import React from 'react';

export default class QuestionDuration extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            questionDuration: 15 // TODO: get question duration from firebase and convert to seconds
        };
    }

    updateVal(e) {
        this.setState({
            questionDuration: e.target.value
        });
    }

    updateQuestionDuration(e) {
        e.preventDefault();
        console.log(this.state.questionDuration * 1000);
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