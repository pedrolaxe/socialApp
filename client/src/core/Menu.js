import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { borderBottom: "4px solid #ff9900", color: "white" }
    } else {
        return { color: "#ffffff" }
    }
}

const Menu = (props) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary"  
        style={{ 
            //background: "#007991", 
            //paddingTop: "15px",
            paddingBottom: "0",
            marginBottom: "50px"

        }}
    >
        <a className="navbar-brand" style={{ color: "white", fontFamily: 'Courgette, cursive' }} href="/">
            <i className="fas fa-camera-retro mr-2"></i>SocialApp
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarSupportedContent" >
        <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
                <Link className="nav-link" style={isActive(props.history, "/")} to='/' >
                <i className="fas fa-house-user fa-lg"></i>
                </Link>
            </li>
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signin")} to='/signin' >
                        <i className="fas fa-sign-in-alt mr-1"></i>Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to='/signup' >
                            <i className="fas fa-user-plus mr-1"></i>Sign Up
                        </Link>
                    </li>

                    
                </>
            )}
            {isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={'/findpeople'}
                            style={isActive(props.history, '/findpeople')}
                        >
                            <i className="fas fa-users fa-lg"></i>
                        </Link>
                    </li> 

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={'/post/create'}
                            style={isActive(props.history, '/post/create')}
                        >
                            <i className="fas fa-plus fa-lg"></i>
                        </Link>
                    </li>
                    
                    <div className="dropdown">
                        <button style={{color: "#fff"}} className="btn dropdown-toggle pull-right" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-user-cog fa-lg"></i> Configurações
                        {/* {`${isAuthenticated().user.name}'s profile`} */}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link 
                                className="dropdown-item" 
                                to={`/user/${isAuthenticated().user._id}`}
                            >
                                <i className="fas fa-user mr-1"></i>Your Profile
                            </Link>
                            <Link
                                className="dropdown-item"
                                to={`/chats/${isAuthenticated().user._id}`}
                            >
                                <i className="fas fa-comment-alt mr-1"></i>Chats
                            </Link>
                            <span
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() => signout(() => props.history.push('/'))}
                            >
                                <i className="fas fa-sign-out-alt mr-1"></i>Sign Out
                            </span>
                        </div>
                    </div>
                    
                </>
            )}
        </ul>
        </div>
    </nav> 

);

export default withRouter(Menu);
