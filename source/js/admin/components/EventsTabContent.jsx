import React from 'react';
import { connect } from 'react-redux';

import Table from './Shared/Table.jsx';
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
        this.eventsTableConfig;
        this.editEvent.bind(this);
    }

    get eventsTableConfig() {
        return [
            {
                displayName: 'Name',
                propName: 'name'
            },
            {
                displayName: 'Alias',
                propName: 'alias'
            },
            {
                displayName: 'Hashtag',
                propName: 'hashtag'
            },
            {
                displayName: 'ID',
                propName: 'id'
            },
            {
                displayName: 'Number of Games',
                type: 'custom',
                renderFn: dataItem => (
                    dataItem.games && Object.keys(dataItem.games).length || 0
                )
            },
            {
                displayName: 'Active Game ID',
                propName: 'activeGameId'
            },
            {
                displayName: '',
                type: 'custom',
                renderFn: dataItem => (
                    <button className="button button--alt button--small" onClick={() => this.editEvent(dataItem)}>Edit</button>
                )
            }
        ]
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
                    <Table
                        data={this.props.events}
                        columns={this.eventsTableConfig}
                        caption='All Events'
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