import React from 'react';

const EditDeleteTable = function(props) {
    function renderRows() {
        return props.items.map(item => (
           <EditableRow key={item.id} onDelete={props.onDelete} onEditSave={props.onEditSave} item={item}/>
        ))
    }

    return (
        <table className="table table--wide">
            <tbody className="table__table-body">
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
            <tr className="table__row table__data-row">
                <td className="table__data-cell">{this.props.item.text}</td>
                <td className="table__data-cell button-group">
                    <button className="button button--small button--alt" onClick={() => this.setState({isEditing: true})}>Edit</button>
                    <button className="button button--small button--orange" onClick={() => this.props.onDelete(this.props.item.id)}>Delete</button>
                </td>
            </tr>
       )
    }

    renderEditRow() {
        return (
            <tr className="table__row table__data-row">
                <td className="table__data-cell">
                    <input type="text" className="input" value={this.state.newText} onChange={e => this.setState({newText:e.target.value})} />
                </td>
                <td className="table__data-cell button-group">
                    <button className="button button--small" onClick={this.onSave.bind(this)}>Save</button>
                    <button className="button button--small button--alt" onClick={() => this.setState({isEditing: false, newText: this.props.item.text})}>Cancel</button>
                </td>
            </tr>
        )
    }

    render() {
        return this.state.isEditing ? this.renderEditRow() : this.renderDisplayRow();
    }
}

export default EditDeleteTable;