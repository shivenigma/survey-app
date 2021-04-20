import {Router} from "../modules/router.js";
import {replaceWithInlineSVG} from "../modules/inlineSVG.js";
import {State} from "../modules/state.js";
import * as templates from "../modules/templates.js";
const router = new Router();
const state = new State();
const container = document.querySelector('.container');
router.add('thanks', (params) => {
    container.innerHTML = templates.getThanksTemplate();
    updateIcons();
    state.clearState();
    setTimeout(() => {
        router.navigate('welcome');
    }, 500);
});
router.add('question/:id', (args) => {
    handleRoutingChange(args);
})
router.add('', () => {
    state.init();
    container.innerHTML = templates.getWelcomeTemplate();
    container.querySelector('#proceed-button').addEventListener('click', () =>{
        router.navigate('/question/1');
    });
    updateIcons();
});
router.listen();
function handleRoutingChange(param) {
    const appState = state.getState();
    const currentQuestion = appState.questions[param.id];
    let template = '';
    switch (currentQuestion.type) {
        case 'rating': {
            template = templates.getToggleTemplate(currentQuestion);
            break;
        }
        case 'boolean': {
            template = templates.getRadioTemplate(currentQuestion);
            break;
        }
        default : {
            template = templates.getTextTemplate(currentQuestion);
            break;
        }
    }
    container.innerHTML = template;
    updateIcons();
}
function next() {
    appState.currentStep += 1;
    if (appState.currentStep >= -1 && appState.currentStep < appState.data.length) {
        handleRoutingChange();
    } else {
        const thanks = getThanksTemplate();
        container.innerHTML = thanks;
        /* TODO: Post collected data to a mock API endpoint here*/
        console.log(appState);
    }
}
function back() {
    appState.currentStep -= 1;
    if (appState.currentStep > -1) {
        handleRoutingChange();
    } else {
        const welcome = getWelcomeTemplate();
        container.innerHTML = welcome;
    }
}
function updateIcons() {
    // Should use observer pattern to notify routing change to the outside world from the user, that will make a lot of things easier and consumers of router can just subscribe to that change and do their thing. For now calling this directly from the route callbacks.

    document.querySelectorAll('img[data-replace-svg]').forEach(elem => {
        replaceWithInlineSVG(elem);
    })
}
