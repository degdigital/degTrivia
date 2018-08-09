import React from 'react';
import { format as formatDate} from 'date-fns';

const AllEventsTable = function(props) {

    return (
        <table>
            <caption>All Events</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Event</th>
                    <th>Start Time (in local time)</th>
                    <th>Number Questions</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.games.map(game => {
                        return (
                            <tr key={game.id}>
                                <td>{game.name || ''}</td>
                                <td>{game.id || ''}</td>
                                <td>{game.event || ''}</td>
                                <td>{formatDate(game.startTime, 'MMM D, YYYY h:mm a')}</td>
                                <td>{game.questions && Object.keys(game.questions).length || 0}</td>
                                <td>
                                    <button className="button" onClick={() => props.editGame(game)}>Edit</button>
                                    <button className="button" onClick={() => props.resetGame(game.id)}>Reset</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default AllEventsTable;