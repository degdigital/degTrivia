import React from 'react';
import { connect } from 'react-redux';

import InputWithButtonField from './Shared/InputWithButtonField.jsx';
import SelectField from './Shared/SelectField.jsx';
import {addRotatingCopy} from '../actions/rotatingCopyActions';

class RotatingCopyTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            event: this.props.activeEventId || (this.props.eventOpts[0] && this.props.eventOpts[0].id)
        }
    }

    componentDidMount() {
        if (this.props.events && this.state.event) {
            this.setState({
                rotatingCopy: this.getRotatingCopyForEvent(this.state.event)
            });
        }
    }

    getRotatingCopyForEvent(eventId) {
        const evt = this.props.eventOpts.find(event => event.id === eventId);
        if (evt) {
            return this.convertToArray(evt.pregameRotatingCopy);
        }
        return [];
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

    // on rotating copy update rotating copy for that event

    onEventFieldChange(e) {
        this.setState({
            event: e.target.value,
            rotatingCopy: this.getRotatingCopyForEvent(e.target.value)
        });
    }

    addRotatingCopy(textVal) {
        this.props.addRotatingCopy(textVal, this.state.event);
    }

    render() {
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
                    this.state.rotatingCopy ?
                    this.state.rotatingCopy.map(item => <div key={item.id}>{item.text}</div>) :
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