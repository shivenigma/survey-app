function getWelcomeTemplate() {
    return `${getHeadingTemplate()}
        <div class="content welcome">
            <h1>Hi! 👋</h1>
            <p>Help us get some insights into the quality of our products</p>
            <button type="button" class="button button--primary button--large" id="proceed-button">
                <span>Proceed</span>
                <img class="button__icon" src="assets/icons/arrow-right.svg" alt="arrow right" role="none" data-replace-svg>
            </button>
        </div>`
}
function getToggleTemplate(question) {
    if (question?.type !== 'rating' || !question?.options ||question?.options?.length <= 0) {
        throw 'Invalid question type';
    }
    return `${getHeadingTemplate()}
    <div class="content survey">
        <h2 class="survey__question">${question?.question}</h2>
        <div class="survey__answer survey__answer--rating">
            ${question?.options.map((item, i) => `
                <input type="radio" id="${item.text+i}" name="${question?.question}" ${question?.selectedValue === item.value ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>
    ${getActionTemplate()}`;
}
function getRadioTemplate(question) {
    if (question?.type !== 'boolean' || !question?.options ||question?.options?.length <= 0) {
        throw 'Invalid question type';
    }
    return `${getHeadingTemplate()}
    <div class="content survey">
        <h2 class="survey__question">${question?.question}</h2>
        <div class="survey__answer survey__answer--boolean">
            ${question?.options.map((item, i) => `
                <input type="radio" id="${item.text+i}" name="${question?.question}" ${question?.selectedValue == item.value ? 'checked' : ''} value="${item.value}">
                <label for="${item.text+i}">${item.text}</label>
            `).join('')}
        </div>
    </div>
    ${getActionTemplate()}`;
}
function getThanksTemplate() {
    return `${getHeadingTemplate()}
        <div class="content thanks">
            <div class="thanks__icon">
                <img src="assets/icons/tick.svg" alt="tick mark">
            </div>
            <h2 class="thanks__title">Thank you!</h2>
            <h3 class="thanks__subtitle">Thanks for helping us improve!</h3>
        </div>`;
}
function getTextTemplate(question) {
    if (question?.type !== 'text') {
        throw 'Invalid question type';
    }
    return `${getHeadingTemplate()}
        <div class="content survey">
            <h2 class="survey__question">${question?.question}</h2>
            <div class="survey__answer survey__answer--text">
                <textarea name="comments" id="comments1" cols="70" rows="8" placeholder="Add your comments here">${question?.selectedValue}</textarea>
            </div>
        </div>
        ${getActionTemplate()}`
}
function getActionTemplate() {
    return `<nav class="actions">
            <button type="button" class="button button--secondary" id="backButton">
                <img class="button__icon" src="assets/icons/arrow-left.svg" alt="arrow right" role="none" data-replace-svg>
                <span>Back</span>
            </button>
            <button type="button" class="button button--primary"  id="nextButton">
                <span>Next</span>
                <img class="button__icon" src="assets/icons/arrow-right.svg" alt="arrow right" role="none" data-replace-svg>
            </button>
        </nav>`
}
function getHeadingTemplate() {
    return `<h1 class="nav">FreshFruits</h1>`;
}

export {
    getWelcomeTemplate,
    getToggleTemplate,
    getRadioTemplate,
    getTextTemplate,
    getThanksTemplate
};
