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
            <tr className="table__row table__data-row" data-id={item.id} key={item.id}>
                <td className="table__data-cell">
                    <input className="input" type="text" value={item.text} onChange={e => this.onChoiceInputChange(item.id, e.target.value)} />
                </td>
                <td className="table__data-cell">
                    <input 
                        className="input input--radio" 
                        type="radio" 
                        name="correctChoice" 
                        value={item.id} 
                        checked={item.id === this.state.correctChoice}
                        onChange={this.onCorrectChoiceChange.bind(this)}
                    />
                </td>
                <td className="table__data-cell">
                    <button className="button button--small button--orange" type="button" onClick={() => this.onChoiceRemove(item.id)}>Remove</button>
                </td>
            </tr>
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
                <table className="table">
                    <thead className="table__header-row">
                        <tr className="table__row table__row--header">
                            <th className="table__heading">Choice Text</th>
                            <th className="table__heading">Is correct answer?</th>
                            <th className="table__heading"></th>
                        </tr>
                    </thead>
                    <tbody className="table__table-body">
                        {this.state.choices ? this.renderChoices(this.state.choices) : null}
                    </tbody>
                </table>
                <button className="button button--small" type="button" onClick={this.onChoiceAdd.bind(this)}>Add Choice</button>
                <div className="button-group">
                    <button className="button button--small" type="button" onClick={this.onSectionSubmit.bind(this)}>Add</button>
                    <button className="button button--small button--alt" type="button" onClick={this.props.onFormCancel}>Cancel</button>
                </div>
            </fieldset>
        )
    }
}

AddEditGameForm.defaultProps = {
    question: ''
}