import React from 'react';
import { connect } from 'react-redux';

import EventSelectField from './Shared/EventSelectField';

import gameEventService from '../services/gameEventService';
import { fetchEvents } from '../actions/actions';

class GameplayTabContent extends React.Component {

    componentDidMount() {
        this.props.fetchEvents();
    }

    onEventFieldChange(e) {
        gameEventService.setActiveEvent(e.target.value);
    }

    render() {
        return (
            <div>
                <EventSelectField changeEvent={this.onEventFieldChange.bind(this)}
                    eventOpts={this.props.eventOpts}
                    label='Active Event'
                    defaultOptText='No active event'
                    selectedOpt={this.props.activeEventId}
                />
                <div className="field">
                    <label className="label" htmlFor="activeGame">Active Game</label>
                    <select className="input input--select" name="activeGame" id="activeGame">
                        <option value="1">Game 1</option>
                        <option value="2">Game 2</option>
                        <option value="3">Game 3</option>
                    </select>
                </div>
                <div className="field">
                    <label className="label" htmlFor="activeQuestion">Active Question</label>
                    <select className="input input--select" name="activeQuestion" id="activeQuestion">
                        <option value="1">Q 1</option>
                        <option value="2">Q 2</option>
                        <option value="3">Q 3</option>
                    </select>
                </div>
                <button className="button">End Game</button>
            </div>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        eventOpts: data.events,
        activeEventId: data.activeEventId
    };
}

export default connect(mapStateToProps, {fetchEvents})(GameplayTabContent);