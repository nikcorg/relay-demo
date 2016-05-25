import "babel-polyfill";

import Relay from "react-relay";
import React from "react";
import ReactDOM from "react-dom";

import useRelay from "react-router-relay";
// import applyRouterMiddleware from "react-router-apply-middleware";
import {
    hashHistory,
    Router,
    Route,
    IndexRoute,
    applyRouterMiddleware
} from "react-router";

import { viewerQuery, postQuery } from "./queries";

import App from "./components/App";
import Blog from "./components/Blog";
import Post from "./components/Post";
import PostList from "./components/PostList";

const ViewerQuery = { viewer: viewerQuery };
const PostQuery = { post: postQuery}

const routes = (
    <Route
        path="/"
        component={Blog}
        queries={ViewerQuery}
    >
        <IndexRoute
            component={PostList}
            queries={ViewerQuery}
        />
        <Route
            component={Post}
            path="/post/:postId"
            queries={PostQuery}
        />
    </Route>
);

ReactDOM.render(
    <Router
        history={hashHistory}
        render={applyRouterMiddleware(useRelay)}
        routes={routes}
        environment={Relay.Store}
    />,
    document.getElementById("root")
);
