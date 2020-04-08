import "./App.css";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "./error-boundary";
import React from "react";
import routes from "./routes/routes";

/**
 * App render function
 * @returns {JSX} rendered component
 */
function App() {
    const routesMarkup = routes.map((route) => {
        return <Route key={route.path} {...route} />;
    });
    return (
        <div className="App d-flex">
            <ErrorBoundary>
                <Switch>
                    {routesMarkup}
                </Switch>
            </ErrorBoundary>
        </div>
    );
}

export default App;
