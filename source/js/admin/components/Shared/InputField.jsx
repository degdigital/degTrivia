import React from 'react';

const InputField = function(props) {
    return (
        <div className="field">
            <label htmlFor={props.id} className="label">{props.label}</label>
            <br />
            <input 
                type={props.type} 
                className="input" 
                value={props.value} 
                disabled={props.isDisabled} 
                name={props.id} 
                id={props.id} 
                onChange={props.onChange} 
                required={props.isRequired}
            />
        </div>
    )
}

InputField.defaultProps = {
    isDisabled: false,
    id: 'item-input',
    value: '',
    isRequired: false
}

export default InputField;