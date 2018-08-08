import React from 'react';

const SelectField = function(props) {
    return (
        <div>
            <label htmlFor={props.selectId} >{props.label}</label>
            <select className="" name={props.selectId} id={props.selectId} onChange={props.changeEvent} value={props.value} disabled={props.isDisabled ? true : false}>
                <option value="">{props.defaultOptText}</option>
                {props.opts.map(opt => (
                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    )
}

SelectField.defaultProps = {
    selectId: 'item-select',
    value: ''
}

export default SelectField;