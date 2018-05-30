import {replaceContent} from '../utils/domUtils.js';
import formMapper from '../utils/formMapper.js';
import playerService from '../services/playerService.js';
import label from '../components/forms/label.js';
import textInput from '../components/forms/textInput.js';
import button from '../components/forms/button.js';
import formErrorMessage from '../components/forms/formErrorMessage.js';
import fieldErrorMessages from '../components/forms/fieldErrorMessages.js';

const registationFormAttr = 'data-registration-form';
const formErrorMessageAttr = 'data-form-error-message';

const errorMessages = {
    invalidField: 'Oh no, something\'s wrong! Please fix the invalid form field(s) below.'
};

const defaultFormData = {
    firstName: {value: ''},
    lastName: {value: ''},
    companyName: {value: ''},
    email: {value: ''},
    phoneNumber: {value: ''},
    eventAlias: {value: ''}
};
let cachedEventData;

const registration = function(element) {

    function bindEvents() {
        element.addEventListener('submit', onFormSubmit);
    }

    function render(formData, errorMessage = null, eventData) {
        replaceContent(element, `
            <h1 class="page-title page-title--small">${eventData.registrationCopy.title}</h1>
            <form ${registationFormAttr}>
                ${formErrorMessage({errorMessage, dataAttr: formErrorMessageAttr})}
                <div class="field">
                    ${label({content: 'First Name', inputId: 'firstName'})}
                    ${textInput({id: 'firstName', value: formData.firstName.value, isRequired: true, isInvalid: formData.firstName.isInvalid, additionalAttrs:{autofocus: true}})}
                    ${fieldErrorMessages(formData.firstName.errorMessages)}
                </div>
                <div class="field">
                    ${label({content: 'Last Name', inputId: 'lastName'})}
                    ${textInput({id: 'lastName', value: formData.lastName.value, isRequired: true, isInvalid: formData.lastName.isInvalid})}
                    ${fieldErrorMessages(formData.lastName.errorMessages)}
                </div>
                <div class="field">
                    ${label({content: 'Company', inputId: 'companyName'})}
                    ${textInput({id: 'companyName', value: formData.companyName.value, isRequired: true, isInvalid: formData.companyName.isInvalid})}
                    ${fieldErrorMessages(formData.companyName.errorMessages)}
                </div>
                <div class="field">
                    ${label({content: 'Company Email', inputId: 'email'})}
                    ${textInput({id: 'email', type: 'email', value: formData.email.value, isRequired: true, isInvalid: formData.email.isInvalid})}
                    ${fieldErrorMessages(formData.email.errorMessages)}
                </div>
                <div class="field">
                    ${label({content: 'Phone', inputId: 'phoneNumber'})}
                    ${textInput({id: 'phoneNumber', type: 'tel', value: formData.phoneNumber.value, isRequired: true, isInvalid: formData.phoneNumber.isInvalid, additionalAttrs:{minlength: '10', maxlength: '14', placeholder: 'XXX-XXX-XXXX'}})}
                    ${fieldErrorMessages(formData.phoneNumber.errorMessages)}
                </div>
                <div class="field">
                    ${label({content: 'Event Code', inputId: 'eventAlias'})}
                    ${textInput({id: 'eventAlias', value: formData.eventAlias.value, isRequired: true, isInvalid: formData.eventAlias.isInvalid, additionalAttrs:{autocapitalize: 'off'}})}
                    ${fieldErrorMessages(formData.eventAlias.errorMessages)}
                </div>
                <div class="button-group button-group--centered">
                    ${button({content: 'Let\'s Play'})}
                </div>
            </form>
        `);
    }

    function onFormSubmit(e) {
        const el = e.target;
        if (el.hasAttribute(registationFormAttr)) {
            e.preventDefault();
            registerPlayer(el);
        }
    }

    function registerPlayer(formEl) {
         const formVals = formMapper.getValues(formEl);

         playerService.register(formVals)
            .catch(error => onRegisterPlayerError(error, formVals));
    }

    function onRegisterPlayerError(error, formVals) {
        const formData = mapFormValsToFormData(formVals);
        let errorMessage;

        if(error.prop) {
            const formDataProp = formData[error.prop];
            formDataProp.isInvalid = true;
            formDataProp.errorMessages = [error.message];

            errorMessage = errorMessages.invalidField;
        } else {
            errorMessage = error.message;
        }

        render(formData, errorMessage, cachedEventData);
        scrollFormErrorMessageIntoView();
    }

    function mapFormValsToFormData(formVals) {
        return Object.keys(defaultFormData).reduce((formData, key) => {
            formData[key] = {
                value: formVals[key]
            };
            return formData;
        }, {});
    }

    function scrollFormErrorMessageIntoView() {
        const formErrorMessageEl = document.querySelector(`[${formErrorMessageAttr}]`);
        formErrorMessageEl.scrollIntoView({behavior: "smooth"});
    }

    bindEvents();

    return {
        render: (eventData) => {
            cachedEventData = eventData;
            render(defaultFormData, null, eventData);
        }
    };

};

export default registration;