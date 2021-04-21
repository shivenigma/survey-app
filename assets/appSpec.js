describe("FreshFruits test", function (){
    beforeEach(function (){
        //const replaceWithInlineSVG = spyOn(window, 'replaceWithInlineSVG').and.callThrough();
        const container = document.createElement('div');
        container.classList.add('container');
        document.body.appendChild(container);
    })
    afterEach(function (){
       const container = document.querySelector('.container');
       container.remove();
       /* Resetting this default is important, if we want to run the unit tests in random order.
       Running tests in the same order as they were written is the easiest way to have false positives. Some tests might leave residual that might affect the tests running after that.
       Even dangerous, some tests were passed only because of the residue from previous tests and in real use case it might fail. */
        appState = {
             currentStep: -1,
             data: [],
         };
    });
    it('should have default state set', function (){
       expect(appState).toBeDefined();
       expect(appState.data.length).toBe(0);
       expect(appState.currentStep).toBe(-1);
    });

    it('should load welcome page if no saved state', function () {
        const getState = spyOn(window, 'getState').and.callFake(function () {
            return null;
        });
        init();
        expect(getState).toHaveBeenCalled();
        expect(container.querySelector('.welcome')).toBeTruthy();
    });
    it('should call route handler if there is saved state', function () {
        const getState = spyOn(window, 'getState').and.callFake(function () {
            return '{"currentStep":0,"data":[{"type":"rating","question":"How do you rate the delivery experience?","options":[{"text":"Great","value":"10"},{"text":"Not so Great","value":"5"},{"text":"Awful","value":"0"}],"selectedValue":"10"},{"type":"rating","question":"How do you rate the Freshness of the fruits?","options":[{"text":"Great","value":"10"},{"text":"Not so Great","value":"5"},{"text":"Awful","value":"0"}],"selectedValue":"10"},{"type":"boolean","question":"Would you order again?","options":[{"text":"Yes, Definitely","value":true},{"text":"Not so Great","value":false}],"selectedValue":true},{"type":"text","question":"Any comments?","selectedValue":""}]}';
        });
        const handleRoutingChange = spyOn(window, 'handleRoutingChange');
        init();
        expect(handleRoutingChange).toHaveBeenCalled();
        expect(appState.currentStep).toBe(0);
    });
});
describe("Freshfruits async test", function () {
    beforeEach(function (){
        jasmine.addMatchers(customMatchers);
        const replaceWithInlineSVG = spyOn(window, 'replaceWithInlineSVG').and.callThrough();
    });
    afterEach(function (){
        appState = {
            currentStep: -1,
            data: [],
        };
    });
    it('should get remote data and add default values', function (done) {
        const getSurveyData = spyOn(window, 'getSurveyData').and.callThrough();
        const next = spyOn(window, 'next');
        getSurveyData();
        setTimeout(function () {
            expect(appState.data.length).toBeGreaterThan(0);
            expect(appState.data).toBeValidState();
            done();
        }, 4000);
    });
});
const customMatchers = {
    toBeValidState: function () {
        return {
            compare(actual, expected = null) {
                const result = {
                    pass: true,
                    message: 'Valid State',
                };
                /* This is just to show how custom matchers can be used in jasmine to validate some complex logic, and check if it is there after an action. Here we need the selectedValue property set on the questions for the default value, so checking if the state is valid */
                result.pass = actual.every(item => item.hasOwnProperty('selectedValue'));
                if(!result.pass) {
                    result.message = 'Invalid state';
                }
                return result;
            }
        }
    }
}
