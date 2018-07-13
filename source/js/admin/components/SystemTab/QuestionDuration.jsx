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
            <label htmlFor="questionDuration">Question Duration (seconds)</label>
            <input className="questionduration-input" 
                id="questionDuration" 
                name="questionDuration" 
                type="number" 
                onChange={updateVal.bind(this)} 
                required
                value={props.questionDuration}
            />
            <button type="submit">Update</button>
        </form>
    )
}

export default QuestionDuration;