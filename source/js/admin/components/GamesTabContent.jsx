import React from 'react';
import { connect } from 'react-redux';

import AllGamesTable from './GamesTab/AllGamesTable.jsx';
import AddEditGamesForm from './GamesTab/AddEditGameForm.jsx';

import {formatObj} from '../services/gameService';
import {resetGame} from '../actions/gameActions';
class GamesTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddEditView: false,
            gameToEdit: {}
        }
    }

    onFormSubmit(formVals) {
        // this.props.saveEvent(buildEventObject(formVals), formVals.id);
        this.setState({
            isAddEditView: false,
            gameToEdit: {}
        })
    }

    editGame(gameToEdit) {
        this.setState({
            isAddEditView: true,
            gameToEdit: formatObj(gameToEdit)
        })
    }

    resetGame(gameId) {
        this.props.resetGame(gameId);
    }

    render() {
        // TODO: have styling for active have to visually emphasize it
        return (
            this.state.isAddEditView ? 
            <AddEditGamesForm 
                onFormCancel={() => this.setState({isAddEditView: false, gameToEdit: {}})}
                onFormSubmit={this.onFormSubmit.bind(this)}
                {...this.state.gameToEdit}
                eventOpts={this.props.events}
            /> :
            <div>
                <button className="button" onClick={() => this.setState({isAddEditView:true, gameToEdit: {}})}>Add Game</button>
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
        events: data.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetGame: gameId => dispatch(resetGame(gameId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesTabContent);