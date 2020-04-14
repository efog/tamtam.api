import "./App.scss";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "./error-boundary";
import Header from "./components/header";
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
    console.log(routesMarkup);
    return (
        <div className="">
            <ErrorBoundary>
                <Header></Header>
                <Switch>
                    {routesMarkup}
                </Switch>
            </ErrorBoundary>
        </div>
    );
}

export default App;
