import React from 'react';

import SelectField from './Shared/SelectField';
import NonDegersField from './PlayersTab/NonDegersField';
import PlayersTable from './PlayersTab/PlayersTable';

import { fetchPlayers, fetchEvents } from '../actions/actions';
import { connect } from 'react-redux';

class PlayersTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: '',
            includeDEGers: true,
            filteredPlayersList: props.fullPlayersList,
            fullPlayersList: props.fullPlayersList
        }

        this.props.fetchPlayers();
        this.props.fetchEvents();

        this.filterPeople = this.filterPeople.bind(this);
        this.filterByEvent = this.filterByEvent.bind(this);
        this.filterByCompany = this.filterByCompany.bind(this);
        this.filterByEventAndCompany = this.filterByEventAndCompany.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (PlayersTabContent.hasPropsListUpdated(props.fullPlayersList, state.fullPlayersList)) {
            return {
                fullPlayersList: props.fullPlayersList,
                filteredPlayersList: props.fullPlayersList
            }
        }
        // TODO: set active event id as default id
        return null;
    }

    static hasPropsListUpdated(propsList, stateList) {
        return propsList.length !== stateList.length;
    }

    filterByEvent(person, eventId) {
        if (eventId) {
            return person.event === eventId;
        }
        return true;
    }

    filterByCompany(person, includeDEGers) {
        if (!includeDEGers) {
            return person.email.toLowerCase().indexOf(`@degdigital.com`) === -1;
        }
        return true;
    }

    filterByEventAndCompany(person, eventId, includeDEG) {
        return this.filterByEvent(person, eventId) && this.filterByCompany(person, includeDEG);
    }

    filterPeople(eventId, includeDEG) {
        return this.state.fullPlayersList.filter(person => this.filterByEventAndCompany(person, eventId, includeDEG));
    }

    onEventFilterChange(e) {
        const newEventId = e.target.value;
        this.setState({
            eventId: newEventId,
            filteredPlayersList: this.filterPeople(newEventId, this.state.includeDEGers)
        });
    }

    onDegFilterChange(e) {
        const shouldIncludeDEG = !e.target.checked
       this.setState({
           includeDEGers: shouldIncludeDEG,
           filteredPlayersList: this.filterPeople(this.state.eventId, shouldIncludeDEG)
       })
    }

    render() {
        return (
            <div>
                <SelectField changeEvent={this.onEventFilterChange.bind(this)} 
                    opts={this.props.eventOpts}
                    label='Filter by Event'
                    defaultOptText='All Events'
                    selectId='event-select'
                />
                <NonDegersField changeEvent={this.onDegFilterChange.bind(this)} />
                <PlayersTable players={this.state.filteredPlayersList} />
            </div>
        );
    }
}

const mapStateToProps = ({data}) => {
    return {
        eventOpts: data.events,
        fullPlayersList: data.players
    }
}

export default connect(mapStateToProps, { fetchPlayers, fetchEvents })(PlayersTabContent);