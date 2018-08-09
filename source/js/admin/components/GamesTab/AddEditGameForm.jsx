import React from 'react';

import InputField from '../Shared/InputField.jsx';
import SelectField from '../Shared/SelectField.jsx';

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

    onFormSubmit(e){
        e.preventDefault();
        this.props.onFormSubmit(this.state);
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
                            />
                            <SelectField
                                changeEvent={this.onInputChange.bind(this)}
                                opts={this.props.eventOpts}
                                label='Event'
                                value={this.state.event}
                                selectId='event'
                            />
                            <InputField
                                id='startTime'
                                label='Start Time'
                                value={this.state.startTime}
                                type='datetime-local'
                                onChange={this.onInputChange.bind(this)}
                            />
                        </div>
                        <div className="column">
                            Question stuff
                        </div>
                    </div>
                    <button className="button" type="submit">Submit</button>
                    <button className="button" type="button" onClick={this.props.onFormCancel}>Cancel</button>
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