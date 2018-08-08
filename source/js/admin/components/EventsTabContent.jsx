import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
//https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

import AllEventsTable from './EventsTab/AllEventsTable.jsx';
import AddEditEventsForm from './EventsTab/AddEditEventsForm.jsx';

import {flattenEvent} from '../services/eventsService';

class EventsTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false,
            eventToEdit: {}
        }
    }

    onFormSubmit(formVals) {
        console.log(formVals);
        // TODO: dispatch action to submit form
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
                    onFormCancel={() => this.setState({isAddEditView: false})}
                    onFormSubmit={this.onFormSubmit.bind(this)}
                    {...this.state.eventToEdit}
                /> : 
                <div>
                    <button className="button" onClick={() => this.setState({isAddEditView:true})}>Add Event</button>
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
    }
}

export default connect(mapStateToProps)(EventsTabContent);