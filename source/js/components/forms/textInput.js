import classnames from 'classnames';

export default function textInput({id, type='text', value='', isInvalid=false, isRequired=false, hasAutoFocus=false}) {
	const classes = classnames('input', {
		'input--invalid': isInvalid
	});

	return `<input 
		class="${classes}" 
		id="${id}" 
		name="${id}" 
		type="${type}" 
		value="${value}" 
		${isRequired ? 'required' : ''} 		
		autofocus="${hasAutoFocus}" />`;
}