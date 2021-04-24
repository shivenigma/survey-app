import {Router} from "./modules/router.js";
import {replaceWithInlineSVG} from "./modules/inlineSVG.js";
import {State} from "./modules/state.js";
import * as templates from "./modules/templates.js";

const router = new Router();
const stateHandler = new State();
const container = document.querySelector('.container');

router.add('thanks', (params) => {
    const savedState = stateHandler.getState();
    if (stateHandler.getProgressState() === true) {
        container.innerHTML = templates.getThanksTemplate();
        updateIcons();
        // submit the data here
        stateHandler.flush();
    } else {
        router.navigate('welcome');
    }
});
router.add('question/:id', handleQuestionsRoute)
router.add('', () => {
    stateHandler.init();
    container.innerHTML = templates.getWelcomeTemplate();
    container.querySelector('#proceed-button').addEventListener('click', () =>{
        router.navigate('/question/0');
    });
    updateIcons();
});
router.listen();
function handleQuestionsRoute(param) {
    const appState = stateHandler.getState();
    const currentQuestion = appState.questions[param.id];
    let template = '';
    switch (currentQuestion.type) {
        case 'rating': {
            template = templates.getToggleTemplate(currentQuestion);
            container.innerHTML = template;
            container.querySelectorAll('.survey__answer--rating > input')
                .forEach((input) => {
                    input.addEventListener('change', (event) => {
                        stateHandler.updateValueAndState(event.target.value, param.id);
                    })
                });
            break;
        }
        case 'boolean': {
            template = templates.getRadioTemplate(currentQuestion);
            container.innerHTML = template;
            container.querySelectorAll('.survey__answer--boolean > input')
                .forEach((input) => {
                    input.addEventListener('change', (event) => {
                        stateHandler.updateBooleanValueAndState(event.target.value, param.id);
                    })
                });
            break;
        }
        default : {
            template = templates.getTextTemplate(currentQuestion);
            container.innerHTML = template;
            container.querySelector('textarea')
                .addEventListener('blur', (event) => {
                    stateHandler.updateValueAndState(event.target.value, param.id);
                });
            break;
        }
    }
    container.querySelector('#backButton').addEventListener('click', () => {
        back(param);
    })
    container.querySelector('#nextButton').addEventListener('click', () => {
        next(param);
    });
    stateHandler.setProgressState(true);
    updateIcons();
}
function next(params) {
    const state = stateHandler.getState();
    if( params.id < state.questions.length - 1) {
        router.navigate(`/question/${Number(params.id) + 1}`);
    } else {
        router.navigate('thanks');
    }
}
function back(params) {
    if( params.id > 0) {
        router.navigate(`/question/${Number(params.id) - 1}`);
    } else {
        router.navigate('');
    }
}
function updateIcons() {
    /*
    Here we use observer pattern to notify routing change to the outside code and other modules.
    That will make a lot of things easier and consumers of router can just subscribe to that change and do their action.

    For this use case, I think that might be a over-engineered solution. For now calling this directly from the route callbacks.

    This is also a great use case for introducing before and after hooks in the router and call this function in the after hook.
     */

    document.querySelectorAll('img[data-replace-svg]').forEach(elem => {
        replaceWithInlineSVG(elem);
    })
}
