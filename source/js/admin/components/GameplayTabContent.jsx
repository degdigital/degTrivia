import React from 'react';
import { connect } from 'react-redux';

import SelectField from './Shared/SelectField.jsx';
import AppDisabledOverlay from './Shared/AppDisabledOverlay.jsx';

import {
    setActiveEventId,
    setActiveGameId,
    setActiveQuestionId
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
        setActiveEventId: input => dispatch(setActiveEventId(input)),
        setActiveGameId: (eventId, gameId) => dispatch(setActiveGameId(eventId, gameId)),
        setActiveQuestionId: (gameId, qId) => dispatch(setActiveQuestionId(gameId, qId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameplayTabContent);