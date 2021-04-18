const appState = {
    currentStep: -1,
    data: [],
}
let container;
function replaceWithInlineSVG(image) {
    fetch(image.src).then(function(response) {
        return response.text();
    }).then(function(response){
            const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        // Get the SVG tag, ignore the rest
        let svg = xmlDoc.getElementsByTagName('svg')[0];
        // Add replaced image's ID to the new SVG
        if(typeof image.id !== 'undefined') {
            svg.setAttribute('id', image.id);
        }
        // Add replaced image's classes to the new SVG
        if(typeof image.className !== 'undefined') {
            svg.setAttribute('class', image.className);
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        svg.removeAttribute('xmlns:a');
        // if the viewport is not set the SVG wont't scale.
        if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
            svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
        }
        // Replace image with the generated SVG
        image.parentNode.replaceChild(svg, image);
    })
}
function init() {
    container = document.querySelector('.container');
    const welcome = document.getElementById('welcomeTemplate');
    container.appendChild(welcome.content);
}
/** Thinking whether I should create a state machine with the survey data that will also save the current state, that can be used for retaining it with localStorage. */
function getSurveyData() {
    fetch('assets/payload.json')
        .then(response => response.json())
        .then(data => {
            appState.data = data.questions;
            next();
        });
}
function next() {
    if (appState.currentStep >= -1 && appState.currentStep < appState.data.length) {
        appState.currentStep += 1;
        const survey = document.getElementById('surveyTemplate');
        console.log(container, container.lastChild);
        /* This is a hack, need to find a better way to replace entire inner content with a template fragment. Note: innerHTML is not rendering the template, need to check why. */
        container.innerHTML = '';
        container.appendChild(survey.content);
    }
}
function back() {
    if (appState.currentStep > -1) {
        appState.currentStep -= 1;
    }
}
