import * as templates from '../modules/templates.js';

/**
 * In this spec, I want to test the correctness of the template functions. But it feels like I'm testing the implementation details, I don't really know a better way to test these at the moment.
 *
 * The glue functions that brings these templates to life is in a JS file. So these things are probably should be covered in an integration test suite, maybe.
 */
describe('template functions', function () {
    const questions = [{type:"rating",question:"How do you rate the delivery experience?",options:[{text:"Great",value:"10"},{text:"Not so Great",value:"5"},{text:"Awful",value:"0"}],selectedValue:"10"},{type:"rating",question:"How do you rate the Freshness of the fruits?",options:[{text:"Great",value:"10"},{text:"Not so Great",value:"5"},{text:"Awful",value:"0"}],selectedValue:"10"},{type:"boolean",question:"Would you order again?",options:[{text:"Yes, Definitely",value:true},{text:"Not so Great",value:false}],selectedValue:true},{type:"text",question:"Any comments?",selectedValue:""}];

    it('should return welcome template with heading', function () {
        const welcome = templates.getWelcomeTemplate();
        const html = new DOMParser().parseFromString(welcome, 'text/html');
        expect(html.querySelector('.nav')).toBeDefined();
        expect(html.querySelector('.nav')).toBeInstanceOf(HTMLHeadingElement);
        expect(html.querySelector('.welcome')).toBeDefined();
    });
    it('should fail on invalid question type for the question templates', function () {
        const question = {type: 'rating', question: ''};
        expect(function () {
            templates.getToggleTemplate(question);
        }).toThrow('Invalid question type');
        expect(function () {
            templates.getRadioTemplate(question);
        }).toThrow('Invalid question type');
        expect(function () {
            templates.getTextTemplate(question);
        }).toThrow('Invalid question type');
    });
    it('should return rating template with action button', function () {
        const template = templates.getToggleTemplate(questions[0]);
        const ratingTemplate = new DOMParser().parseFromString(template, 'text/html');
        expect(ratingTemplate.querySelector('.survey__answer--rating')).toBeInstanceOf(HTMLDivElement);
        expect(ratingTemplate.querySelector('.actions')).toBeDefined();
    });
    it('should return radio template with action button', function () {
        const template = templates.getRadioTemplate(questions[2]);
        const ratingTemplate = new DOMParser().parseFromString(template, 'text/html');
        expect(ratingTemplate.querySelector('.survey__answer--boolean')).toBeInstanceOf(HTMLDivElement);
        expect(ratingTemplate.querySelector('.actions')).toBeDefined();
    });
    it('should return comment template with action button', function () {
        const template = templates.getTextTemplate(questions[3]);
        const ratingTemplate = new DOMParser().parseFromString(template, 'text/html');
        expect(ratingTemplate.querySelector('.survey__answer--text')).toBeInstanceOf(HTMLDivElement);
        expect(ratingTemplate.querySelector('.actions')).toBeDefined();
    });
    it('should return thanks template with heading', function () {
        const welcome = templates.getThanksTemplate();
        const html = new DOMParser().parseFromString(welcome, 'text/html');
        expect(html.querySelector('.nav')).toBeDefined();
        expect(html.querySelector('.nav')).toBeInstanceOf(HTMLHeadingElement);
        expect(html.querySelector('.thanks')).toBeDefined();
    });
});
