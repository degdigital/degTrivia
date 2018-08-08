import React from 'react';

import addEditEventsConfig from '../../configs/addEditEventsConfig';
import InputField from '../Shared/InputField.jsx';

export default class AddEditEventsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onFormSubmit(e){
        e.preventDefault();
        this.props.onFormSubmit(this.state);
    }

    renderInputFields() {
        return addEditEventsConfig.map(inputItem => (
            <InputField
                key={inputItem.id}
                id={inputItem.id}
                label={inputItem.label}
                value={this.state[inputItem.id]}
                type='text'
                onChange={this.onInputChange.bind(this)}
            />
        ))
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <fieldset>
                    <legend>Add an Event</legend>
                    {this.renderInputFields()}
                    <button className="button" type="submit">Submit</button>
                    <button className="button" type="button" onClick={this.props.onFormCancel}>Cancel</button>
                </fieldset>
            </form>
        )
    }
}

AddEditEventsForm.defaultProps = {
    name: '',
    alias: '',
    hashtag: '',
    url: 'degtrivia.com',
    gameWaitBeforeQuestionsCopyTitle: `Let's Play!`,
    gameWaitBeforeQuestionsCopyDescription: `Answer the questions (no stopping for wrong answers) as fast as you can. 10 seconds per question. Speed and accuracy wins. Here comes the first question.`,
    gameBetweenQuestionsCopyTitle: 'Get Ready',
    gameBetweenQuestionsCopyDescription: `The next question is on it's way`,
    leaderboardCopyDescription: `Congrats on seeing your name in lights. Don't let someone steal your thunder. Play again to maintain your spot.`,
    postgameResultsCopyDescription: `Thanks for playing! See you again next week.`,
    registrationCopyTitle: `Welcome to DEG Trivia!`,
    registrationCopyDisclosure: `By filling out this form, you are opting in to receiving notifications regarding DEG Trivia via email and SMS, as well as general follow-up communications from the agency. Learn more about <a href='https://www.degdigital.com/deg-full-service-digital-agency/privacy-policy/' target='_blank'>DEG’s privacy policy</a>.`
}