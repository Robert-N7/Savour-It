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
            email:"",
            errMessage:null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    createUser() {
        if(this.state.password.length < 8)
            this.setState({errMessage: "Password must be at least 8 characters long"});

        return Api.createUser({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then((response) => {
            this.props.history.push('/');
            return response;
        }).catch((e) => {
            if(e.response.status === 409)
                this.setState({errMessage: 'Duplicate username: ' + this.state.username});
            else
                this.setState({errMessage: "Failed to sign up! "});
            return e;
        })

    }

    handleSubmit(event) {
        event.preventDefault();
        this.createUser();
    }

    render() {
        return (
            <div className="centered">
                <div className="form">
                    {this.state.errMessage && <div className='err'>{this.state.errMessage}</div>}
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