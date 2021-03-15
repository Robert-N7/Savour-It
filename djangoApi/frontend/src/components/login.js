
import React, { Component } from "react";
import Api from "../axiosApi";


/********************************************************************
*   Login
* User login form
********************************************************************/ 
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * Event handler for submit
     * @param {event} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        try {
            const response = Api.post('/token/obtain/', {
                username: this.state.username,
                password: this.state.password
            }).then((response) => {
                Api.defaults.headers['Authorization'] = "JWT " + response.data.access;
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            })
        } catch (error) {
            throw error;
        }    
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
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