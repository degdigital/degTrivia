import classnames from 'classnames';

export default function button({content, type='submit', isDisabled = false, isLarge = false}) {
	const classes = classnames('button', {
		'button--large': isLarge
	});

	return `<button 
				class="${classes}" 
				type="${type}" 
				${isDisabled ? 'disabled' : ''}>
				${content}
			</button>`;
}