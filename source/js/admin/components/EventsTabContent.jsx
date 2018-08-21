import React from 'react';
import { connect } from 'react-redux';

import AllEventsTable from './EventsTab/AllEventsTable.jsx';
import AddEditEventsForm from './EventsTab/AddEditEventsForm.jsx';

import {flattenEvent, buildEventObject} from '../services/eventsService';
import {saveEventChanges} from '../actions/eventTabActions';

class EventsTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false,
            eventToEdit: {}
        }
    }

    onFormSubmit(formVals) {
        this.props.saveEvent(buildEventObject(formVals), formVals.id);
        this.setState({
            isAddEditView: false,
            eventToEdit: {}
        })
    }

    editEvent(eventToEdit) {
        this.setState({
            isAddEditView: true,
            eventToEdit: flattenEvent(eventToEdit)
        })
    }

    render() {
        // TODO: have styling for active have to visually emphasize it
        return (
            this.state.isAddEditView ? 
                <AddEditEventsForm 
                    onFormCancel={() => this.setState({isAddEditView: false, eventToEdit: {}})}
                    onFormSubmit={this.onFormSubmit.bind(this)}
                    {...this.state.eventToEdit}
                /> : 
                <div>
                    <button className="button button--small button--right" onClick={() => this.setState({isAddEditView:true})}>Add Event</button>
                    <AllEventsTable 
                        events={this.props.events}
                        editEvent={this.editEvent.bind(this)}
                    />
                </div>
        );
    }
}

const mapStateToProps = ({data}) => {
    return {
        events: data.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveEvent: (eventObject, eventId) => dispatch(saveEventChanges(eventObject, eventId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsTabContent);