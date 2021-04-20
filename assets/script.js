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
    const savedState = getState();
    container = document.querySelector('.container');
    if(savedState) {
        appState = JSON.parse(savedState);
        handleRoutingChange();
    } else {
    const welcome = getWelcomeTemplate();
    container.innerHTML = welcome;
    }
}
function getSurveyData() {
    fetch('assets/payload.json')
        .then(response => response.json())
        .then(data => {
            appState.data = data.questions.map(item => {
                if (item.type === 'rating' || item.type === 'boolean'){
                    item.selectedValue = item.options[0].value;
                } else {
                    item.selectedValue = '';
                }
                return item;
            });
            next();
        });
}

function handleRoutingChange() {
    const currentQuestion = appState.data[appState.currentStep];
    let template = '';
    switch (currentQuestion.type) {
        case 'rating': {
            template = getToggleTemplate(currentQuestion);
            break;
        }
        case 'boolean': {
            template = getRadioTemplate(currentQuestion);
            break;
        }
        default : {
            template = getTextTemplate(currentQuestion);
            break;
        }
    }
    container.innerHTML = template;
}

function next() {
    appState.currentStep += 1;
    saveState();
    if (appState.currentStep >= -1 && appState.currentStep < appState.data.length) {
        handleRoutingChange();
    } else {
        const thanks = getThanksTemplate();
        container.innerHTML = thanks;
        /* TODO: Post collected data to a mock API endpoint here*/
        console.log(appState);
        clearState();
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
function getState() {
    return localStorage.getItem('savedState');
}
function saveState() {
    localStorage.setItem('savedState', JSON.stringify(appState));
}
function clearState() {
    localStorage.removeItem('savedState');
}
function updateValueAndState(value){
    appState.data[appState.currentStep].selectedValue = value;
}
function updateBooleanValueAndState(value) {
    /*This conversion is ugly but there is no way to get true or false as a true boolean from HTML attributes, because they are considered and returned as strings. I used a adapter method for the conversion and passing the data into the regular data handling for boolean type template.*/
    let bool = value;
    if (value && typeof value === "string") {
        if (value.toLowerCase() === "true"){
            bool = true;
        }
        if (value.toLowerCase() === "false") {
            bool = false;
        }
    }
    updateValueAndState(bool);
}
function getWelcomeTemplate() {
    return `
    <h1 class="nav">FreshFruits</h1>
        <div class="content welcome">
            <h1>Hi! 👋</h1>
            <p>Help us get some insights into the quality of our products</p>
            <button type="button" class="button button--primary button--large" onclick="getSurveyData()">
                <span>Proceed</span>
                <img class="button__icon" src="assets/icons/arrow-right.svg" alt="arrow right" role="none" onload="replaceWithInlineSVG(this)">
            </button>
        </div>`
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
                <input type="radio" id="${item.text+i}" name="${question?.question}" onchange="updateValueAndState(this.value)" ${question?.selectedValue === item.value ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>
    ${getActionTemplate()}`;
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
                <input type="radio" onchange="updateBooleanValueAndState(this.value)" id="${item.text+i}" name="${question?.question}" ${question?.selectedValue == item.value ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>
    ${getActionTemplate()}`;
}
function getTextTemplate(question) {
    if (question?.type !== 'text') {
        throw 'Invalid question type';
    }
    return `<h1 class="nav">FreshFruits</h1>
        <div class="content survey">
            <h2 class="survey__question">${question?.question}</h2>
            <div class="survey__answer survey__answer--text">
                <textarea onblur="updateValueAndState(this.value)" name="comments" id="comments1" cols="70" rows="8" placeholder="Add your comments here">${question?.selectedValue}</textarea>
            </div>
        </div>
        ${getActionTemplate()}`
}
function getActionTemplate() {
    return `<nav class="actions"  id="actions">
            <button type="button" class="button button--secondary" onclick="back()">
                <img class="button__icon" src="assets/icons/arrow-left.svg" alt="arrow right" role="none" onload="replaceWithInlineSVG(this)">
                <span>Back</span>
            </button>
            <button type="button" class="button button--primary" onclick="next()">
                <span>Next</span>
                <img class="button__icon" src="assets/icons/arrow-right.svg" alt="arrow right" role="none" onload="replaceWithInlineSVG(this)">
            </button>
        </nav>`
}
function getThanksTemplate() {
    return `<h1 class="nav">FreshFruits</h1>
        <div class="content thanks" id="thanks">
            <div class="thanks__icon">
                <img src="assets/icons/tick.svg" alt="tick mark">
            </div>
            <h2 class="thanks__title">Thank you!</h2>
            <h3 class="thanks__subtitle">Thanks for helping us improve!</h3>
        </div>`;
}
