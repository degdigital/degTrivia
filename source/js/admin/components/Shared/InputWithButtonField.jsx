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
    }

    render() {
        return (
            <div className="field">
                <input type="text" value={this.state.inputText} onChange={this.onInputChange.bind(this)} />
                <button onClick={this.onButtonClick.bind(this)} className="button">{this.props.buttonText}</button>
            </div>
        )

    }
}

export default InputWithButtonField;