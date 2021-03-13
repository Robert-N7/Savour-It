/********************************************************************
*   Main App Component
* Contains navigation and routing to content
********************************************************************/ 

import React, { Component} from "react";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Recipe from "./recipe";

class App extends Component {
    render() {
        return (
            <div className="site">
                <main>
                    <nav>
                        <Link className={"nav-link"} to={"/"}>Home</Link>
                        <Link className={"nav-link"} to={"/login/"}>Login</Link>
                        <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                    </nav>
                    <h1 className="title">Savour It</h1>
                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route path={"/recipes/"} component={Recipe}/>
                        {/* <Route path={"/"} render={() => <div>Home again</div>}/> */}
                   </Switch>
               </main>
            </div>
        );
    }
}

export default App;
