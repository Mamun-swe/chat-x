import React, { useState, useEffect } from 'react'
import './style.scss'
import jwt_decode from 'jwt-decode'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import queryString from 'query-string'
import io from 'socket.io-client'
import UserList from '../../../components/UserList/Index'

let socket

const Index = () => {
    // const ENDPOINT = 'https://chat-x-api.herokuapp.com'
    const ENDPOINT = 'localhost:4000'
    const location = useLocation()
    const query = queryString.parse(location.search)
    const { register, handleSubmit, errors } = useForm()
    const [messages, setMessages] = useState([])
    const reciver = query.reciver
    const token = localStorage.getItem('token')
    const decode = jwt_decode(token)

    useEffect(() => {
        const room = decode.id + "@" + reciver
        socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] })

        socket.emit("join", { room })
        socket.on("message", (message) => {
            setMessages((exMessage) => [...exMessage, message])
            // console.log(message)
        })

    }, [ENDPOINT, reciver])

    // Submit Message
    const onSubmit = async (data) => {
        const room = reciver + '@' + decode.id
        const messageData = { message: data.message, room: room }

        setMessages((exMessage) => [...exMessage, messageData])

        socket.emit('message', messageData, (response) => {
            if (response) {
                console.log('Successfully message send');
            }
        })
    }


    return (
        <div className="chat-room">
            <div className="d-flex">
                {/* Users List Container */}
                <div className="users-list-container border-right">
                    <UserList sender={reciver} />
                </div>

                {/* Message Container */}
                <div className="message-container flex-fill border-left">

                    <p>* Mesages {messages.length}</p>
                    <div className="message-body">
                        {messages && messages.length > 0 ?
                            messages.map((items, i) =>
                                <div className="message" key={i} id="message">
                                    <p>{items.message}</p>
                                </div>
                            ) : null}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-flex">
                            <div className="flex-fill">
                                <input
                                    type="text"
                                    name="message"
                                    className="form-control shadow-none"
                                    ref={register({ required: true })}
                                />
                            </div>
                            <div><button type="submit" className="btn btn-info shadow-none">Send</button></div>
                        </div>
                    </form>
                </div>
            </div>








            {/* <div className="container py-4">
                <div className="row">
                    <div className="col-12 col-lg-6 m-auto">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <p>Room <span className="text-success">{room}</span></p>

                                <div className="message-body">
                                    {messages && messages.length > 0 ?
                                        messages.map((items, i) =>
                                            <div className="message" key={i} id="message">
                                                <p>{items.message}</p>
                                            </div>
                                        ) : null}
                                </div>
                            </div>

                            <div className="card-footer bg-white">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="d-flex">
                                        <div className="flex-fill">
                                            <input
                                                type="text"
                                                name="message"
                                                className="form-control shadow-none"
                                                ref={register({ required: true })}
                                            />
                                        </div>
                                        <div><button type="submit" className="btn btn-info shadow-none">Send</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <p>Task : RoomID will be concat with loggedin user ID (Own/Sender ID)</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Index;