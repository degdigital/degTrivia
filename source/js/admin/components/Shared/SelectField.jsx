import React from 'react';

const SelectField = function(props) {
    return (
        <div>
            <label htmlFor={props.selectId} >{props.label}</label>
            <select className="" name={props.selectId} id={props.selectId} onChange={props.changeEvent} value={props.value} disabled={props.isDisabled}>
                {
                    props.defaultOptsText ? 
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
    value: ''
}

export default SelectField;