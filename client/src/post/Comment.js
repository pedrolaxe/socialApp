import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { timeDifference } from './timeDifference';

import Loading from '../loading/Loading';

import '../css/Comment.css';

class Comment extends Component {
    constructor() {
        super()
        this.state = {
            text: "",
            error: "",
            chosenEmoji: null,
            loading: false
        }
    }

    handleChange = e => {
        this.setState({ text: e.target.value, error: "" })
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0) {
            this.setState({
                error: "Comment cannot be empty"
            })
            return false
        }
        if (text.length > 150) {
            this.setState({
                error: "Comment cannot be more than 150 characters long"
            })
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({
                error: "Please Signin first to leave a comment"
            });
            return false
        }
        if (this.isValid()) {
            this.setState({ loading: true })
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const commentText = { text: this.state.text }

            comment(userId, token, postId, commentText)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            text: "",
                            loading: false
                        });
                        // send the updated/fresh list of comments to the parent component
                        this.props.updateComments(data.comments);
                    }
                });
        }
    };

    deleteComment = (comment) => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ loading: false })
                    // send the updated/fresh list of comments to the parent component
                    this.props.updateComments(data.comments);
                }
            });
    };

    deleteConfirmed = (comment) => {
        confirmAlert({
            title: 'Are you sure ?',
            message: 'you want to delete this comment.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteComment(comment)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    onEmojiClick = (event, emojiObject) => {
        let comment = this.state.text;
        comment = comment + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            text: comment
        })
    }

    render() {
        const { text, error, loading } = this.state;
        const { comments } = this.props;

        return (
            <div>
                { loading ? (
                    <Loading />
                ) : (

                        <div>
                            <h5 className="mt-4 mb-3">
                                Leave a comment <span className="pull-right">{comments.length} comments</span>
                            </h5>
                            <div className="panel-body">
                                <div className="form-group">
                                    <form onSubmit={this.addComment} className="bg-light">
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                onChange={this.handleChange}
                                                value={text}
                                                placeholder="Leave a comment..."
                                                id="commentInput"
                                            />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-raised btn-sm btn-info pull-right">
                                                    <i className="fa fa-paper-plane"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="alert alert-danger mt-5" style={{ display: error ? "" : "none" }}>
                                    {error}
                                </div>

                                <br />
                                <div className="clearfix"></div>
                                <hr />
                                <ul className="media-list">
                                    {comments.reverse().map((comment, i) => (
                                        <li key={i} className="media">
                                            <Link to={`/user/${comment.postedBy._id}`} >
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                                    onError={i => (i.target.src = DefaultProfile)}
                                                    alt={comment.postedBy.name}
                                                    className="rounded-circle z-depth-2 mr-2"
                                                />
                                            </Link>
                                            <div className="media-body">
                                                <span className="text-muted pull-right">
                                                    <small className="text-muted">
                                                        <i className="far fa-clock"></i>{" " + timeDifference(new Date(), new Date(comment.created))}
                                                    </small>
                                                    <br />
                                                    <span>
                                                        {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                                            <>
                                                                <div className="d-flex text-muted pull-right mr-1">
                                                                    <div className="dropdown">
                                                                        <button className="btn p-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal icon-lg text-muted pb-3px">
                                                                                <circle cx="12" cy="12" r="1"></circle>
                                                                                <circle cx="19" cy="12" r="1"></circle>
                                                                                <circle cx="5" cy="12" r="1"></circle>
                                                                            </svg>
                                                                        </button>
                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                            <Link onClick={() => this.deleteConfirmed(comment)} className="dropdown-item d-flex align-items-center" to="#">
                                                                                <i className="fas fa-trash text-danger"></i>&nbsp;&nbsp;Delete
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* <span onClick={() => this.deleteConfirmed(comment)} className="text-danger float-right mr-2 mt-2 " style={{ cursor: "pointer" }}>
                                                                    <i className="fas fa-trash"></i>
                                                                </span> */}
                                                            </>
                                                        )}
                                                    </span>
                                                </span>
                                                <Link to={`/user/${comment.postedBy._id}`} >
                                                    <strong className="text-success">{comment.postedBy.name}</strong>
                                                </Link>
                                                <p>
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}

export default Comment;