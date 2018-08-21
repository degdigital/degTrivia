import React from 'react';

const PlayersTable = function(props) {
    function renderNumPlayers() {
        return <span>({props.players.length})</span>
    }

    function renderBody() {
        return (
            <tbody  className="table__table-body">
                {props.players.map(player => {
                    return (
                        <tr key={player.id} className="table__row table__data-row">
                            <td className="table__data-cell">{player.id}</td>
                            <td className="table__data-cell">{player.firstName}</td>
                            <td className="table__data-cell">{player.lastName}</td>
                            <td className="table__data-cell">{player.email}</td>
                            <td className="table__data-cell">{player.event}</td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    return (
        <table className="table table--wide">
            <caption className="table__caption">Players {renderNumPlayers()}</caption>
            <thead className="table__header-row">
                <tr className="table__row table__row--header">
                    <th className="table__heading table__heading--left table__heading--bold">ID</th>
                    <th className="table__heading table__heading--left table__heading--bold">First Name</th>
                    <th className="table__heading table__heading--left table__heading--bold">Last Name</th>
                    <th className="table__heading table__heading--left table__heading--bold">Email</th>
                    <th className="table__heading table__heading--left table__heading--bold">Event</th>
                </tr>
            </thead>
            {renderBody()}
        </table>
    )
}

export default PlayersTable;