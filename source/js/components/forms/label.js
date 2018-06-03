export default function label({content, inputId}) {
	return `<label for="${inputId}" class="label">${content}</label>`;
}