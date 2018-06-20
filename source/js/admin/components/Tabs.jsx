import React from 'react';

export class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.renderTabButtons = this.renderTabButtons.bind(this);
    }

    renderTabButtons() {
        return this.props.config.map((section, index) => {
            const classes = section.id === this.props.activeSectionId ? 'tab-trigger is-active' : 'tab-trigger';
            return (
                <li key={index}>
                    <button className={classes}
                        onClick={this.showSection.bind(this)} 
                        data-target={section.id.toLowerCase()}
                    >
                        {section.title}
                    </button>
                </li>
            )
        })
    }

    showSection(e) {
        location.hash = e.target.dataset.target;
        this.props.tabChanged();
    }

    render() {
        const tabEls = this.props.config.map((tab, index) => (
            <Tab {...tab} activeSection={this.props.activeSectionId} key={index}/>
        ));

        return (
            <div>
                <ul className="tabs tab-triggers">
                    {this.renderTabButtons()}
                </ul>
                {tabEls}
            </div>
           
        )
    }
}

export const Tab = props => {
    const classes = props.id === props.activeSection ? 'tab-section is-active' : 'tab-section';
    return (
        <div className={classes} data-section={props.title.toLowerCase()}>
            {props.content}
        </div>
    )
}