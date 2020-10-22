import React, { Component } from 'react';
import { signup } from "../auth";
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import '../css/Signin.css';

class Signup extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            loading: false
        }
    }

    
    handleChange = e => {
        this.setState({
            error: "",
            open: false,
            [e.target.name]: e.target.value
        });
    };


    clickSubmit = e => {
        e.preventDefault();
        this.setState({loading: true})
        const { name, email, password } = this.state;
        const user = { name, email, password };
        // console.log(user);
        if(user.email && user.password){
            signup(user)
            .then(data => {
                if(data.error){
                    this.setState({error: data.error, loading: false});
                } else {
                    this.setState({
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        open: true,
                        loading: false
                    });
                }
            });
        } else {
            this.setState({
                loading: false,
                error: "Please double-check your email and password."
            });
        }
        
    };


    signupForm = (name, email, password, loading) => (
        <form style={{ display: loading ? "none" : "" }} className="form-signin">
            <div className="form-label-group">
                <input 
                    onChange={this.handleChange} 
                    name="name" 
                    type="text" 
                    className="form-control" 
                    value={name}
                    placeholder="Name"
                />
                 <label htmlFor="name">Name</label>
            </div>
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
           
            <button onClick={this.clickSubmit} className="btn btn-lg btn-primary btn-block">Sign Up</button>
            
        </form>
    );


    render(){
        const { name, email, password, error, open, loading} = this.state;
        return (
            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-8">
                            <img src="https://i.imgur.com/926vnAO.jpg" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-4">
                        <h2 className="mt-5 mb-5">Sign Up</h2>
                        
                        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                            {error}
                        </div>
                        <div className="alert alert-info" style={{ display: open ? "" : "none" }}>
                            New account is successfully created. Please <Link to='/signin'>Sign In</Link>.
                        </div>
                        {this.signupForm(name, email, password, loading)}
                        { loading ? (
                            <Loading />
                        ) : (
                            ""
                        )}
                       
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;