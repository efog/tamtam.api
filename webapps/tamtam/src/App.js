import "./App.scss";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "./error-boundary";
import Header from "./components/header";
import React from "react";
import routes from "./routes/routes";
import tokenManager from "./services/token-manager";

class App extends React.Component {
    render() {
        const routesMarkup = routes.map((route) => {
            return <Route key={route.path} {...route} />;
        });
        
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
}
export default tokenManager.withIdentity(App);
