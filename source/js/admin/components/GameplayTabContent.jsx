import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField.jsx';
import AppDisabledOverlay from './Shared/AppDisabledOverlay.jsx';

import manageGameplayService from '../services/manageGameplayService';
import {
    getActiveGameId,
    getGamesForEvent,
    getActiveQuestionId,
    getQuestionsForGame,
    updateActiveEventId,
    updateActiveGameId,
    updateActiveQuestionId
} from '../actions/actions';

const GameplayTabContent = function(props) {

    function onEventFieldChange(e) {
        const eventId = e.target.value;
        // TODO: dispatch an action to do this?
        manageGameplayService.setActiveEvent(eventId).then(() => {
            props.getActiveGameId(eventId);
            props.getGamesForEvent(eventId);
        });
    }

    function onGameFieldChange(e) {
        const gameId = e.target.value;
        // TODO: dispatch an event to do this?
        manageGameplayService.setActiveGame(props.activeEventId, gameId).then(() => {
            props.updateActiveGameId(gameId);
        })
    }

    function onQuestionFieldChange(e) {
        const qId = e.target.value;
        manageGameplayService.setActiveQuestion(props.activeGameId, qId).then(() => {
            props.updateActiveQuestionId(qId)
        });
    }

    return (
        <div className="columns columns--two">
            <div className="column">
                <SelectField changeEvent={onEventFieldChange.bind(this)}
                    opts={props.eventOpts}
                    label='Active Event'
                    defaultOptText='No active event'
                    value={props.activeEventId}
                    selectId='event-select'
                    isDisabled={props.isAppDisabled}
                />

                {props.activeEventId ?
                    <SelectField changeEvent={onGameFieldChange.bind(this)}
                        opts={props.gameOpts}
                        label='Active Game'
                        defaultOptText='No active game'
                        value={props.activeGameId}
                        selectId='game-select'
                        isDisabled={props.isAppDisabled}
                    /> :
                    null
                }

                {props.activeEventId && props.activeGameId ?
                    <SelectField changeEvent={onQuestionFieldChange.bind(this)}
                        opts={props.questionOpts}
                        label='Active Question'
                        defaultOptText='No active question'
                        value={props.activeQuestionId}
                        selectId='question-select'
                        isDisabled={props.isAppDisabled}
                    /> :
                    null
                }
                {props.activeEventId && props.activeGameId ?
                    <button className="button" disabled={props.isAppDisabled}>End Game</button> :
                    null
                }
            </div>
            { props.isAppDisabled ?
                <div className="column"><AppDisabledOverlay content="App is currently disabled. Please reset to manage gameplay."/></div> :
                null
            }
        </div>
    )
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