import React from "react";
import {Route, IndexRoute} from "react-router";
import App from "./components/App" ;
import AppController from "./components/controller/AppController";
import IndexComponent from "./components/views/home/Home";

export default(
<Route path="/" components={App}>
	<IndexRoute components={IndexComponent} />
	<Route path="/indicator/:heirarchy_level/:category/:record" component={AppController}  panelName = {"indicator"} />
</Route>
);
