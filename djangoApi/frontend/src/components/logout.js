import React, { Component } from 'react';
import Api from '../axiosApi'

class Logout extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() { Api.logout()}

    render() {
        return <h2>You have been logged out.</h2>
    }
}
export default Logout;

