import React, { Component } from 'react';

import { findPeople, follow } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/index';

import Loading from '../loading/Loading';

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error: "",
            open: false,
            followMessage: "",
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ users: data, loading: false });
                }
            })
    }

    clickFollow = (user, i) => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`,
                        loading: false
                    })
                }
            })
    };

    renderUsers = (users) => (
        <div className="row">
            {users.map((user, i) => (
                <div className="col-md-3">
                    <div key={i} className="card" style={{ padding: "0", margin: "15px", border: "0px", boxShadow: "none" }} >
                        <img
                            style={{ borderRadius: "50%", border: "1px solid #f0f0f0" }}
                            width="200"
                            height="200"
                            className=""
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                            onError={i => (i.target.src = DefaultProfile)}
                            alt={user.name}
                        />
                        <div className="card-body text-center">
                            <h5 className="card-title">{user.name}</h5>
                        </div>
                        <div className="card-body text-center">
                            <Link
                                to={`/user/${user._id}`}
                                className="btn btn-primary btn-sm mr-2">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                                        <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                                    </svg>&nbsp;
                                Profile
                        </Link>
                            <button onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-info float-right btn-sm">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                </svg>&nbsp;
                            Follow
                        </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    );

    render() {
        const { users, open, followMessage, loading } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>
                {open && (
                    <div className="alert alert-success text-center">
                        {followMessage}
                    </div>
                )}
                {loading ? (
                    <Loading />
                ) : (
                        this.renderUsers(users)
                    )}
            </div>
        );
    }
}

export default FindPeople;