import React, { Component, useEffect } from 'react';

class LoginRedirect extends Component {
    constructor(props) {
        super(props);
        this.redirectToLogin = this.redirectToLogin.bind(this);
        try {
            this.from = props.location.state.from;
        } catch {
            this.redirectToLogin()
        }
    }

    redirectToLogin() {
        this.props.history.push({pathname: '/login', state: {from: this.from}});
    }

    render() {
        return (
            <div>
                <p>You must log in to view the page at {this.from}</p>
                <button onClick={this.redirectToLogin}>Log in</button>
            </div>
            );    
    }
}

export default LoginRedirect;

