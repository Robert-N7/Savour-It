import React, { Component } from "react";
import Api from "../axiosApi";

/********************************************************************
*   Signup
* User Signup form
********************************************************************/ 
class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            email:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        Api.post('/user/create/', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then((response) => {
            return response;
        }).catch((e) => {
            console.log(e);
        })
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
                    <h2>Signup</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-item">
                            <input name="username" type="text" value={this.state.username} onChange={this.handleChange} placeholder="Display Name"/>
                        </div>
                        <div className="form-item">
                            <input name="email" type="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
                        </div>
                        <div className="form-item">
                            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
                        </div>
                        <div className="form-item">
                            <input className="submit_button" type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Signup;