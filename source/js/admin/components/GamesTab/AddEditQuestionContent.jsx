import React from 'react';

import QuestionsTable from './QuestionsTable.jsx';
import AddEditQuestionForm from './AddEditQuestionForm.jsx';

import {formatObj} from '../../services/gameService';

class AddEditQuestionContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false,
            questionToEdit: {}
        }
    }

    onFormSubmit(formVals) {
        // this.props.saveEvent(buildEventObject(formVals), formVals.id);
        this.setState({
            isAddEditView: false,
            questionToEdit: {}
        })
    }

    editQuestion(questionToEdit) {
        this.setState({
            isAddEditView: true,
            questionToEdit: formatObj(questionToEdit)
        })
    }

    render() {
        return (
            this.state.isAddEditView ? 
            <AddEditQuestionForm 
                onFormCancel={() => this.setState({isAddEditView: false, questionToEdit: {}})}
                onFormSubmit={this.onFormSubmit.bind(this)}
                {...this.state.questionToEdit}
            /> :
            <div>
                <button className="button" onClick={() => this.setState({isAddEditView:true, questionToEdit: {}})}>Add Question</button>
                <QuestionsTable 
                    questions={this.props.questions}
                    editQuestion={this.editQuestion.bind(this)}
                />
            </div>
        );
    }
}

export default AddEditQuestionContent;