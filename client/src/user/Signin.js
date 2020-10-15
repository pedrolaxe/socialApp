import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from "../auth";
import '../css/Signin.css';
import Loading from '../loading/Loading';


class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = e => {
        this.setState({
            error: "",
            [e.target.name]: e.target.value
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = { email, password };
        //console.log(user.email.length);
        if(user.email && user.password){
            signin(user)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    // authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    });
                }
            });
        }  else {
            this.setState({
                loading: false,
                error: "Please double-check your email and password."
            });
        }
        
    };

    signinForm = (email, password, loading) => (
        <form style={{ display: loading ? "none" : "" }} className="form-signin" >
            <div className="form-label-group">
                <input
                    onChange={this.handleChange}
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                    placeholder="E-mail"
                />
                <label htmlFor="email">E-mail</label>
            </div>
            <div className="form-label-group">      
                <input
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    placeholder="Password"
                />
                <label htmlFor="password">Password</label>
            </div>
            
            <button onClick={this.clickSubmit} className="btn btn-lg btn-primary btn-block">Log In</button>
            <br />
            <Link to="/forgot-password">
                        {" "}
                    Forgot Password?
                </Link> 
        </form>
    )

    render() {

        const { email, password, error, redirectToReferer, loading} = this.state;
        if (redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
        
            <div className="container">
                <div className="row mb-3">
                    <div className="col-8 col-lg-8">IMAGE HERE</div>
                    <div className="col-4 col-lg-4">
                        <h2 className="mt-4 mb-4">Sign In</h2>
                        
                        {this.signinForm(email, password, loading)}

                        {loading ? (
                            <Loading />
                        ) : (
                                ""
                            )}
                        <p>
                            
                        </p>
                        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;