import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ setSelectedUser, unread }) {
    const [users, setUsers] = useState([]);
    const [isOnline, setIsOnline] = useState(false);

    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("/users");
            setUsers(res.data);
            // set self status
            const me = res.data.find((u) => u._id === user._id);
            if (me) setIsOnline(me.isOnline);
        };
        fetchUsers();
    }, []);

    // 🔥 Listen for real-time updates
    useEffect(() => {
        if (!socket) return;
        socket.on("userStatus", ({ userId, isOnline }) => {
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, isOnline } : u
                )
            );
            // update self status
            if (userId === user._id) {
                setIsOnline(isOnline);
            }
        });
        return () => socket.off("userStatus");
    }, [socket]);

    const toggleStatus = (status) => {
        socket.emit("updateStatus", {
            userId: user._id,
            isOnline: status
        });
    };

    return (
        <div className="w-1/4 bg-gray-100 p-4">
            <div className="flex flex-col gap-1">
                <div className="flex gap-0.5 items-end">
                    <p>Welcome, {user.name}</p>
                    <span
                        className={
                            isOnline ? "text-green-500" : "text-gray-500"
                        }
                    >
                        {isOnline ? "🟢" : "⚫"}
                    </span>
                </div>
                {/* 🟢 SELF STATUS */}
                <div className="mb-4">
                    <div className="flex gap-2 flex-wrap">
                        {!isOnline ? <button
                            onClick={() => toggleStatus(true)}
                            className="bg-green-500 text-white px-2"
                        >
                            Go Online
                        </button> :
                            <button
                                onClick={() => toggleStatus(false)}
                                className="bg-gray-500 text-white px-2"
                            >
                                Go Offline
                            </button>}
                    </div>
                </div>
            </div>
            {/* 👥 USERS */}
            {users.map((u) => (
                <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
                >
                    <div>
                        {u.name}
                        <span
                            className={`ml-2 ${u.isOnline ? "text-green-500" : "text-gray-400"
                                }`}
                        >
                            ⬤
                        </span>
                    </div>
                    {/* 🔴 UNREAD BADGE */}
                    {unread[u._id] > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unread[u._id]}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}