import React from 'react';
import { connect } from 'react-redux';

import Table from './Shared/Table.jsx';
import AddEditGamesForm from './GamesTab/AddEditGameForm.jsx';

import {flattenObj} from '../services/gameService';
import {
    resetGame,
    setGameToEdit,
    saveGame
} from '../actions/gameActions';
class GamesTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false
        }
        this.gameTableConfig;

        this.updateStateAndStore.bind(this);
        this.editGame.bind(this);
        this.resetGame.bind(this);
    }

    get gameTableConfig() {
        return [
            {
                displayName: 'Name',
                propName: 'name'
            },
            {
                displayName: 'ID',
                propName: 'id'
            },
            {
                displayName: 'Event',
                propName: 'event'
            },
            {
                displayName: 'Start Time (in local time)',
                type: 'date',
                propName: 'startTime',
                dateFormat: 'MMM D, YYYY h:mm a'
            },
            {
                displayName: 'Number of Questions',
                type: 'custom',
                renderFn: dataItem => dataItem.questions && Object.keys(dataItem.questions).length || 0
            },
            {
                displayName: '',
                type: 'custom',
                renderFn: dataItem => (
                    <div className="button-group">
                        <button className="button button--small button--alt" onClick={ () => this.editGame(dataItem)}>Edit</button>
                        <button className="button button--small button--orange" onClick={() => props.resetGame(dataItem.id)}>Reset</button>
                    </div>
                )
            }
        ]
    }

    updateStateAndStore(isEditView, gameToEdit) {
        this.setState({
            isAddEditView: isEditView
        });
        this.props.setGameToEdit(gameToEdit);
    }

    onFormSubmit(formVals) {
        this.props.saveGame(formVals);
        this.updateStateAndStore(false, {})
    }

    editGame(gameToEdit) {
        this.updateStateAndStore(true, flattenObj(gameToEdit));
    }

    resetGame(gameId) {
        this.props.resetGame(gameId);
    }

    render() {
        // TODO: have styling for active have to visually emphasize it
        return (
            this.state.isAddEditView ? 
            <AddEditGamesForm 
                onFormCancel={() => this.updateStateAndStore(false, {})}
                onFormSubmit={this.onFormSubmit.bind(this)}
                {...this.props.gameToEdit}
                eventOpts={this.props.events}
            /> :
            <div>
                <button className="button button--small button--right" onClick={() => this.updateStateAndStore(true, {})}>Add Game</button>
                <Table 
                    data={this.props.games}
                    columns={this.gameTableConfig}
                    caption='All Games'
                />
            </div>
        );
    }
}

const mapStateToProps = ({data}) => {
    return {
        games: data.games,
        events: data.events,
        gameToEdit: data.gameToEdit
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetGame: gameId => dispatch(resetGame(gameId)),
        setGameToEdit: gameToEdit => dispatch(setGameToEdit(gameToEdit)),
        saveGame: newGameVals => dispatch(saveGame(newGameVals))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesTabContent);