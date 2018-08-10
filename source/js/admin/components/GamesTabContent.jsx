import React from 'react';
import { connect } from 'react-redux';

import AllGamesTable from './GamesTab/AllGamesTable.jsx';
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
        this.updateStateAndStore.bind(this);
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
                <button className="button" onClick={() => this.updateStateAndStore(true, {})}>Add Game</button>
                <AllGamesTable 
                    games={this.props.games}
                    editGame={this.editGame.bind(this)}
                    resetGame={this.resetGame.bind(this)}
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