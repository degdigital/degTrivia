export default function formErrorMessage({errorMessage = null}) {
	if(errorMessage) {
		return `
			<p class="form-error-message ">
				<span class="icon icon--error form-error-message__icon"></span>
				<span class="form-error-message__text">${errorMessage}</span>
			</p>`;
	}

	return '';
}