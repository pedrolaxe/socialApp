import React, { Component } from "react";
import { forgotPassword } from "../auth";

class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    forgotPasswordFunction = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };

    render() {
        const { message, error } = this.state;
        return (
            <div className="container">
                <div className="row mb-3">
                <div className="col-md-8">
                        <img src="https://i.imgur.com/926vnAO.jpg" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-4">

                        <h2 className="mt-5 mb-5">Ask for Password Reset</h2>

                        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                            {error}
                        </div>
                        <div className="alert alert-danger" style={{ display: message ? "" : "none" }}>
                            {message}
                        </div>
                    
                        <form>
                            <div className="form-group mt-5">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Your email address"
                                    value={this.state.email}
                                    name="email"
                                    onChange={e =>
                                        this.setState({
                                            email: e.target.value,
                                            message: "",
                                            error: ""
                                        })
                                    }
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={this.forgotPasswordFunction}
                                className="btn btn-raised btn-primary"
                            >
                                Send Link to Reset
                            </button>
                        </form>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default ForgotPassword;