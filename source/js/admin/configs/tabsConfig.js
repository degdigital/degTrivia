import React from 'react';

import PlayersTabContent from '../components/PlayersTabContent.jsx';
import SystemTabContent from '../components/SystemTabContent.jsx';

export default [
    {
        title: 'Manage Gameplay',
        id: 'gameplay',
        content: 'gameplay'
    },
    {
        title: 'Events',
        id: 'events',
        content: 'events'
    },
    {
        title: 'Games',
        id: 'games',
        content: 'games'
    },
    {
        title: 'Copy',
        id: 'copy',
        content: 'copy'
    },
    {
        title: 'Players',
        id: 'players',
        content: <PlayersTabContent />
    },
    {
        title: 'System',
        id: 'system',
        content: <SystemTabContent />
    }
];