import React from 'react';
import Table from '../Shared/Table.jsx';

const PlayersTable = function(props) {
    const tableHeaderConfig = [
        {
            displayName: 'ID',
            propName: 'id'
        },
        {
            displayName: 'First Name',
            propName: 'firstName'
        },
        {
            displayName: 'Last Name',
            propName: 'lastName'
        },
        {
            displayName: 'Email',
            propName: 'email'
        },
        {
            displayName: 'Event',
            type: 'custom',
            renderFn: dataItem => props.eventMap[dataItem.event]
        }
    ];

    function renderCaption() {
        return `Players (${props.players.length})`;
    }

    return <Table columns={tableHeaderConfig} data={props.players} caption={renderCaption()} />
}

export default PlayersTable;