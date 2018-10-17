import React from 'react';

import EventsTabContent from '../components/EventsTabContent.jsx';
import GameplayTabContent from '../components/GameplayTabContent.jsx';
import PlayersTabContent from '../components/PlayersTabContent.jsx';
import RotatingCopyTabContent from '../components/RotatingCopyTabContent.jsx';
import SystemTabContent from '../components/SystemTabContent.jsx';

export default [
    {
        title: 'Manage Gameplay',
        id: 'gameplay',
        content: <GameplayTabContent />
    },
    {
        title: 'Events',
        id: 'events',
        content: <EventsTabContent />
    },
    {
        title: 'Games',
        id: 'games',
        content: 'games'
    },
    {
        title: 'Copy',
        id: 'copy',
        content: <RotatingCopyTabContent />
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