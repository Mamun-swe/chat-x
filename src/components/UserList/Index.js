import React, { useCallback, useEffect, useState } from 'react'
import Axios from 'axios'
import { api } from '../../utils/api'
import { useHistory } from 'react-router-dom'

const Index = ({ sender }) => {
    const history = useHistory()
    const [users, setUsers] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })

    // get users
    const getUsers = useCallback(async () => {
        try {
            const response = await Axios.get(`${api}user/index`, header)
            if (response.status === 200) {
                setUsers(response.data.users)
                setLoading(false)
            }
        } catch (error) {
            if (error) console.log(error.response)
        }
    }, [header])

    useEffect(() => {
        getUsers()
    }, [header, getUsers])


    // Split Name
    const splitName = name => {
        if (name) {
            let shortName
            shortName = name.charAt(0)
            return shortName
        }
    }

    // Go to chat room
    const goChatRoom = id => {
        history.push(`/chat-room?reciver=${id}`)
    }

    return (
        <div>
            {users && users.map((user, i) =>
                <div
                    key={i}
                    className={sender === user._id ? "user d-flex active" : "user d-flex"}
                    onClick={() => goChatRoom(user._id)}
                >
                    <div className="img-container rounded-circle"
                        style={{ background: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) }}
                    >
                        <div className="flex-center flex-column">
                            <h6 className="mb-0 text-uppercase">{splitName(user.userName)}</h6>
                        </div>
                    </div>
                    <div className="name-container pl-3">
                        <p className="text-capitalize mb-0">{user.userName}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;