## monotony

lack of variety and interest; tedious repetition and routine. (which is how I feel everytime I make a new react webpack build).

 * babel
 * react
 * redux
 * thunk
 * express
 * webpack
 * server side rendering
 * chunking
 * dependancies

[React](https://reactjs.org) with [Redux](https://redux.js.org), ran by [Express](https://expressjs.com), multi-target built by [Webpack](https://webpack.js.org) with [Babel](https://babeljs.io), dependency solution for client and server-side rendering.

CSS modules, code splitting, hydration, other buzz words.

### why?

I prefer stitching together libraries to do what I need vs a framework, it's more fun. But alas, I put together my very opinionated "framework" to decouple my build and scoffolding to an external project to be re used.

Better documentation, linting, and other stuff, and cleanup, and I use this for personal.

Any feedback/recommendations is greatly appreciated.

### your documentation is super poor, spoon feed me the project setup...

K, clone [this repo](https://github.com/sethomas/monotony_usage), fish around, use it as yours, enjoy

### basic usage:

1. `npm install monotony --save`
2.  create files (these files are ran through babel, look at `/examples/` dir)
	* `monotony.config.js` return the `name`, `routes`, and `reducers`
	* `routes.js` that follows the [Route Configuration Shape](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#route-configuration-shape)
	* `monotony.client.js` import `Client`, pass in the config, and start er up
	* `monotony.server.js` import `Server`, pass in the config, attach anything you want to `app` (express)
3. `package.json`, add `start` and `build` scripts:
```
"start": "monotony start",
"build": "monotony build"
```
4. `npm run start` to spin up your local, hit localhost:9090 and profit