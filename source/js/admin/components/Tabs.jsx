import React from 'react';
import classnames from 'classnames';

export class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.renderTabButtons = this.renderTabButtons.bind(this);
    }

    renderTabButtons() {
        return this.props.config.map((section, index) => {
            const classes = classnames('tab-trigger', {
                'is-active': index === this.props.activeSectionIndex
            });

            return (
                <li key={index}>
                    <button className={classes}
                        onClick={this.showSection.bind(this)} 
                        name={section.id.toLowerCase()}
                    >
                        {section.title}
                    </button>
                </li>
            )
        })
    }

    showSection(e) {
        location.hash = e.target.name;
        this.props.tabChanged();
    }

    render() {
        return (
            <div>
                <ul className="tabs tab-triggers">
                    {this.renderTabButtons()}
                </ul>
                <TabContent {...this.props.activeSectionData} />
            </div>
           
        )
    }
}

export const TabContent = props => {
    return (
        <div className="tab-section is-active">
            {props.content}
        </div>
    )
}