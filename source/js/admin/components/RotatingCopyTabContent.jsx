import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
//https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

import InputWithButtonField from './Shared/InputWithButtonField.jsx';
import SelectField from './Shared/SelectField.jsx';
import EditDeleteTable from './Shared/EditDeleteTable.jsx';
import {addRotatingCopy} from '../actions/rotatingCopyActions';

class RotatingCopyTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            event: this.props.activeEventId || (this.props.eventOpts[0] && this.props.eventOpts[0].id)
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
            event: e.target.value
        });
    }

    onDelete(itemId) {
        console.log('DELETING');
        // TODO: dispatch action to delete item
    }

    onEditSave(itemId, newText) {
        console.log('UPDATING');
        // TODO: dispatch action to update item
    }

    addRotatingCopy(textVal) {
        this.props.addRotatingCopy(textVal, this.state.event);
    }

    render() {
        //TODO: figure out how to set state when props.activeEventId === something
        const rotatingCopy = this.state.event ? this.getRotatingCopyForEvent(this.props.eventOpts, this.state.event) : [];

        return (
            <div>
                <h2>Add Rotating Copy</h2>
                <SelectField changeEvent={this.onEventFieldChange.bind(this)}
                    opts={this.props.eventOpts}
                    label='Event'
                    value={this.state.event}
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
        addRotatingCopy: (textVal, eventId) => dispatch(addRotatingCopy(textVal, eventId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RotatingCopyTabContent);