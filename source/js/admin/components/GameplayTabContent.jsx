import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField';
import AppDisabledOverlay from './Shared/AppDisabledOverlay.jsx';

import manageGameplayService from '../services/manageGameplayService';
import {
    fetchEvents,
    getActiveGameId,
    getGamesForEvent,
    getActiveQuestionId,
    getQuestionsForGame,
    updateActiveEventId,
    updateActiveGameId,
    updateActiveQuestionId
} from '../actions/actions';

class GameplayTabContent extends React.Component {

    componentDidMount() {
        this.props.fetchEvents();
    }

    onEventFieldChange(e) {
        const eventId = e.target.value;
        // TODO: dispatch an event to do this?
        manageGameplayService.setActiveEvent(eventId).then(() => {
            this.props.getActiveGameId(eventId);
            this.props.getGamesForEvent(eventId);
        });
    }

    onGameFieldChange(e) {
        const gameId = e.target.value;
        // TODO: dispatch an event to do this?
        manageGameplayService.setActiveGame(this.props.activeEventId, gameId).then(() => {
            this.props.updateActiveGameId(gameId);
        })
    }

    onQuestionFieldChange(e) {
        const qId = e.target.value;
        manageGameplayService.setActiveQuestion(this.props.activeGameId, qId).then(() => {
            this.props.updateActiveQuestionId(qId)
        });
    }

    render() {
        return (
            <div className="columns columns--two">
                <div className="column">
                    <SelectField changeEvent={this.onEventFieldChange.bind(this)}
                        opts={this.props.eventOpts}
                        label='Active Event'
                        defaultOptText='No active event'
                        selectedOpt={this.props.activeEventId}
                        selectId='event-select'
                        isDisabled={this.props.isAppDisabled}
                    />

                    {this.props.activeEventId ?
                        <SelectField changeEvent={this.onGameFieldChange.bind(this)}
                            opts={this.props.gameOpts}
                            label='Active Game'
                            defaultOptText='No active game'
                            selectedOpt={this.props.activeGameId}
                            selectId='game-select'
                            isDisabled={this.props.isAppDisabled}
                        /> :
                        null
                    }

                    {this.props.activeEventId && this.props.activeGameId ?
                        <SelectField changeEvent={this.onQuestionFieldChange.bind(this)}
                            opts={this.props.questionOpts}
                            label='Active Question'
                            defaultOptText='No active question'
                            selectedOpt={this.props.activeQuestionId}
                            selectId='question-select'
                            isDisabled={this.props.isAppDisabled}
                        /> :
                        null
                    }
                    <button className="button" disabled={this.props.isAppDisabled}>End Game</button>
                </div>
                { this.props.isAppDisabled ?
                    <div className="column"><AppDisabledOverlay content="App is currently disabled. Please reset to manage gameplay."/></div> :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = ({data}) => {
    return {
        eventOpts: data.events,
        gameOpts: data.games,
        questionOpts: data.questions,
        activeEventId: data.activeEventId,
        activeGameId: data.activeGameId,
        activeQuestionId: data.activeQuestionId,
        isAppDisabled: data.isAppDisabled
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchEvents: () => dispatch(fetchEvents()),
        getActiveGameId: input => dispatch(getActiveGameId(input)),
        getGamesForEvent: input => dispatch(getGamesForEvent(input)),
        getActiveQuestionId: input => dispatch(getActiveQuestionId(input)),
        getQuestionsForGame: input => dispatch(getQuestionsForGame(input)),
        updateActiveEventId: input => dispatch(updateActiveEventId(input)),
        updateActiveGameId: input => dispatch(updateActiveGameId(input)),
        updateActiveQuestionId: input => dispatch(updateActiveQuestionId(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameplayTabContent);