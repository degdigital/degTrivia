import React from 'react';
import playerService from '../../services/playerService.js';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.settings = {
            errorClass: 'text--error'
        };
        this.state = {
            hasError: false,
            errorMessage: ''
        }
        this.onLoginError = this.onLoginError.bind(this);
    }

    updateFormVal(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onFormSubmit(e) {
        e.preventDefault();
        playerService.getAuth().signInWithEmailAndPassword(this.state.email, this.state.password)
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
                        <input onChange={this.updateFormVal.bind(this)} name="email" id="email" type="email" required />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label><br />
                        <input onChange={this.updateFormVal.bind(this)} name="password" id="password" type="password" required />
                    </div>
                    <button type="submit">Login</button>
                </fieldset>
                {this.state.hasError ? this.renderError() : null }
            </form>
        )
    }
}

export default LoginForm;