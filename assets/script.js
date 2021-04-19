/*TODO: Need to refactor to use ES6 module based approach to be able to write tests better.

   Right now loaded the file using async and eval. It is not working as I want it to and it is dangerous to eval for security (may not be exactly true in this case). I should've anticipated this but I've neither wrote any unit tests outside of Angular nor used ES6 modules. I thought I can pull this app without going through creating modules since it is simple, but here we are.

*/

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
    saveState();
    if (appState.currentStep >= -1 && appState.currentStep < appState.data.length) {
        handleRoutingChange();
    } else {
        const thanks = document.getElementById('thanksTemplate');
        container.innerHTML = '';
        container.appendChild(thanks.content.cloneNode(true));
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
        const welcome = document.getElementById('welcomeTemplate');
        container.innerHTML = '';
        container.appendChild(welcome.content.cloneNode(true));
    }
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
                <input type="radio" onchange="updateBooleanValueAndState(this.value)" id="${item.text+i}" name="${question?.question}" ${question?.selectedValue == item.value ? 'checked' : ''} value="${item.value}">
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
                <textarea onblur="updateValueAndState(this.value)" name="comments" id="comments1" cols="70" rows="8" placeholder="Add your comments here">${question?.selectedValue}</textarea>
            </div>
        </div>`
}
