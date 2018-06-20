import React from 'react';
import tabs from '../plugins/tabs.js';

class Manager extends React.Component {

    componentDidMount() {
        tabs();
    }

    render() {
        return (
            <div>
                <h1>Welcome, admin!</h1>
                <ul class="tab-triggers">
                    <li><button class="tab-trigger" data-target="gameplay">Manage Gameplay</button></li>
                    <li><button class="tab-trigger" data-target="events">Events</button></li>
                    <li><button class="tab-trigger" data-target="games">Games</button></li>
                    <li><button class="tab-trigger" data-target="copy">Copy</button></li>
                    <li><button class="tab-trigger" data-target="players">Players</button></li>
                    <li><button class="tab-trigger" data-target="system">System</button></li>
                </ul>
                <div class="tab-section" data-section="gameplay">
                    <span>GamePlay</span>
                </div>
                <div class="tab-section" data-section="events">
                    <span>events</span>
                </div>
                <div class="tab-section" data-section="games">
                    <span>games</span>
                </div>
                <div class="tab-section" data-section="copy">
                    <span>copy</span>
                </div>
                <div class="tab-section" data-section="players">
                    <span>players</span>
                </div>
                <div class="tab-section" data-section="system">
                    <span>system</span>
                </div>
            </div>
        )
    }
}

export default Manager;