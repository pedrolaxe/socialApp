import React, { Component } from 'react';

import Loading from '../loading/Loading';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from "../auth";
import { Redirect } from 'react-router-dom';


class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            body: '',
            photo: '',
            postedBy: '',
            redirectToPost: false,
            error: '',
            loading: false,
            fileSize: 0
        }
    }

    init = (postId) => {
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToPost: true })
                } else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        photo: data.photo,
                        postedBy: data.postedBy._id,
                        error: ""
                    });
                }
            })
    }

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize, photo, postedBy } = this.state;
        if (postedBy !== isAuthenticated().user._id) {
            this.setState({ error: "You are not authorized to do this !!", loading: false });
            return false;
        }

        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 200 KB", loading: false });
            return false;
        }
        if (photo.length === 0) {
            this.setState({ error: "Photo is required", loading: false });
            return false;
        }
        if (title.length === 0) {
            this.setState({ error: "Title is required", loading: false });
            return false;
        }
        if (body.length === 0) {
            this.setState({ error: "Body is required", loading: false });
            return false;
        }
        return true;
    }

    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        //Form Data method set
        this.postData.set(e.target.name, value);
        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const postId = this.state.id;
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({
                            title: "",
                            body: "",
                            photo: "",
                            loading: false,
                            redirectToPost: true
                        });
                    }
                });
        }
    };

    editPostForm = (title, body) => (
        <form>
            <br />
            <div className="form-group">
                <label htmlFor="upload" className="file-upload btn btn-primary  rounded-pill shadow">
                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-cloud-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                        <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />
                    </svg>&nbsp;
                    Browse for file ...
                <input
                        onChange={this.handleChange}
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="upload"
                    />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange}
                    name="title"
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange}
                    type="text"
                    name="body"
                    className="form-control"
                    value={body}
                />
            </div>

            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
        </form>
    );

    render() {
        const { id, title, body, loading, redirectToPost, error } = this.state;
        if (redirectToPost) {
            return <Redirect to={`/post/${id}`}></Redirect>
        }
        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Post - {title}</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <img
                    style={{ display: loading ? "none" : "", height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={photoUrl}
                    alt={title}
                />
                {loading ? (
                    <Loading />
                ) : (
                        this.editPostForm(title, body)
                    )}
            </div>
        )
    }
}

export default EditProfle;