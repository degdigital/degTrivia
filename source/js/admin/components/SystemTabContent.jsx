import React from 'react';

import QuestionDuration from './SystemTab/QuestionDuration.jsx';

class SystemTabContent extends React.Component {

    render() {
        return (
            <div>
                <h2>This tab holds settings that will affect the entire system.</h2>
                <QuestionDuration />
            </div>
        )
    }
}

export default SystemTabContent;