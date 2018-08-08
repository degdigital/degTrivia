import React from 'react';

const EditDeleteTable = function(props) {
    function renderRows() {
        return props.items.map(item => (
           <EditableRow key={item.id} onDelete={props.onDelete} onEditSave={props.onEditSave} item={item}/>
        ))
    }

    return (
        <table>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    )
}

class EditableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            newText: this.props.item.text
        }
    }

    onSave() {
        this.props.onEditSave(this.props.item.id, this.state.newText);
        this.setState({
            isEditing: false
        })
    }

    renderDisplayRow() {
       return (
            <tr>
                <td>{this.props.item.text}</td>
                <td>
                    <button className="button" onClick={() => this.setState({isEditing: true})}>Edit</button>
                    <button className="button" onClick={() => this.props.onDelete(this.props.item.id)}>Delete</button>
                </td>
            </tr>
       )
    }

    renderEditRow() {
        return (
            <tr>
                <td>
                    <input type="text" value={this.state.newText} onChange={e => this.setState({newText:e.target.value})} />
                </td>
                <td>
                    <button className="button" onClick={this.onSave.bind(this)}>Save</button>
                    <button className="button" onClick={() => this.setState({isEditing: false, newText: this.props.item.text})}>Cancel</button>
                </td>
            </tr>
        )
    }

    render() {
        return this.state.isEditing ? this.renderEditRow() : this.renderDisplayRow();
    }
}

export default EditDeleteTable;