class Router {
    routes = [];
    interval = null;
    add(route, callback) {
        if (typeof callback !== 'function') {
            throw 'Callback should be a function';
        }
        this.routes.push({route, callback});
        // can probably return this here to enable method chaining to add multiple routes easily, or we can accept an array of routes as argument for this function.
    }
    getRouteFragment() {
        /**
         * Ideally I would be using the History API in JS, but for history API to work properly we need to redirect all requests to index.html in server configuration, ex., .htaccess for Apache.
         *
         * I'm not sure about where this will be hosted. So for now, using the hash based approach that works without any server dependency.
         */
        const hash = this.getHash().replace('#', '');
        return this.clearSlashes(hash);
    }
    // makes mocking location properties easier without any hacks
    getHash() {
        return location.hash;
    }

    clearSlashes (path) {
        // to remove slash from beginning and end of the given string. Used to remove slashed from the URL fragment.
        return path.toString().replace(/^\/|\/$/g, '');
    }

    /*I noticed that this router might fail in some cases where the string have partial match like /hello and /helloworld. Both will match hello fragment. It is not a problem for this app, but could be part of a larger implementation problem. Should think of a different solution.*/
    check(fragment) {
        for(let i=0; i < this.routes.length; i++) {
            /*This method is to collect the parameters name from the route definition and later assign the values to them and pass to the callback*/
            const variableNames = [];
            /**
             * We are using the string replace function to extract the name of the dynamic parameter from the given URL string.
             * Let's see this with an example. The given URL is /question/:id.
             *
             * The Regexp /([:*])(\w+)/g matches the : character and captures everything that comes after that. Notice that there are two capture groups () in the regexp. The first is the : character and the second is the actual param name after the colon.
             *
             * The first argument of the replace callback will be the match, it quals to :id in this case.
             * The second to nth parameters of the callback is the captured groups, in our case there will be 2 capture groups.
             * The second and third param will be captured valus from the given string : and id respectively.
             *
             * We are only interested in getting the name of the parameter which is second matching group, a.k.a 3rd param to the function.
             * There are optional last two arguments which were ignored here as unused.
             */
            const route = this.routes[i].route.replace(/([:*])(\w+)/g, function (match, firstMatchingGroup, extractedName) {
                // saving the variable names for later use.
                variableNames.push(extractedName);
                // This below is a regexp, being returned as a string. This will match any non slash characters. The idea is to replace the dynamic param name with this regexp which can be used in the next match validation with the current fragment.
                return '([^\\/]+)';
            });
            const regexp = new RegExp(route);
            // Now the route variable here will have a regex string that will match with the route fragment with dynamic param.
            const match = fragment.match(regexp);
            if(match) {
                const params = {};
                match.slice(1, match.length)
                    .reduce((accumulator = {}, value, index) => {
                        // use the previously collected variable names from the route.
                        accumulator[variableNames[index]] = value;
                    }, params);
                // appyling the callback with the params we got
                this.routes[i].callback.apply({}, [params]);
                // important to return after the first match, I noticed that the default route "" matches for all regex. Need to figure a way to stop that.
                return;
            }
        }
    }
    listen() {
        /*This could've been handled better if we control the server and able to use the History API.
        History API will fire events that we can subscribe to instead of constantly polling like this.*/
        let current;
        const watch = () => {
            console.log('here 1');
            if(current !== this.getRouteFragment()) {
                console.log('here2');
                current = this.getRouteFragment();
                this.check(current);
                console.log('here3');
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(watch, 100);
    }
    navigate(path = '') {
        path = path ? path : '';
        window.location.hash = path;
    }
    cleanUp() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.routes = [];
    }
}
export {Router};
