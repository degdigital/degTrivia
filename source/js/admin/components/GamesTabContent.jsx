import React from 'react';
import { connect } from 'react-redux';

import AllGamesTable from './GamesTab/AllGamesTable.jsx';
import AddEditGamesForm from './GamesTab/AddEditGameForm.jsx';

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

    editEvent(eventToEdit) {
        // this.setState({
        //     isAddEditView: true,
        //     gameToEdit: flattenEvent(eventToEdit)
        // })
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
                <button className="button" onClick={() => this.setState({isAddEditView:true})}>Add Game</button>
                <AllGamesTable 
                    games={this.props.games}
                    editEvent={this.editEvent.bind(this)}
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

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesTabContent);