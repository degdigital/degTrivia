import React from 'react';

const AllEventsTable = function(props) {
    return (
        <table>
            <caption>All Events</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Alias</th>
                    <th>Hashtag</th>
                    <th>ID</th>
                    <th>Number of Games</th>
                    <th>Active Game ID</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.events.map(event => {
                        return (
                            <tr key={event.id}>
                                <td>{event.name || ''}</td>
                                <td>{event.alias || ''}</td>
                                <td>{event.hashtag || ''}</td>
                                <td>{event.id || ''}</td>
                                <td>{Object.keys(event.games).length || 0}</td>
                                <td>{event.activeGameId}</td>
                                <td>
                                    <button className="button" onClick={() => props.editEvent(event)}>Edit</button>
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