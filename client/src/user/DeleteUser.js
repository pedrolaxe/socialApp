import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { remove } from './apiUser';
import { signout } from '../auth/index';
import { Redirect } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../css/Modal.css'

class DeleteUser extends Component {

    state = {
        redirect: false
    }

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                signout(() => console.log("User is deleted"));
                this.setState({redirect: true});
            }
        });
    };

    deleteConfirmed = () => {
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure ?</h1>
                    <p>You want to delete this account.</p>
                    <button onClick={onClose}>No</button>
                    <button
                      className="backdanger"
                      onClick={() => {
                        this.deleteAccount()
                        onClose();
                      }}
                    >
                      Yes, Delete it!
                    </button>
                  </div>
                );
              }
        });
    }

    render() {
        if(this.state.redirect){
            return <Redirect to='/'></Redirect>
        }
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-danger btn-sm">
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;