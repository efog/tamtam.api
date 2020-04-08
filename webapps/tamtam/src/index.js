import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { applyMiddleware, createStore } from "redux";
import { Client } from "./routes";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import reducers from "./store/reducers";
import reduxThunk from "redux-thunk";
import store from "./store";

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

let appStore = store;
let preloadedState = null;
if (renderMethod === ReactDOM.hydrate) {
    // Grab the state from a global variable injected into the server-generated HTML
    preloadedState = window.__PRELOADED_STATE__;

    // Allow the passed state to be garbage-collected
    delete window.__PRELOADED_STATE__;

    // Create Redux store with initial state
    appStore = createStore(reducers, preloadedState, applyMiddleware(reduxThunk));
}


ReactDOM.render(<Provider store={appStore}>
    <Client></Client>
</Provider>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
