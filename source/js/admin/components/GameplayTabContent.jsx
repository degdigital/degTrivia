import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField';

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

                {this.props.activeEventId && this.props.activeGameId ?
                    <SelectField changeEvent={this.onQuestionFieldChange.bind(this)}
                        opts={this.props.questionOpts}
                        label='Active Question'
                        defaultOptText='No active question'
                        selectedOpt={this.props.activeQuestionId}
                        selectId='question-select'
                    /> :
                    null
                }
                <button className="button">End Game</button>
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
        activeQuestionId: data.activeQuestionId
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