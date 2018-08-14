import React from 'react';

import InputField from '../Shared/InputField.jsx';
import {generateKey} from '../../services/gameService';
export default class AddEditGameForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...props};

        this.onChoiceRemove.bind(this);
    }

    onInputChange(e) {
        const newVal = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        this.setState({
            [e.target.name]: newVal
        })
    }

    onChoiceInputChange(id, val) {
        const newChoicesList = this.state.choices.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    ...{
                        text: val
                    }
                }
            }
            return item;
        });

        this.setState({
            choices: newChoicesList
        })
    }

    onCorrectChoiceChange(e) {
        this.setState({
            correctChoice: e.target.value
        })
    }

    onSectionSubmit(e){
        e.preventDefault();
        this.props.onFormSubmit(this.state);
    }

    onChoiceAdd(e) {
        const newVal = {text: '', id: generateKey(), chosenCount: 0};
        let newChoices;

        if (this.state.choices) {
            newChoices = [...this.state.choices, ...[newVal]];
        } else {
            newChoices = [newVal]
        }
        this.setState({
            choices: newChoices
        });        
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
                    <input className="input" type="text" value={item.text} onChange={e => this.onChoiceInputChange(item.id, e.target.value)} />
                </span>
                <span>
                    <input 
                        className="input input--radio" 
                        type="radio" 
                        name="correctChoice" 
                        value={item.id} 
                        checked={item.id === this.state.correctChoice}
                        onChange={this.onCorrectChoiceChange.bind(this)}
                    />
                </span>
                <span>
                    <button className="button" type="button" onClick={() => this.onChoiceRemove(item.id)}>Remove</button>
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
                <InputField
                    id='order'
                    label='Question Order'
                    value={this.state.order}
                    type='number'
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