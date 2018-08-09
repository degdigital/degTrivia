import React from 'react';

import InputField from '../Shared/InputField.jsx';

export default class AddEditGameForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...props};

        this.onChoiceRemove.bind(this);
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSectionSubmit(e){
        e.preventDefault();
        this.props.onFormSubmit(this.state);
    }


    onChoiceAdd(e) {
        const newVal = {text: '', isNew: true, id: Date.now().toString()};
        if (this.state.choices) {
            this.setState({
                choices: [...this.state.choices, ...[newVal]]
            })
        } else {
            this.setState({
                choices: [newVal]
            })
        }
        
    }

    onChoiceRemove(id) {
        this.setState({
            choices: this.state.choices.filter(item => item.id !== id)
        })
    }

    renderChoices(items) {
        return items.map(item => (
            <div data-id={item.id} key={item.id}>
                <span>
                    <input key={item.id} className="input" type="text" value={item.text} />
                </span>
                <span>
                    <input key={item.id} className="input input--radio" type="radio" value={item.text} checked={item.id === this.state.correctChoice} />
                </span>
                <span>
                    <button key={item.id} className="button" type="button" onClick={() => this.onChoiceRemove(item.id)}>Remove</button>
                </span>
            </div>
        ))
    }

    render() {
        return (
            <fieldset>
                <legend>Add a Question</legend>
                <InputField
                    id='question'
                    label='Question Text'
                    value={this.state.question}
                    type='text'
                    onChange={this.onInputChange.bind(this)}
                />
                <button className="button" type="button" onClick={this.onChoiceAdd.bind(this)}>Add Choice</button>
                <div className="">
                    <div>Choices</div>
                    <div>Is correct answer?</div>
                </div>
                <div>
                    {this.state.choices ? this.renderChoices(this.state.choices) : null}
                </div>                
                <button className="button" type="button" onClick={this.onSectionSubmit.bind(this)}>Add</button>
                <button className="button" type="button" onClick={this.props.onFormCancel}>Cancel</button>
            </fieldset>
        )
    }
}

AddEditGameForm.defaultProps = {
    question: ''
}