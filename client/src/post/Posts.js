import React, { Component } from 'react';

import { list, countTotalPosts } from './apiPost';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import DefaultProfile from '../images/avatar.jpg'
import { timeDifference } from './timeDifference';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../css/Global.css'

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            skip: 0,
            hasMore: true,
            count: 0
        }
    }

    fetchData = async () => {
        if (this.state.posts.length >= this.state.count) {
            this.setState({ hasMore: false });
            return;
        }
        const data = await list(this.state.skip)

        if (data.error) {
            console.log(data.error)
        } else {
            var joinedArray = this.state.posts.concat(data);
            this.setState({ posts: joinedArray }, this.updateSkip);
        }
    }

    async componentDidMount() {
        const count = await countTotalPosts()
        this.setState({ count: count.data })
        this.fetchData()
    }

    updateSkip = () => {
        this.setState({ skip: this.state.posts.length })
    }

    renderPosts = (posts) => {
        return (
            <div className="row">
                <InfiniteScroll
                    dataLength={posts.length}
                    next={this.fetchData}
                    hasMore={this.state.hasMore}
                    loader={<Loading />}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>All posts rendered.. Please refresh to see new posts.</b>
                        </p>
                    }

                >
                    {posts.map((post, i) => {
                        const posterId = post.postedBy ? post.postedBy._id : "";
                        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
                        //const posterUsername = post.postedBy ? post.postedBy.username : " Unknown";
                        return (
                            <div key={i} className="card col-md-8 mb-5" style={{
                                padding: "0",
                                margin: "0 auto"
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
                                    <p
                                        style={{ marginBottom: "0" }}
                                        className="pull-right mt-2"
                                    >
                                        <span className="ml-2">
                                            <i className="far fa-clock"></i>{" " + timeDifference(new Date(), new Date(post.created))}
                                        </span>
                                    </p>
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
                                        <Link to={`/post/${post._id}`} className="d-flex align-items-center text-muted mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart icon-md like-btn">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                            <p className="d-none d-md-block ml-2">Like</p>
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center text-muted mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square icon-md comment-btn">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                            <p className="d-none d-md-block ml-2">Comment</p>
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center text-muted">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share icon-md share-btn">
                                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                                <polyline points="16 6 12 2 8 6"></polyline>
                                                <line x1="12" y1="2" x2="12" y2="15"></line>
                                            </svg>
                                            <p className="d-none d-md-block ml-2">Share</p>
                                        </Link>
                                    </div>
                                </div>

                            </div>

                        );
                    })}
                </InfiniteScroll>
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                {!posts.length ? (
                    <Loading />
                ) : (
                        this.renderPosts(posts)
                    )}
            </div>
        );
    }
}

export default Posts;