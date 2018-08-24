import React from 'react';
import Table from '../Shared/Table.jsx';

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
        propName: 'event'
    }
]

const PlayersTable = function(props) {
    function renderCaption() {
        return `Players (${props.players.length})`;
    }

    return <Table columns={tableHeaderConfig} data={props.players} caption={renderCaption()} />
}

export default PlayersTable;