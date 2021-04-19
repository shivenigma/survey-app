let appState = {
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
    const savedState = localStorage.getItem('savedState');
    container = document.querySelector('.container');
    if(savedState) {
        appState = JSON.parse(savedState);
        handleRoutingChange();
    } else {
    const welcome = document.getElementById('welcomeTemplate');
    container.appendChild(welcome.content.cloneNode(true));
    }
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

function handleRoutingChange() {
    const currentQuestion = appState.data[appState.currentStep];
    let templateId = '';
    switch (currentQuestion.type) {
        case 'rating': {
            templateId = getToggleTemplate(currentQuestion);
            break;
        }
        case 'boolean': {
            templateId = getRadioTemplate(currentQuestion);
            break;
        }
        default : {
            templateId = getTextTemplate(currentQuestion);
            break;
        }
    }
    const actions = document.getElementById('actionsTemplate');
    container.innerHTML = templateId;
    container.appendChild(actions.content.cloneNode(true))
}

function next() {
    appState.currentStep += 1;
    if (appState.currentStep >= -1 && appState.currentStep < appState.data.length) {
        handleRoutingChange();
    } else {
        const thanks = document.getElementById('thanksTemplate');
        container.innerHTML = '';
        container.appendChild(thanks.content.cloneNode(true));
        localStorage.removeItem('savedState');
    }
}
function back() {
    appState.currentStep -= 1;
    if (appState.currentStep > -1) {
        handleRoutingChange();
    } else {
        const welcome = document.getElementById('welcomeTemplate');
        container.innerHTML = '';
        container.appendChild(welcome.content.cloneNode(true));
    }
}
function updateValueAndState(value){
    appState.data[appState.currentStep].selectedValue = value;
    localStorage.setItem('savedState', JSON.stringify(appState));
}
function getToggleTemplate(question) {
    if (question?.type !== 'rating') {
        throw 'Invalid question type';
    }
    return `<h1 class="nav">FreshFruits</h1>
    <div class="content survey">
        <h2 class="survey__question">${question?.question}</h2>
        <div class="survey__answer survey__answer--rating">
            ${question?.options.map((item, i) => `
                <input type="radio" id="${item.text+i}" name="${question?.question}" onchange="updateValueAndState(this.value)" ${i === 0 ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>`;
}
function getRadioTemplate(question) {
    if (question?.type !== 'boolean') {
        throw 'Invalid question type';
    }
    return `<h1 class="nav">FreshFruits</h1>
    <div class="content survey">
        <h2 class="survey__question">${question?.question}</h2>
        <div class="survey__answer survey__answer--boolean">
            ${question?.options.map((item, i) => `
                <input type="radio" onchange="updateValueAndState(this.value)" id="${item.text+i}" name="${question?.question}" ${i === 0 ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>`;
}
function getTextTemplate(question) {
    if (question?.type !== 'text') {
        throw 'Invalid question type';
    }
    return `<h1 class="nav">FreshFruits</h1>
        <div class="content survey">
            <h2 class="survey__question">${question?.question}</h2>
            <div class="survey__answer survey__answer--text">
                <textarea onblur="updateValueAndState(this.value)" name="comments" id="comments1" cols="70" rows="8" placeholder="Add your comments here"></textarea>
            </div>
        </div>`
}
