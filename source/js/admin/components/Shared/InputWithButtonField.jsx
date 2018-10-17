import React from 'react';

class InputWithButtonField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputText: props.value
        }
    }

    onInputChange(e) {
        this.setState({
            inputText: e.target.value
        });
    }

    onButtonClick() {
        this.props.onButtonClick(this.state.inputText);
        this.setState({
            inputText: ''
        });
    }

    render() {
        return (
            <div className="field">
                <label className="label">New Rotating Copy Text</label>
                <input type="text" className="input" value={this.state.inputText} onChange={this.onInputChange.bind(this)} />
                <button onClick={this.onButtonClick.bind(this)} className="button button--small">{this.props.buttonText}</button>
            </div>
        )

    }
}

export default InputWithButtonField;