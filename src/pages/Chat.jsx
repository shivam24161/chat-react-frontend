import { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    // const [unread, setUnread] = useState({});

    const { logout } = useAuth();
    const navigate = useNavigate();

    // const handleSelectUser = (user) => {
    //     setSelectedUser(user);
    //     setUnread((prev) => ({
    //         ...prev,
    //         [user._id]: 0
    //     }));
    // };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("/users",{
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            setSelectedUser(res.data[0]);
        };
        fetchUsers();
    }, []);

    return (
        <div className="flex chat-container">
            {/* <Sidebar
                setSelectedUser={handleSelectUser}
                unread={unread}
            /> */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Header
                    selectedUser={selectedUser}
                    onLogout={handleLogout}
                />
                <ChatWindow
                    selectedUser={selectedUser}
                    // setUnread={setUnread}
                />
            </div>
        </div>
    );
}