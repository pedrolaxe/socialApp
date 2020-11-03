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
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-camera" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "-5px", marginRight: "-5px" }}>
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
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" style={{ marginRight: "2px" }} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                    <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                </svg>&nbsp;Sign In
                        </Link>
                        </li>
                        {/* <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to='/signup' >
                           Sign Up
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
                                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                                        <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                                    </svg>&nbsp;
                                    My Profile
                            </Link>
                                <Link
                                    className="dropdown-item"
                                    to={`/chats/${isAuthenticated().user._id}`}
                                >
                                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-chat-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                                        <path fillRule="evenodd" d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                                    </svg>&nbsp;
                                    Messages
                            </Link>
                                <div className="dropdown-divider"></div>
                                <span
                                    className="dropdown-item"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => signout(() => props.history.push('/'))}
                                >
                                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-box-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                    </svg>&nbsp;
                                    Sign Out
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
