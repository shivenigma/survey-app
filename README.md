# FreshFruits.

- App is deployed in Vercel
- You can check the app in this [url](https://survey-app-ecru.vercel.app/).
- Languages Used: HTML, CSS3, and Javascript
- Libraries Used: Jasmine, Karma and plugins. All are dev dependencies.
- Tested in: Brave browser, Firefox, and Brave on Redmi note 8 pro.

### Validation
- I ignored adding any input validation rule because there is only one text box. It felt unusual to add validation to a survey comment field. That is better to be optional. Other fields have default value and need not to be validated.

### On Refresh
- When the user refreshes the page, the requirement said to redirect to the previous question. But I chose to keep them in the same screen they were and to just restore the saved state.

- Using a router, it is easier to load the current page on reload than redirecting them to the prev screen.

### Submitting to a real endpoint.
- I did not mock or send the data to a real endpoint because that is not going to be validated or looked into anyway.

### Browser Support
- App only works in browsers which have full support for ES6 modules and features. It is not hard to include babel and a build process to enable support for older browsers. But I purposefully made the choice of supporting only modern browsers because this is not a prod app.

### Router quirks
- The router added in this works well for the use cases of this app. But it might fail in multiple edge cases such as
    - partially matching routes
    - additional parameters
    - query string
    - 404 routes
    
- These needs to be handled in a prod based app. But I will go with a router library for prod apps instead of rolling out my own (unless we can afford the time and resource to develop and test it well).
#### Why not the History API?
- Ideally, the router should use the modern History API with a fallback support of hash based routing. But for the history API to work, we need to make a server configuration. The server should redirect all the calls to index.html. That's not possible with Vercel. So I ignored building History API support. It should be easier to add support to it and to use it based on feature detection.

### Unit testing.
- Unit tests are written using jasmine and karma is used as the test runner.
- Tests can be ran using Chrome and Headless Chrome (Plugins added in package.json).
- To run unit tests, clone the repo and run the following commands.
```bash
npm install
npx karma start
```
- I tried writing unit tests for the app.js (glue code) as well. But it wasn't easy to test it along with the rest of the scripts being modules. It might be possible with a specRunner.html approach or some other way. I ignored following on that for saving time.

### Trade-offs

Everything is a trade-off might sound cliche, but it is true. In this app the trade-offs are between simplicity, shorter feedback loop, performance, browser support, dev-time.

There are some places where I've cut corners because But for the scope and use of this app, they are overkill. I might make a different choice on these things if this application is going to be used in a prod environment.

- Ignored a build process to be able to develop quickly. I work in a large Angular app and builds take a lot of time, I like to keep off them unless we really need them.
- Ignored code minification because this is not a real app and automating it would need a build process.
- Ignored supporting older browsers because that pushes us to either write code in ES5 or use a build process with babel.
- The media queries I wrote for this app is very minimal. For the simple content we have, this was enough. So I did not attempt to write more breakpoints.
- Left out edge cases in the router because getting them right will take a lot of time. I started using the router as soon as it became good enough to support the use case of this app. since it is a module, it is easier to improve or replace it with a better plugin.
