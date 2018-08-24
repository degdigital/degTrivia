import React from 'react';
import { format as formatDate} from 'date-fns';

const AllEventsTable = function(props) {

    return (
        <table className="table table--wide">
            <caption className="table__caption">All Events</caption>
            <thead className="table__header-row">
                <tr className="table__row table__row--header">
                    <th className="table__heading table__heading--left table__heading--bold">Name</th>
                    <th className="table__heading table__heading--left table__heading--bold">ID</th>
                    <th className="table__heading table__heading--left table__heading--bold">Event</th>
                    <th className="table__heading table__heading--left table__heading--bold">Start Time (in local time)</th>
                    <th className="table__heading table__heading--left table__heading--bold">Number Questions</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="table__table-body">
                {
                    props.games.map(game => (
                            <tr key={game.id} className="table__row table__data-row">
                                <td className="table__data-cell">{game.name || ''}</td>
                                <td className="table__data-cell">{game.id || ''}</td>
                                <td className="table__data-cell">{game.event || ''}</td>
                                <td className="table__data-cell">{formatDate(game.startTime, 'MMM D, YYYY h:mm a')}</td>
                                <td className="table__data-cell">{game.questions && Object.keys(game.questions).length || 0}</td>
                                <td className="table__data-cell button-group">
                                    <button className="button button--small button--alt" onClick={() => props.editGame(game)}>Edit</button>
                                    <button className="button button--small button--orange" onClick={() => props.resetGame(game.id)}>Reset</button>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
    )
}

export default AllEventsTable;