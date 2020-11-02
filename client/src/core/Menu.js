import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {
            color: "#ffffff"
        }
    } else {
        return { color: "#ffffff" }
    }
}

const Menu = (props) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
        style={{
            paddingBottom: "0",
            marginBottom: "100px"
        }}
    >
        <a className="navbar-brand" style={{ color: "white", fontFamily: 'Courgette, cursive' }} href="/">
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-camera" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{marginTop:"-5px",marginRight:"-5px"}}>
                <path fillRule="evenodd" d="M15 12V6a1 1 0 0 0-1-1h-1.172a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 9.173 3H6.828a1 1 0 0 0-.707.293l-.828.828A3 3 0 0 1 3.172 5H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path fillRule="evenodd" d="M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                <path d="M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
            </svg>&nbsp;
            SocialApp
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarSupportedContent" >
            <ul className="navbar-nav ml-auto">

                {!isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(props.history, "/signin")} to='/signin' >
                                <i className="fas fa-sign-in-alt mr-1"></i>Sign In
                        </Link>
                        </li>
                        {/* <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to='/signup' >
                            <i className="fas fa-user-plus mr-1"></i>Sign Up
                        </Link>
                    </li> */}


                    </>
                )}
                {isAuthenticated() && (

                    <>
                        <li className="nav-item ">
                            <Link className="nav-link" style={isActive(props.history, "/")} to='/' >
                                {/* <i className="fas fa-house-user fa-lg"></i> */} Home
                    </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to={'/findpeople'}
                                style={isActive(props.history, '/findpeople')}
                            >
                                Find{/* <i className="fas fa-users fa-lg"></i> */}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to={'/post/create'}
                                style={isActive(props.history, '/post/create')}
                            >
                                {/* <i className="fas fa-plus fa-lg"></i> */} New Post
                        </Link>
                        </li>

                        <div className="dropdown">

                            <button style={{ color: "#fff" }} className="btn dropdown-toggle dropdown-menu-left" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {/* <i className="fas fa-user-cog fa-lg"></i> */}
                                {/* {isAuthenticated().user.name} */}
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}`}
                                    width="32"
                                    height="32"
                                    alt=""
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            </button>
                            <div className="dropdown-menu menudrop" aria-labelledby="dropdownMenuButton">
                                <Link
                                    className="dropdown-item"
                                    to={`/user/${isAuthenticated().user._id}`}
                                >
                                    <i className="fas fa-user mr-1"></i>My Profile
                            </Link>
                                <Link
                                    className="dropdown-item"
                                    to={`/chats/${isAuthenticated().user._id}`}
                                >
                                    <i className="fas fa-comment-alt mr-1"></i>Messages
                            </Link>
                                <div className="dropdown-divider"></div>
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
