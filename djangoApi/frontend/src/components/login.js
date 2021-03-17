
import React, { Component } from "react";
import Api from "../axiosApi";


/********************************************************************
*   Login
* User login form
********************************************************************/ 
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: "", errMessage: null};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        try {
            this.from = props.location.state.from;
        } catch {
            this.from = '/'
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * Login handler
     * @param {*} onSuccess 
     * @param {*} onError 
     */
    login(onSuccess=null, onError=null) {
        return Api.login({username: this.state.username, password: this.state.password}, (response) => 
        {
            this.props.history.push(this.from);
            if(onSuccess)
                onSuccess(response);
        }, (err) => {
            this.setState({errMessage: 'Invalid username or password'});
            if(onError)
                onError(err);
        });
    }

    /**
     * Event handler for submit
     * @param {event} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        return this.login();
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
                    {this.state.errMessage && <div className='err'>{this.state.errMessage}</div>}
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-item">
                            <input name="username" type="text" value={this.state.username} onChange={this.handleChange} placeholder="Username"/>
                        </div>
                        <div className="form-item">
                            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
                        </div>
                        <div className="form-item">
                            <input className="submit_button" type="submit" value="Login"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Login;