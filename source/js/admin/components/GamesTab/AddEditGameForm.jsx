import React from 'react';
import { format as formatDate} from 'date-fns';

import InputField from '../Shared/InputField.jsx';
import SelectField from '../Shared/SelectField.jsx';
import AddEditQuestionContent from './AddEditQuestionContent.jsx';

export default class AddEditGameForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onDateTimeChange(e) {
        this.setState({
            [e.target.name]: new Date(e.target.value).valueOf()
        })
    }

    onFormSubmit(e){
        e.preventDefault();
        this.props.onFormSubmit({
            event: this.state.event,
            name: this.state.name,
            startTime: this.state.startTime
        });
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <fieldset>
                    <legend>Add a Game</legend>
                    <div className="columns columns--two">
                        <div className="column">
                            <InputField
                                id='name'
                                label='Name'
                                value={this.state.name}
                                type='text'
                                onChange={this.onInputChange.bind(this)}
                                isRequired={true}
                            />
                            <SelectField
                                changeEvent={this.onInputChange.bind(this)}
                                opts={this.props.eventOpts}
                                label='Event'
                                value={this.state.event}
                                defaultOptText='Select an event'
                                selectId='event'
                                isRequired={true}
                            />
                            <InputField
                                id='startTime'
                                label='Start Time'
                                value={this.state.startTime && formatDate(this.state.startTime, 'YYYY-MM-DDTHH:mm')}
                                type='datetime-local'
                                onChange={this.onDateTimeChange.bind(this)}
                                isRequired={true}
                            />
                        </div>
                        <div className="column">
                            <AddEditQuestionContent 
                                questions={this.props.questions || []}
                            />
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="button" type="submit">Submit</button>
                        <button className="button button--alt" type="button" onClick={this.props.onFormCancel}>Cancel</button>
                    </div>
                    
                </fieldset>
            </form>
        )
    }
}

AddEditGameForm.defaultProps = {
    name: '',
    event: '',
    startTime: ''
}