import React from 'react';
import Table from '../Shared/Table.jsx';

const tableHeaderConfig = [
    {
        displayName: 'ID',
        propsName: 'id'
    },
    {
        displayName: 'First Name',
        propsName: 'firstName'
    },
    {
        displayName: 'Last Name',
        propsName: 'lastName'
    },
    {
        displayName: 'Email',
        propsName: 'email'
    },
    {
        displayName: 'Event',
        propsName: 'event'
    }
]

const PlayersTable = function(props) {
    function renderCaption() {
        return `Players (${props.players.length})`;
    }

    return <Table columns={tableHeaderConfig} data={props.players} caption={renderCaption()} />
}

export default PlayersTable;