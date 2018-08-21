import React from 'react';

const QuestionDuration = props => {
    
    function updateVal(e) {
        props.onQDurationChange(e.target.value);
    }

    function updateQuestionDuration(e) {
        e.preventDefault();
        props.updateDuration(props.questionDuration * 1000);
    }

    return (
        <form className="questionDuration-form" onSubmit={updateQuestionDuration.bind(this)}>
            <div className="field">
                <label htmlFor="questionDuration" className="label">Question Duration (seconds)</label>
                <input className="input" 
                    id="questionDuration" 
                    name="questionDuration" 
                    type="number" 
                    onChange={updateVal.bind(this)} 
                    required
                    value={props.questionDuration}
                />
                <button type="submit" className="button button--small button--alt">Update</button>
            </div>
            
        </form>
    )
}

export default QuestionDuration;