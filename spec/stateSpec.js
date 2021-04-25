import {State} from "../modules/state.js";

const json = {
    json: ()=> {
        return JSON.parse('{"questions":[{"type":"rating","question":"How do you rate the delivery experience?","options":[{"text":"Great","value":"10"},{"text":"Not so Great","value":"5"},{"text":"Awful","value":"0"}]},{"type":"rating","question":"How do you rate the Freshness of the fruits?","options":[{"text":"Great","value":"10"},{"text":"Not so Great","value":"5"},{"text":"Awful","value":"0"}]},{"type":"boolean","question":"Would you order again?","options":[{"text":"Yes, Definitely","value":true},{"text":"Not so Great","value":false}]},{"type":"text","question":"Any comments?"}]}');
    }
};

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
describe('state management constructor operations with mock', function () {
    beforeEach(function () {
        jasmine.addMatchers(customMatchers);
        this.getState = spyOn(State.prototype, 'getState').and.returnValue(false);
        this.getSurveyData = spyOn(State.prototype, 'getSurveyData').and.callThrough();
        this.getJSONData = spyOn(State.prototype, 'getJSONData').and.resolveTo(json);
        this.getStorage = spyOn(State.prototype, 'getPersistedState').and.returnValue(json.json);
        this.setStorage = spyOn(State.prototype, 'persistState').and.callFake(() => {});
    });
    afterEach(function () {
        this.getState = null;
        this.getSurveyData = null;
        this.getJSONData = null;
    });
    it('should load state data from JSON if state is not defined', function () {
        const state = new State();
        expect(this.getState).toHaveBeenCalled();
        expect(this.getSurveyData).toHaveBeenCalled();
    });
    it('should not load state from JSON if state is not empty', function () {
        this.getState.and.returnValue({hello: 'hello'});
        const state = new State();
        expect(this.getState).toHaveBeenCalled();
        expect(this.getSurveyData).not.toHaveBeenCalled();
    });
    it('should format and add required state data in the JSON data', function (done) {
        const state = new State();
       state.getSurveyData();
        setTimeout(function () {
            expect(state.state.questions.length).toBeGreaterThan(0);
            expect(state.state.questions).toBeValidState();
            done();
        }, 200);
    });
    it('should not call localStorage when the state is available', function (done) {
        const state = new State();
        expect(this.getSurveyData).toHaveBeenCalled();
        setTimeout( () => {
            // allow the spy to call through to test the real method
            this.getState.and.callThrough();
            const data = state.getState();
            // State is already available because we initialised the data with calling real getSurveyMethod with fake data in the beforeEach. Creating new State will load default data by default.
            expect(this.getStorage).not.toHaveBeenCalled();
            expect(data).toBeDefined();
            done();
        }, 200);
    });
    it('should call localStorage when the state is available', function (done) {
        const state = new State();
        setTimeout( () => {
            // allow the spy to call through to test the real method
            this.getState.and.callThrough();
            state.state = null;
            state.getState();
            expect(this.getStorage).toHaveBeenCalled();
            done();
        }, 200);
    });
    it('should update the selected data and persist the new state', function (done) {
        this.getState.and.callThrough();
        const state = new State();
        const setStateSpy = spyOn(state, 'setState').and.callThrough();
        state.getSurveyData();
        setTimeout(() => {
            // testing for normal data
            const index = 0;
            state.updateValueAndState(10, index);
            expect(this.getState).toHaveBeenCalled();
            expect(setStateSpy).toHaveBeenCalled();
            expect(state.state.questions[index].selectedValue).toBe(10);
            expect(this.setStorage).toHaveBeenCalled();
            done();
        }, 200);
    });
    it('should update the boolean data and persist the new state', function (done) {
        this.getState.and.callThrough();
        const state = new State();
        const updateSpy = spyOn(state, 'updateValueAndState').and.callThrough();
        state.getSurveyData();
        setTimeout(() => {
            // testing for normal data
            const index = 0;
            state.updateBooleanValueAndState('true', index);
            expect(updateSpy).toHaveBeenCalled();
            expect(state.state.questions[index].selectedValue).toBeTrue();

            state.updateBooleanValueAndState('false', index);
            expect(state.state.questions[index].selectedValue).toBeFalse();

            // testing wrong input, should set it unaltered
            state.updateBooleanValueAndState('hello', index);
            expect(state.state.questions[index].selectedValue).toBe('hello');
            done();
        }, 200);
    });
});
