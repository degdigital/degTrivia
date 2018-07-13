import React from 'react';

const PlayersTable = function(props) {
    function renderNumPlayers() {
        return <span>({props.players.length})</span>
    }

    function renderBody() {
        return (
            <tbody>
                {props.players.map(player => {
                    return (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.firstName}</td>
                            <td>{player.lastName}</td>
                            <td>{player.email}</td>
                            <td>{player.event}</td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    return (
        <table>
            <caption>Players {renderNumPlayers()}</caption>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Event</th>
                </tr>
            </thead>
            {renderBody()}
        </table>
    )
}

export default PlayersTable;