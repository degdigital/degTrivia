import classnames from 'classnames';
import { renderHtmlAttrs } from '../../utils/htmlAttrs.js';


export default function textInput({id, type='text', value='', isInvalid=false, isRequired=false, additionalAttrs={}}) {
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
		${renderHtmlAttrs(additionalAttrs)} />`;
}