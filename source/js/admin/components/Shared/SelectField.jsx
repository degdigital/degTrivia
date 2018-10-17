import React from 'react';

const SelectField = function(props) {
    return (
        <div className="field">
            <label htmlFor={props.selectId} className="label">{props.label}</label>
            <select className="input input--select-menu" name={props.selectId} id={props.selectId} onChange={props.changeEvent} value={props.value} disabled={props.isDisabled} required={props.required}>
                {
                    props.defaultOptText ? 
                    <option value="">{props.defaultOptText}</option> :
                    null 
                }

                {props.opts.map(opt => (
                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    )
}

SelectField.defaultProps = {
    isDisabled: false,
    selectId: 'item-select',
    value: '',
    isRequired: true
}

export default SelectField;