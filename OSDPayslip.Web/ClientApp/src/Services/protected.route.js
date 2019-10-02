import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if(rest.isAuthenticated === true) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={{
                        pathname: "/"
                    }} />
                }
            }}
        />
    );
};