import classnames from 'classnames';
import { renderHtmlAttrs } from '../../utils/htmlAttrs.js';


export default function textInput({id, type='text', value='', isInvalid=false, isRequired=false, pattern='', additionalAttrs={}}) {
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
		${pattern ? `pattern="${pattern}"` : ''}
		${renderHtmlAttrs(additionalAttrs)} />`;
}