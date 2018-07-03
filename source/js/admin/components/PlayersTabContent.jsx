import React from 'react';

export default class PlayersTabContent extends React.Component {

    constructor(props) {
        super(props);
        // TODO: replace with data from service, have returned alphabetically by last name
        this.fakePeople = [
            {firstName: 'Jon', lastName: 'Snow', email: 'lordCommander@theWall.com', event: 'cnx18', id:'1'},
            {firstName: 'Danerys', lastName: 'Targaryen', email: 'queen@westeros.org', event: 'beer30', id:'2'},
            {firstName: 'Anna', lastName: 'Scheuler', email: 'ascheuler@degdigital.com', event: 'beer30', id:'3'}
        ];
        this.state = {
            eventId: '',
            includeDEGers: true,
            filteredPeople: this.fakePeople
        }
        this.filterByEvent = this.filterByEvent.bind(this);
        this.filterByCompany = this.filterByCompany.bind(this);
        this.filterByEventAndCompany = this.filterByEventAndCompany.bind(this);
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
        return this.fakePeople.filter(person => this.filterByEventAndCompany(person, eventId, includeDEG));
    }

    onEventFilterChange(e) {
        const newEventId = e.target.value;
        this.setState({
            eventId: newEventId,
            filteredPeople: this.filterPeople(newEventId, this.state.includeDEGers)
        });
    }

    onDegFilterChange(e) {
        const shouldIncludeDEG = !e.target.checked
       this.setState({
           includeDEGers: shouldIncludeDEG,
           filteredPeople: this.filterPeople(this.state.eventId, shouldIncludeDEG)
       })
    }

    render() {
        return (
            <div>
                <EventSelectField changeEvent={this.onEventFilterChange.bind(this)} />
                <NonDegersField changeEvent={this.onDegFilterChange.bind(this)} />
                <PlayersTable players={this.state.filteredPeople} />
            </div>
        );
    }
}

const EventSelectField = function(props) {
    //TODO: make options dynamic from db
    return (
        <div>
            <label htmlFor="player-filter" >Filter by Event</label>
            <select className="" name="player-filter" id="player-filter" onChange={props.changeEvent}>
                <option value="">All Events</option>
                <option value="beer30">beer30</option>
                <option value="cnx18">cnx18</option>
            </select>
        </div>
    )
}

const NonDegersField = function(props) {
    return (
        <div>
            <label htmlFor="non-deg-filter">View non-DEG-ers only</label>
            <input name="non-deg-filter" 
                id="non-deg-filter" 
                onChange={props.changeEvent}
                type="checkbox">
            </input>
        </div>
    );
}

const PlayersTable = function(props) {
    function renderNumPlayers() {
        return <span>({props.players.length})</span>
    }

    function renderBody() {
        return (
            <tbody>
                {props.players.map(player => {
                    return (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.firstName}</td>
                            <td>{player.lastName}</td>
                            <td>{player.email}</td>
                            <td>{player.event}</td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    return (
        <table>
            <caption>Players {renderNumPlayers()}</caption>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Event</th>
                </tr>
            </thead>
            {renderBody()}
        </table>
    )
}