import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField';

import manageGameplayService from '../services/manageGameplayService';
import { fetchEvents } from '../actions/actions';

class GameplayTabContent extends React.Component {

    componentDidMount() {
        this.props.fetchEvents();
    }

    onEventFieldChange(e) {
        manageGameplayService.setActiveEvent(e.target.value);
    }

    onGameFieldChange(e) {
        manageGameplayService.setActiveGame(this.props.activeEventId, e.target.value);
    }

    render() {
        return (
            <div>
                <SelectField changeEvent={this.onEventFieldChange.bind(this)}
                    opts={this.props.eventOpts}
                    label='Active Event'
                    defaultOptText='No active event'
                    selectedOpt={this.props.activeEventId}
                    selectId='event-select'
                />

                {this.props.activeEventId ?
                    <SelectField changeEvent={this.onGameFieldChange.bind(this)}
                        opts={this.props.gameOpts}
                        label='Active Game'
                        defaultOptText='No active game'
                        selectedOpt={this.props.activeGameId}
                        selectId='game-select'
                    /> :
                    null
                }
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
        gameOpts: data.games,
        activeEventId: data.activeEventId,
        activeGameId: data.activeGameId
    };
}

export default connect(mapStateToProps, {fetchEvents})(GameplayTabContent);