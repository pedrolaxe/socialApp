import React, { Component } from 'react';

import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import { isAuthenticated } from "../auth";

import Comment from './Comment';
import DefaultProfile from '../images/avatar.jpg'
import { timeDifference } from './timeDifference';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false,
            redirectToSignin: false,
            like: false,
            likes: 0,
            comments: [],
            loading: false
        }
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1; //true if user found
        return match;
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        post: data,
                        likes: data.likes.length,
                        like: this.checkLike(data.likes),
                        comments: data.comments
                    });
                }
            });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        this.setState({ loading: true })
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true, loading: false })
            return false; //so that rest of code isn't executed
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        like: !this.state.like,
                        likes: data.likes.length,
                        loading: false
                    });
                }
            });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ redirectToHome: true })
                }
            })
    }

    deleteConfirmed = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>Are you sure ?</h1>
                        <p>You want to delete this post.</p>
                        <button onClick={onClose}>No</button>
                        <button
                            className="backdanger"
                            onClick={() => {
                                this.deletePost()
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


    renderPost = (post) => {
        const posterId = post.postedBy ? post.postedBy._id : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes, redirectToSignin, redirectToHome, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to='/'></Redirect>
        } else if (redirectToSignin) {
            return <Redirect to='/signin'></Redirect>
        }
        return (
            <div className="card col-md-8 mb-5" style={{
                padding: "0",
                margin: "0 auto",
            }} >
                <div className="card-header">
                    <img
                        className="mb-1 mr-2"
                        style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                        onError={i => (i.target.src = DefaultProfile)}
                        alt={posterName}
                    />
                    <Link to={`/user/${posterId}`} style={{ fontSize: "24px" }}>
                        {posterName}
                    </Link>
                    <div
                        style={{ marginBottom: "0" }}
                        className="pull-right mt-2"
                    >

                        <span className="ml-2 pull-left">
                            <i className="far fa-clock"></i>{" " + timeDifference(new Date(), new Date(post.created))}
                        </span>
                        {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                            <>
                                <div className="d-flex text-muted pull-right ml-3">
                                    <div className="dropdown">
                                        <button className="btn p-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal icon-lg text-muted pb-3px">
                                                <circle cx="12" cy="12" r="1"></circle>
                                                <circle cx="19" cy="12" r="1"></circle>
                                                <circle cx="5" cy="12" r="1"></circle>
                                            </svg>
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <Link
                                                to={`/post/edit/${post._id}`}
                                                className="dropdown-item d-flex align-items-center">
                                                Edit Post
                                        </Link>
                                            <Link className="dropdown-item d-flex align-items-center" onClick={this.deleteConfirmed} to="#">
                                                Delete
                                        </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Link to={`/post/${post._id}`}>
                    <img
                        className="card-img-top"
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        alt={post.title}
                        style={{
                            maxHeight: "700px",
                            backgroundSize: "cover",
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: "50% 50%"
                        }}
                    />
                </Link>

                <div className="card-body">
                    <p className="mb-3 tx-14">{post.body}</p>
                </div>
                <div className="card-footer">
                    <div className="d-flex post-actions">
                        {like ? (
                            <h3>
                                <i onClick={this.likeToggle} className="fa fa-heart" style={{ color: "red", padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                            </h3>
                        ) : (
                                <h3>
                                    <i onClick={this.likeToggle} className="fa fa-heart-o" style={{ padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                                </h3>
                            )}

                        <p className="mt-3 mr-4 text-muted">
                            Likes ({likes})
                        </p>

                        <Link to="#" className="d-flex align-items-center text-muted mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square icon-md comment-btn">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <p className="d-none d-md-block mt-3 ml-2">Comment</p>
                        </Link>
                        <Link to="#" className="d-flex align-items-center text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share icon-md share-btn">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            <p className="d-none d-md-block mt-3 ml-2">Share</p>
                        </Link>

                    </div>

                    <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />

                </div>
            </div>
        );
    }

    render() {
        const { post, loading } = this.state;
        return (
            <div className="container">
                {(!post || loading) ? (
                    <Loading />
                ) : (
                        this.renderPost(post)
                    )}
            </div>
        );
    }
}

export default SinglePost;