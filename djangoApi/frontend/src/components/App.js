import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { Children, Component} from "react";
import { Switch, Route, NavLink, Redirect, useHistory, useLocation } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Recipe from "./recipe";
import Recipes from "./recipes";
import CreateRecipe from "./createRecipe";
import Logout from './logout';
import Api from '../axiosApi';
import LoginRedirect from "./login-redirect";



/********************************************************************
*   Main App Component
* Contains navigation and routing to content
********************************************************************/ 
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: Api.isAuthenticated,
            prevPath: '/'
        }
        this.onLogout = this.onLogout.bind(this);
        this.onLogin = this.onLogin.bind(this);
        Api.loginCallback = this.onLogin;
        Api.logoutCallback = this.onLogout;
    }

    /**
     * Logs out the user
     * returns html element indicating logout
     */
    onLogout() {
        this.setState({isLoggedIn: false});
        console.log('Logged out');
    }

    /**
     * Callback from the api to update state
     */
    onLogin() {
        this.setState({isLoggedIn: true});
    }    

    render() {
        return (
            <div className="site">
                <main>
                    <div className="top">
                        <nav className="nav">
                            <NavLink className={"nav-link"} to={"/"}><div className="title">Savour It</div></NavLink>
                            <NavLink className={"nav-link"} to={"/recipes/"}>Recipes</NavLink>
                            <NavLink className={"nav-link"} to={"/create/"}>Add a Recipe</NavLink>
                            {this.state.isLoggedIn && 
                                <NavLink className={"nav-link"} to={"/logout/"}>Logout</NavLink> ||
                                <NavLink className={"nav-link"} to={"/login/"}>Login</NavLink>}
                            <NavLink className={"nav-link"} to={"/signup/"}>Signup</NavLink>
                        </nav>
                    </div>
                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/login-redirect/"} component={LoginRedirect}/>
                        <Route exact path={"/logout/"} component={Logout}></Route>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route exact path={"/recipes/"} component={Recipes}/>
                        <PrivateRoute exact isLoggedIn={this.state.isLoggedIn} path={"/create/"} component={CreateRecipe}/>
                        <Route path={"/recipes/"} component={Recipe}/>
                        <Route path={"/"} component={Recipes}/>
                   </Switch>
               </main>
            </div>
        );
    }
}

const PrivateRoute = ({ isLoggedIn, ...props }) =>
  isLoggedIn
    ? <Route { ...props } />
    : <Redirect to={{
        pathname: "/login-redirect", 
        state: { from: useLocation().pathname } }} />


export default App;
