function renderMessages(messages) {
	return messages.reduce((html, message) => 
		`<div class="field-error-message">${message}</div>`,
		'');
}

export default function fieldErrorMessages(messages) {
	if(Array.isArray(messages) && messages.length > 0) {
		return `
			<div class="field-error-messages">
				${renderMessages(messages)}
			</div>
		`;
	}

	return '';
}