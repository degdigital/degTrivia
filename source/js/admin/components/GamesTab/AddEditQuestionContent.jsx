import React from 'react';
import { connect } from 'react-redux';

import QuestionsTable from './QuestionsTable.jsx';
import AddEditQuestionForm from './AddEditQuestionForm.jsx';

import {flattenObj, buildObj} from '../../services/gameService';
import {
    setQuestionToEdit,
    removeQuestion,
    updateGameQuestion,
    generateQuestion
} from '../../actions/gameActions';

class AddEditQuestionContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false
        }
        this.updateStateAndStore.bind(this);
    }

    updateStateAndStore(isEditView, questionToEdit) {
        this.setState({
            isAddEditView: isEditView
        });
        this.props.setQuestionToEdit(questionToEdit);
    }

    onFormSubmit(formVals) {
        // console.log(buildObj(formVals));
        this.props.updateGameQuestion(buildObj(formVals));
        this.updateStateAndStore(false, {});
    }

    editQuestion(questionToEdit) {
        this.updateStateAndStore(true, flattenObj(questionToEdit));
    }

    render() {
        return (
            this.state.isAddEditView || this.props.questionToEdit && Object.keys(this.props.questionToEdit).length ? 
            <AddEditQuestionForm 
                onFormCancel={() => this.updateStateAndStore(false, {})}
                onFormSubmit={this.onFormSubmit.bind(this)}
                {...this.props.questionToEdit}
            /> :
            <div>
                <button className="button" type="button" onClick={() => this.updateStateAndStore(true, {})}>Add Question</button>
                <button className="button" type="button" onClick={this.props.generateQuestion}>Generate Question</button>
                <QuestionsTable 
                    questions={this.props.questions}
                    editQuestion={this.editQuestion.bind(this)}
                    deleteQuestion={this.props.removeQuestion}
                />
            </div>
        );
    }
}

const mapStateToProps = ({data}) => {
    return {
        questionToEdit: data.questionToEdit
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setQuestionToEdit: qToEdit => dispatch(setQuestionToEdit(qToEdit)),
        removeQuestion: qId => dispatch(removeQuestion(qId)),
        updateGameQuestion: updatedQuestion => dispatch(updateGameQuestion(updatedQuestion)),
        generateQuestion: () => dispatch(generateQuestion())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditQuestionContent);