import React from 'react';

import { Tabs } from './Tabs.jsx';
import config from '../configs/tabsConfig';

import {
    fetchActiveEventId,
    fetchAppStatus,
    fetchEvents,
    fetchGames
} from '../actions/actions';
import { connect } from 'react-redux';

class Manager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.getSectionIndexFromUrl()
        }
    }

    componentDidMount() {
        this.props.fetchActiveEventId();
        this.props.fetchAppStatus();
        this.props.fetchEvents();
        this.props.fetchGames();
    }

    getSectionIndexFromUrl() {
        const hashVal = location.hash;
        const sectionId = hashVal.length > 0 ? hashVal.replace('#', '') : null;
        if (sectionId) {
            return config.map(item => item.id).indexOf(sectionId);
        }
        return 0;
    }

    getActiveSectionData() {
        if (this.state.activeIndex) {
            return config[this.state.activeIndex];
        }
        return config[0];
    }
    
    tabChanged() {
        this.setState({
            activeIndex: this.getSectionIndexFromUrl()
        })
    }

    render() {
        return (
            <main className="main">
                <Tabs config={config} 
                    activeSectionIndex={this.state.activeIndex}
                    activeSectionData={this.getActiveSectionData()}
                    tabChanged={this.tabChanged.bind(this)}
                />
            </main>
        )
    }
}

export default connect(null, {fetchActiveEventId, fetchAppStatus, fetchEvents, fetchGames})(Manager);