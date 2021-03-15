import React, { Component} from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Recipe from "./recipe";
import Recipes from "./recipes";
import CreateRecipe from "./createRecipe";


/********************************************************************
*   Main App Component
* Contains navigation and routing to content
********************************************************************/ 
class App extends Component {
    render() {
        return (
            <div className="site">
                <main>
                    <div className="top">
                        <nav className="nav">
                            <NavLink className={"nav-link"} to={"/"}><div className="title">Savour It</div></NavLink>
                            <NavLink className={"nav-link"} to={"/recipes/"}>Recipes</NavLink>
                            <NavLink className={"nav-link"} to={"/create/"}>Add a Recipe</NavLink>
                            <NavLink className={"nav-link"} to={"/login/"}>Login</NavLink>
                            <NavLink className={"nav-link"} to={"/signup/"}>Signup</NavLink>
                        </nav>
                    </div>
                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route exact path={"/recipes/"} component={Recipes}/>
                        <Route exact path={"/create/"} component={CreateRecipe}/>
                        <Route path={"/recipes/"} component={Recipe}/>
                        <Route path={"/"} component={Recipes}/>
                   </Switch>
               </main>
            </div>
        );
    }
}

export default App;
