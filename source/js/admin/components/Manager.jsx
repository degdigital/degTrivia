import React from 'react';
import { Tabs } from './Tabs.jsx';

class Manager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSectionId: this.getSectionFromUrl()
        }
    }

    getSectionFromUrl() {
        const hashVal = location.hash;
		return hashVal.length > 0 ? hashVal.replace('#', '') : null;
    }
    
    tabChanged() {
        this.setState({
            activeSectionId: this.getSectionFromUrl()
        })
    }

    render() {
        const tabConfig = [
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
                content: 'players'
            },
            {
                title: 'System',
                id: 'system',
                content: 'system'
            }
        ];

        return (
            <div>
                <h1>Welcome, admin!</h1>
                <Tabs config={tabConfig} 
                    activeSectionId={this.state.activeSectionId || tabConfig[0].id}
                    tabChanged={this.tabChanged.bind(this)}
                />
            </div>
        )
    }
}

export default Manager;