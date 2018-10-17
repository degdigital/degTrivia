import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField.jsx';
import AppDisabledOverlay from './Shared/AppDisabledOverlay.jsx';

import {
    setActiveEventId,
    setActiveGameId,
    setActiveQuestionId,
    activateHostIsTalking,
    endGame
} from '../actions/actions';

const GameplayTabContent = function(props) {

    function onEventFieldChange(e) {
        props.setActiveEventId(e.target.value);
    }

    function onGameFieldChange(e) {
        props.setActiveGameId(props.activeEventId, e.target.value);
    }

    function onQuestionFieldChange(e) {
        props.setActiveQuestionId(props.activeGameId, e.target.value);
    }

    function activateHostIsTalking() {
        props.activateHostIsTalking(props.activeGameId);
    }

    function endGame() {
        props.endGame(props.activeGameId);
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
                    <div className="button-group">
                    {props.activeEventId && props.activeGameId ?
                        <button className="button button--alt" disabled={props.isAppDisabled} onClick={activateHostIsTalking.bind(this)}>
                            Host is talking
                        </button> :
                        null
                    }

                    {props.activeEventId && props.activeGameId ?
                        <button className="button button--alt" disabled={props.isAppDisabled} onClick={endGame.bind(this)}>
                            End Game
                        </button> :
                        null
                    }
                </div>
                
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
        gameOpts: data.gamesForEvent,
        questionOpts: data.questions,
        activeEventId: data.activeEventId,
        activeGameId: data.activeGameId,
        activeQuestionId: data.activeQuestionId,
        isAppDisabled: data.isAppDisabled
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setActiveEventId: input => dispatch(setActiveEventId(input)),
        setActiveGameId: (eventId, gameId) => dispatch(setActiveGameId(eventId, gameId)),
        setActiveQuestionId: (gameId, qId) => dispatch(setActiveQuestionId(gameId, qId)),
        activateHostIsTalking: gameId => dispatch(activateHostIsTalking(gameId)),
        endGame: gameId => dispatch(endGame(gameId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameplayTabContent);