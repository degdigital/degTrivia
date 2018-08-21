import React from 'react';

const AllEventsTable = function(props) {
    return (
        <table className="table table--wide">
            <caption className="table__caption">All Events</caption>
            <thead className="table__header-row">
                <tr className="table__row table__row--header">
                    <th className="table__heading table__heading--left table__heading--bold ">Name</th>
                    <th className="table__heading table__heading--left table__heading--bold ">Alias</th>
                    <th className="table__heading table__heading--left table__heading--bold">Hashtag</th>
                    <th className="table__heading table__heading--left table__heading--bold">ID</th>
                    <th className="table__heading table__heading--left table__heading--bold">Number of Games</th>
                    <th className="table__heading table__heading--left table__heading--bold">Active Game ID</th>
                    <th className="table__heading table__heading--left table__heading--bold"></th>
                </tr>
            </thead>
            <tbody className="table__table-body">
                {
                    props.events.map(event => {
                        return (
                            <tr key={event.id} className="table__row table__data-row">
                                <td className="table__data-cell">{event.name || ''}</td>
                                <td className="table__data-cell">{event.alias || ''}</td>
                                <td className="table__data-cell">{event.hashtag || ''}</td>
                                <td className="table__data-cell">{event.id || ''}</td>
                                <td className="table__data-cell">{event.games && Object.keys(event.games).length || 0}</td>
                                <td className="table__data-cell">{event.activeGameId}</td>
                                <td className="table__data-cell">
                                    <button className="button button--alt button--small" onClick={() => props.editEvent(event)}>Edit</button>
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