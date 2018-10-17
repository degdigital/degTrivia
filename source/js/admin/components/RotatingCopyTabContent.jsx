import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
//https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

import InputWithButtonField from './Shared/InputWithButtonField.jsx';
import SelectField from './Shared/SelectField.jsx';
import EditDeleteTable from './Shared/EditDeleteTable.jsx';
import {
    addRotatingCopy,
    editRotatingCopy,
    deleteRotatingCopy
} from '../actions/rotatingCopyActions';

class RotatingCopyTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.activeEventId || (this.props.eventOpts[0] && this.props.eventOpts[0].id)
        }
        this.getRotatingCopyForEvent = memoize(
            (list, eventId) => {
                const evt = list.find(event => event.id === eventId);
                if (evt) {
                    return this.convertToArray(evt.pregameRotatingCopy);
                }
                return [];
            }
        )
    }

    convertToArray(rotatingCopyObj) {
        if (!rotatingCopyObj) {
            return [];
        }

        return Object.keys(rotatingCopyObj).map(key => {
            return {
                id: key,
                text: rotatingCopyObj[key]
            }
        })
    }

    onEventFieldChange(e) {
        this.setState({
            eventId: e.target.value
        });
    }

    onDelete(itemId) {
        this.props.deleteRotatingCopy(itemId, this.state.eventId);
    }

    onEditSave(itemId, newText) {
        this.props.editRotatingCopy(itemId, newText, this.state.eventId);
    }

    addRotatingCopy(textVal) {
        this.props.addRotatingCopy(textVal, this.state.eventId);
    }

    render() {
        //TODO: figure out how to set state when props.activeEventId === something
        const rotatingCopy = this.state.eventId ? this.getRotatingCopyForEvent(this.props.eventOpts, this.state.eventId) : [];

        return (
            <div>
                <h2>Add Rotating Copy</h2>
                <SelectField changeEvent={this.onEventFieldChange.bind(this)}
                    opts={this.props.eventOpts}
                    label='Event'
                    value={this.state.eventId}
                    selectId='event-select'
                />

                <InputWithButtonField
                    value=''
                    onButtonClick={this.addRotatingCopy.bind(this)}
                    buttonText="Add"
                />

                {
                    rotatingCopy ?
                    <EditDeleteTable items={rotatingCopy} onDelete={this.onDelete.bind(this)} onEditSave={this.onEditSave.bind(this)} /> :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        activeEventId: data.activeEventId,
        eventOpts: data.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addRotatingCopy: (textVal, eventId) => dispatch(addRotatingCopy(textVal, eventId)),
        editRotatingCopy: (itemId, newTextVal, eventId) => dispatch(editRotatingCopy(itemId, newTextVal, eventId)),
        deleteRotatingCopy: (itemId, eventId) => dispatch(deleteRotatingCopy(itemId, eventId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RotatingCopyTabContent);