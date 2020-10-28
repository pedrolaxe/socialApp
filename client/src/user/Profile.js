import React, { Component } from 'react';

import { isAuthenticated } from "../auth";
import { Redirect, Link } from 'react-router-dom';
import { read } from "./apiUser";
import DefaultProfile from '../images/avatar.jpg';
import FollowProfileButton from './FollowProfileButton';
import { listByUser } from '../post/apiPost';
import '../css/ProfileUser.css';

import { Tabs, Tab } from 'react-bootstrap-tabs';

import Loading from '../loading/Loading';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            // user: "",
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: [],
            loading: false
        }
    }

    // check follow
    checkFollow = (user) => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }


    clickFollowButton = callApi => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {

                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following, loading: false })
                }
            })
    }

    // profileUnfollow = (unfollowId) => {
    //     const userId = isAuthenticated().user._id;
    //     const token = isAuthenticated().token;
    //     unfollow(userId, token, unfollowId)
    //     .then(data => {
    //         if (data.error) {
    //             this.setState({ error: data.error })
    //         } else {
    //             this.setState({ user: data })
    //         }
    //     })
    // }

    // unfollowClick = (e) => {
    //     const unfollowId = e.target.getAttribute("data-index");
    //     this.profileUnfollow(unfollowId);
    // }

    init = (userId) => {
        this.setState({ loading: true })
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    this.loadPosts(data._id);
                }
            });
    };

    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data, loading: false });
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    renderProfile = () => {
        const { user, following, posts } = this.state;
        //console.log("USer: ", user)
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;
        let followingBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-primary">{user.following.length}</span> Following</p>
        let followersBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-primary">{user.followers.length}</span> Followers</p>
        let postsBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-primary">{posts.length}</span> Posts</p>
        return <div className="container">
            <div className="profile-page tx-13">
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="profile-header">
                            <div className="cover">

                                <div className="cover-body d-flex justify-content-between align-items-center">
                                    <img
                                    src={photoUrl} 
                                    alt={user.name} 
                                    onError={i => (i.target.src = DefaultProfile)} 
                                    className="profile-pic mt-4 ml-4 mb-4 img-circle img-thumbnail" 
                                    />
                                    <span className="profile-name">{user.name}</span>

                                    <div className="d-none d-md-block mr-5">
                                    <div className="dropdown">
                                            <button className="btn p-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal icon-lg text-muted pb-3px">
                                                    <circle cx="12" cy="12" r="1"></circle>
                                                    <circle cx="19" cy="12" r="1"></circle>
                                                    <circle cx="5" cy="12" r="1"></circle>
                                                </svg>
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item d-flex align-items-center" href="#">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 icon-sm mr-2">
                                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                    </svg> <span className="">Edit Profile</span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>

            <div className="row profile-body">

                <div className="col-md-4 col-xl-3">
                    <div className="card rounded">
                        <div className="card-body">
                            <ul className="nav flex-column">
                                
                                {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                                <>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link"
                                        to={`/post/create`}
                                    >
                                    Create Post
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link 
                                        className="nav-link"
                                        to={`/user/edit/${user._id}`}
                                    >
                                    Edit Profile
                                    </Link>
                                </li>
                                
                               
                                </>
                                ): (
                                    <>
                                        <li className="nav-item">
                                            <Link 
                                                className="nav-link"
                                                to={`/chat/${isAuthenticated().user._id}/${user._id}`}
                                                >
                                                Message
                                                </Link>
                                        </li>
                                        <li className="nav-item">
                                            <FollowProfileButton following={following} onButtonClick={this.clickFollowButton} />
                                        </li> 
                                    </>                                          
                                    )}
                            </ul>
                            <br />
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h6 className="card-title font-weight-bold mb-0">About</h6>
                            </div>
                            <p>{user.about}</p>
                            <div className="mt-3">
                                <label className="tx-11 font-weight-bold mb-0">Username:</label>
                                <p>{user.username}</p>
                            </div>
                            <div className="mt-3">
                                <label className="tx-11 font-weight-bold mb-0">Followers:</label>&nbsp;&nbsp;
                                <span className="badge badge-pill badge-primary">{user.followers.length}</span>
                            </div>
                            <div className="mt-3">
                                <label className="tx-11 font-weight-bold mb-0">Following:</label>&nbsp;&nbsp;
                                <span className="badge badge-pill badge-primary">{user.following.length}</span>
                             </div>
                            {/* <div className="mt-3">
                                <label className="tx-11 font-weight-bold mb-0">Posts:</label>&nbsp;&nbsp;
                                <span className="badge badge-pill badge-primary">{posts.length}</span>
                            </div> */}
                           
                        </div>
                    </div>
                </div>
            
                <div className="col-md-8 col-xl-8">
                    <div className="row">

                        <div className="col-md-12">
                        <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                            <Tab label={postsBadge} className="tab-title-name">
                                <div className="row">
                                {posts.map((post, i) => (
                                    <div key={i} style={{ paddingBottom: "15px" }} className="col-md-4">
                                        <Link to={`/post/${post._id}`} >
                                            <figure className="styleimgs red">
                                                <img 
                                                    style={{ objectFit: "cover", padding: "0" }}
                                                    height="200"
                                                    width="200"
                                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                                    alt={post.title} 
                                                />
                                                <i className="fas fa-heart">
                                                    <br />
                                                    <span style={{ color: "white", fontSize: "20px" }} >{post.likes.length}</span>
                                                </i>
                                            </figure>
                                        </Link>
                                    </div>
                                ))}
                                </div>
                            </Tab>
                            <Tab label={followersBadge}  className="tab-title-name">
                                {user.followers.map((person, i) => (
                                
                                    <div key={i} className="media user-follower">
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name} 
                                            className="media-object pull-left mr-2" 
                                        />
                                        <div className="media-body">
                                            <Link to={`/user/${person._id}`} >
                                                {person.name}
                                                </Link><br /><span className="text-muted username">@{person.name}</span>
                                            {/* <button type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Following</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>

                            <Tab label={followingBadge} className="tab-title-name">
                                {user.following.map((person, i) => (
                                    <div key={i} className="media user-following">
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name} 
                                            className="media-object pull-left mr-2" 
                                        />
                                        <div className="media-body">
                                            <Link to={`/user/${person._id}`} >
                                                { person.name }</Link>
                                                <br /><span className="text-muted username">@{person.name}</span>
                                            
                                            {/* <button data-index = {person._id} onClick={this.unfollowClick} type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Unfollow</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>
                        </Tabs>
                        </div>
                    </div>
                </div>
            </div>{/* </div> Profile body */}
        </div>
    }

    render() {
        const { redirectToSignin, user, loading } = this.state;
        console.log("state user", user);
        if (redirectToSignin) {
            return <Redirect to='/signin' />
        }


        return (
            <>
                {loading ? (
                    <Loading />
                ) : (
                        this.renderProfile()
                    )}
            </>
        );
    }
}

export default Profile;