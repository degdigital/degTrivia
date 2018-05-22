import {replaceContent} from '../utils/domUtils.js';
import formMapper from '../utils/formMapper.js';
import playerService from '../services/playerService.js';
import label from '../components/forms/label.js';
import textInput from '../components/forms/textInput.js';
import button from '../components/forms/button.js';
import formErrorMessage from '../components/forms/formErrorMessage.js';

const registationFormAttr = 'data-registration-form';

const registration = function({element}) {
    
    function bindEvents() {
        element.addEventListener('submit', onFormSubmit);
    }
    
    function render({errorMessage=null}) {
        
        replaceContent(element, `
                       <h1 class="page-title page-title--small">Welcome to DEG Trivia!</h1>
                       <form ${registationFormAttr}>
                       ${formErrorMessage({errorMessage})}
                       <div class="field">
                       ${label({content: 'First Name', inputId: 'firstName'})}
                       ${textInput({id: 'firstName', isRequired: true, additionalAttrs:{autofocus: true}})}
                       </div>
                       <div class="field">
                       ${label({content: 'Last Name', inputId: 'lastName'})}
                       ${textInput({id: 'lastName', isRequired: true})}
                       </div>
                       <div class="field">
                       ${label({content: 'Company', inputId: 'company'})}
                       ${textInput({id: 'company', isRequired: true})}
                       </div>
                       <div class="field">
                       ${label({content: 'Company Email', inputId: 'email'})}
                       ${textInput({id: 'email', type: 'email', isRequired: true})}
                       </div>
                       <div class="field">
                       ${label({content: 'Phone', inputId: 'phoneNumber'})}
                       ${textInput({id: 'phoneNumber', type: 'tel', isRequired: true})}
                       </div>
                       <div class="field">
                       ${label({content: 'Event Code', inputId: 'event'})}
                       ${textInput({id: 'event', isRequired: true, additionalAttrs:{autocapitalize: 'off'}})}
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
            const formVals = formMapper.getValues(el);
            playerService.register(formVals)
            .then(successMsg => renderPostRegisterMessage(element, successMsg))
            .catch(errorMsg => {
                   renderPostRegisterMessage(errorPlaceholderEl, errorMsg)
                   });
        }
    }
    
    function renderPostRegisterMessage(el, message) {
        replaceContent(el, `
                       <p>${message}</p>
                       `);
    }
    
    bindEvents();
    
    return {
    render: () => render({})
    };
    
};

export default registration;