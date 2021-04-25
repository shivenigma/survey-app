class State {
    state = null;
    inProgress;
    constructor() {
        this.init();
    }
    getProgressState() {
        return this.inProgress;
    }
    setProgressState(state) {
        this.inProgress = state;
    }
    init() {
        if(!this.getState()) {
            this.getSurveyData();
        }
    }
    getSurveyData() {
        this.getJSONData()
            .then(response => response.json(), error => {
                //handle the error here, redirect to a error screen or a toast maybe.
            })
            .then(data => {
                data.questions.map(item => {
                    if (item.type === 'rating' || item.type === 'boolean'){
                        item.selectedValue = item.options[0].value;
                    } else {
                        item.selectedValue = '';
                    }
                    return item;
                });
                this.setState(data);
            });
    }

    getJSONData() {
        // I moved this to its own function to avoid having to mock fetch. We can mock fetch using some polyfills for fetch and with jasmine-ajax plugin. But It is a lot of boilerplate work to be done for only one fetch call. So I decided to mock this function instead in tests and leave this getJSONData out from being tested.
        return fetch('assets/payload.json');
    }

    getState() {
        if (!this.state) {
            this.state = this.getPersistedState();
        }
        return this.state;
    }
    setState(state) {
        this.state = state;
        this.persistState(state);
    }
    getPersistedState() {
        return JSON.parse(localStorage.getItem('savedState'));
    }
    persistState(state) {
        localStorage.setItem('savedState', JSON.stringify(state));
    }

    flush() {
        this.setState(null);
        this.setProgressState(null);
        localStorage.removeItem('savedState');
    }
    updateValueAndState(value, index){
        const state = this.getState();
        state.questions[index].selectedValue = value;
        this.setState(state);
    }
    updateBooleanValueAndState(value, index) {
        /*This conversion is ugly but there is no way to get true or false as an actual boolean from HTML attributes. They are considered and returned as strings from HTML. I used a adapter method for the conversion and passing the data into the regular data handling for boolean type template.*/
        let bool = value;
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true"){
                bool = true;
            }
            if (value.toLowerCase() === "false") {
                bool = false;
            }
        }
        this.updateValueAndState(bool, index);
    }
}
export {State}
