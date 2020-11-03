import React, { Component } from 'react';
import io from "socket.io-client";

import { read, getChats, getChatList } from './apiUser';
import { isAuthenticated } from "../auth";
import ScrollToBottom from 'react-scroll-to-bottom';

import DefaultProfile from '../images/avatar.jpg';

import { DisplayTime12Hour } from '../post/timeDifference';
import Loading from '../loading/Loading';
import '../css/Chat.css'

const socketUrl = `${process.env.REACT_APP_API_URL}`;
let socket;

class Chat extends Component {
    constructor() {
        super();
        this.messagesEndRef = React.createRef();
        this.state = {
            socket: "",
            message: "",
            messages: [],
            sender: {},
            reciever: {},
            chatList: [],
            loading: false,
            onlineUsers: [],
            chosenEmoji: null
        };
    }


    init = async (userId) => {
        const token = isAuthenticated().token;
        const user = await read(userId, token);
        if (user.error) {
            console.log(user.error)
        } else {
            return user;
        }
    };

    async componentWillMount() {
        this.setState({ loading: true });
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const data = await getChats(senderId, recieverId)
        const chatList = await getChatList(senderId)

        if (data.error) {
            console.log(data.error)
        } else if (chatList.error) {
            console.log(chatList.error)
        } else {
            this.setState({ messages: data, loading: false, chatList: chatList })
            //console.log(data);
        }
    }

    async componentDidMount() {
        this.scrollToBottom()
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const sender = await this.init(senderId);
        const reciever = await this.init(recieverId);
        this.setState({ sender, reciever });

        await this.initSocket();
        socket.on('message', async (newChat) => {
            console.log('pushed');
            //await this.getChats()
            if (newChat.sender._id === recieverId || newChat.sender._id === senderId) {
                this.setState({ messages: [...this.state.messages, newChat] })
            }
        });

    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' })
    }

    initSocket = () => {
        const { sender } = this.state;
        socket = io(socketUrl);
        socket.on('connect', () => {
            socket.emit('userInfo', sender);
        })
        this.setState({ socket });
    }

    sendMessage = (e) => {
        e.preventDefault();
        const { message, sender, reciever } = this.state;
        if (message) {
            socket.emit('sendMessage', message, sender, reciever, () => {
                console.log('sent ', message);
                this.setState({ message: '' })
            })
        }
    }

    getChats = async () => {
        const { sender, reciever } = this.state;
        const data = await getChats(sender._id, reciever._id)
        if (data.error) {
            alert(data.error)
        } else {
            this.setState({ messages: data })
            //console.log(data);
        }
    }

    onEmojiClick = (event, emojiObject) => {
        let message = this.state.message;
        message = message + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            message
        })
    }

    renderChat = (chat, i) => {
        if (chat.sender._id === isAuthenticated().user._id) {
            return <li key={i} className="chat-right">
                <div className="media ml-auto mb-3">
                    <div className="media-body">
                        <div className="chat-text bg-primary rounded py-2 px-3 mb-2">
                            <p className="text-small mb-0 text-white text-right">{chat.message}</p>
                        </div>

                        <div className="chat-hour small text-muted text-right">
                            {new Date(chat.time).getDate()}/{new Date(chat.time).getMonth() + 1}/{new Date(chat.time).getFullYear()}
                            &nbsp;-&nbsp;{DisplayTime12Hour(new Date(chat.time))}

                        </div>
                    </div>
                </div>
            </li>

        } else {
            return <li key={i} className="chat-left">
                <div className="media mb-3">
                    <div className="media-body">
                        <div className="chat-text bg-light rounded py-2 px-3 mb-2">
                            <p className="text-small mb-0 text-left">{chat.message}</p>
                        </div>
                        <div className="chat-hour small text-muted text-left">
                            {new Date(chat.time).getDate()}/{new Date(chat.time).getMonth() + 1}/{new Date(chat.time).getFullYear()}
                            &nbsp;-&nbsp;{DisplayTime12Hour(new Date(chat.time))}
                        </div>
                    </div>
                </div>

            </li>
        }
    }

    render() {
        const { chatList, messages, reciever, sender, loading } = this.state;
        return (

            <div className="container">

                { loading ?
                    (<Loading />)
                    :
                    ("")
                }
                <div className="content-wrapper" style={{ display: loading ? "none" : "" }}>
                    <div className="row mb-5">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card card-chat m-0">
                                <div className="row no-gutters">
                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                        <div className="users-container" style={{ minHeight: "500px" }}>
                                            {/* <div className="chat-search-box">
                                                <div className="input-group">
                                                    <input className="form-control" placeholder="Search" />
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-info">
                                                            
                                                        </button>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <ul className="users" style={{ display: loading ? "none" : "" }} >
                                                {chatList.map((user, i) => (
                                                    <a key={i} href={`/chat/${sender._id}/${user._id}`}>
                                                        <li className="person" data-chat="person1">
                                                            <div className="user">
                                                                <img
                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                                                    alt={user.name}
                                                                    onError={i => (i.target.src = DefaultProfile)}
                                                                />
                                                            </div>
                                                            <p className="name-time">
                                                                <span className="name">{user.name}</span>
                                                            </p>
                                                        </li>
                                                    </a>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9"
                                        style={{
                                            borderRight: "1px solid black",
                                            borderBottom: "1px solid black"
                                        }}
                                    >
                                        <div className="selected-user">


                                            <div className="row">
                                                <div className="col-6 col-md-4">
                                                    <img
                                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${reciever._id}`}
                                                        width="48"
                                                        height="48"
                                                        alt=""
                                                        style={{
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                    <span className="name ml-3">{reciever.name}</span>
                                                </div>
                                                <div className="col-md-8"></div>
                                            </div>
                                        </div>
                                        <ScrollToBottom className="chat-container">
                                            <div>
                                                <ul className="chat-box chatContainerScroll">
                                                    {messages.map((chat, i) => (
                                                        this.renderChat(chat, i)
                                                    ))}
                                                    <div ref={this.messagesEndRef} />
                                                </ul>
                                            </div>
                                        </ScrollToBottom>
                                        <div className="form-group">
                                            <form onSubmit={this.sendMessage} className="bg-light">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Your message..."
                                                        value={this.state.message}
                                                        name="message"
                                                        autoComplete="off"
                                                        onChange={e =>
                                                            this.setState({
                                                                message: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <div className="input-group-append">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-info btn-sm"
                                                        >
                                                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-chat-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                                                                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
