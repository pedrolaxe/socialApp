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
        const posterUsername = post.postedBy ? post.postedBy.username : " Unknown";

        const { like, likes, redirectToSignin, redirectToHome, comments } = this.state;
        console.log("POST: ", post)

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
                    <div className="d-flex flex-row align-items-center float-left">
                        <img
                            className="mb-1 mr-2"
                            style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                            onError={i => (i.target.src = DefaultProfile)}
                            alt={posterName}
                        />
                        <div>
                            <h2 className="h6 mb-0">
                                <Link to={`/user/${posterId}`} style={{ fontSize: "24px" }}>
                                    {posterUsername ? posterUsername : posterName}
                                </Link>
                            </h2>
                            <p className="small text-muted mb-0">
                                {" " + timeDifference(new Date(), new Date(post.created))}
                            </p>
                        </div>
                    </div>


                    <div
                        style={{ marginBottom: "0" }}
                        className="float-right mt-2"
                    >

                        {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                            <>
                                <div className="d-flex text-muted float-right ml-3">
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
                                <svg onClick={this.likeToggle} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-suit-heart" style={{ cursor: "pointer", marginRight: "10px", marginTop: "13px" }} fill="#ff3a39" fil="true" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="#ff3a39" d="M8 6.236l.894-1.789c.222-.443.607-1.08 1.152-1.595C10.582 2.345 11.224 2 12 2c1.676 0 3 1.326 3 2.92 0 1.211-.554 2.066-1.868 3.37-.337.334-.721.695-1.146 1.093C10.878 10.423 9.5 11.717 8 13.447c-1.5-1.73-2.878-3.024-3.986-4.064-.425-.398-.81-.76-1.146-1.093C1.554 6.986 1 6.131 1 4.92 1 3.326 2.324 2 4 2c.776 0 1.418.345 1.954.852.545.515.93 1.152 1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                </svg>
                            </h3>
                        ) : (
                                <h3>
                                    <svg onClick={this.likeToggle} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-suit-heart" style={{ cursor: "pointer", marginRight: "10px", marginTop: "13px" }} fill="#6d757d" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 6.236l.894-1.789c.222-.443.607-1.08 1.152-1.595C10.582 2.345 11.224 2 12 2c1.676 0 3 1.326 3 2.92 0 1.211-.554 2.066-1.868 3.37-.337.334-.721.695-1.146 1.093C10.878 10.423 9.5 11.717 8 13.447c-1.5-1.73-2.878-3.024-3.986-4.064-.425-.398-.81-.76-1.146-1.093C1.554 6.986 1 6.131 1 4.92 1 3.326 2.324 2 4 2c.776 0 1.418.345 1.954.852.545.515.93 1.152 1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                    </svg>
                                </h3>
                            )}

                        <p className="mt-3 mr-4 text-muted">
                            {likes ? "Likes (" + likes + ")" : "Like (" + likes + ")"}
                        </p>

                        <Link to="#" className="d-flex align-items-center text-muted mr-4">
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-chat-left-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path fillRule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                            </svg>
                            <p className="d-none d-md-block mt-3 ml-2">Comment</p>
                        </Link>

                        <Link to="#" className="d-flex align-items-center text-muted">
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-upload" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path fillRule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
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