import React, { Component } from 'react';
import io from "socket.io-client";

import { read, getChats, getChatList } from './apiUser';
import { isAuthenticated } from "../auth";
import ScrollToBottom from 'react-scroll-to-bottom';

import DefaultProfile from '../images/avatar.jpg';

import {DisplayTime12Hour} from '../post/timeDifference';
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
            chosenEmoji: null,
            showPicker: false
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
        } else if(chatList.error){
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

    componentDidUpdate(){
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({behaviour: 'smooth'})
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
                this.setState({ message: '', showPicker: false })
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
                            {new Date(chat.time).getDate()}/{new Date(chat.time).getMonth()+1}/{new Date(chat.time).getFullYear()}
                            &nbsp;-&nbsp;{ DisplayTime12Hour(new Date(chat.time)) }
                            
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
                            {new Date(chat.time).getDate()}/{new Date(chat.time).getMonth()+1}/{new Date(chat.time).getFullYear()}
                            &nbsp;-&nbsp;{ DisplayTime12Hour(new Date(chat.time)) }        
                        </div>
                    </div>
                </div>
                    
            </li>
        }
    }

    render() {
        const { chatList, messages, reciever, sender, showPicker, loading } = this.state;
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
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <ul className="users" style={{ display: loading ? "none" : "" }} >
                                                { chatList.map((user, i) => (
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
                                                                <span className="name">{ user.name }</span>
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
                                            
                                            
                                            <div class="row">
                                                <div class="col-6 col-md-4">
                                                <img 
                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${reciever._id}`}
                                                    width="48"
                                                    height="48"
                                                    style={{
                                                        "border-radius": "50%",
                                                    }}
                                                />
                                                <span className="name ml-3">{reciever.name}</span>
                                                </div>
                                                <div class="col-md-8"></div>
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
                                            <div class="input-group">
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
                                                <div class="input-group-append">
                                                    {/* <button type="button" onClick={() => this.setState({ showPicker: !showPicker })} className="btn btn-sm btn-primary">
                                                            <i style={{fontSize: "20px"}} className="far fa-smile"></i>
                                                        </button> */}
                                                    <button
                                                        type="submit"
                                                        className="btn btn-link btn-xl"
                                                    >
                                                    <i className="fa fa-paper-plane"></i>
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
