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
        fetch('assets/payload.json')
            .then(response => response.json())
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
    getState() {
        if (!this.state) {
            this.state = JSON.parse(localStorage.getItem('savedState'));
        }
        return this.state;
    }
    setState(state) {
        this.state = state;
        localStorage.setItem('savedState', JSON.stringify(this.state));
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
