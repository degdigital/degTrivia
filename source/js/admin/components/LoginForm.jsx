import React from 'react';
import ReactDOM from 'react-dom';

import playerService from '../../services/playerService.js';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.settings = {
            emailInputClass: 'js-email-input',
            passwordInputClass: 'js-password-input',
            errorClass: 'text--error'
        };
        this.state = {
            hasError: false,
            errorMessage: ''
        }
        this.onLoginError = this.onLoginError.bind(this);
    }

    onFormSubmit(e) {
        e.preventDefault();
        let el = e.target;
        const email = el.querySelector(`.${this.settings.emailInputClass}`).value;
        const password = el.querySelector(`.${this.settings.passwordInputClass}`).value;

        playerService.getAuth().signInWithEmailAndPassword(email, password)
            .catch(this.onLoginError);
    }

    onLoginError(err) {
        console.log(err.code);
        this.setState({
            hasError: true,
            errorMessage: err.message
        });
    }

    renderError() {
        return (
            <div className={this.settings.errorClass}>{this.state.errorMessage}</div>
        );
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <fieldset>
                    <legend>Login</legend>
                    <div className="field">
                        <label htmlFor="email">Email address</label><br/>
                        <input className={this.settings.emailInputClass} name="email" id="email" type="email" required />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label><br />
                        <input className={this.settings.passwordInputClass} name="password" id="password" type="password" required />
                    </div>
                    <button type="submit">Login</button>
                </fieldset>
                {this.state.hasError ? this.renderError() : null }
            </form>
        )
    }
}

export default LoginForm;