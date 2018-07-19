import React from 'react';

const SelectField = function(props) {

    const selectId = props.selectId || 'item-select';

    return (
        <div>
            <label htmlFor={selectId} >{props.label}</label>
            <select className="" name={selectId} id={selectId} onChange={props.changeEvent} value={props.selectedOpt || ''}>
                <option value="">{props.defaultOptText}</option>
                {props.opts.map(opt => (
                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    )
}

export default SelectField;