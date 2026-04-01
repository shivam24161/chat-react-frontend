import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ selectedUser, onLogout }) {
    const [isOnline, setIsOnline] = useState(false);
    const { user } = useAuth();
    const socket = useSocket();
    const toggleStatus = (status) => {
        socket.emit("updateStatus", {
            userId: user._id,
            isOnline: status
        });
        setIsOnline(status);
    };
    return (
        <div>
            <div className="flex items-start justify-between gap-4 px-2 py-1">
                <div className="flex gap-1">
                    <span
                        className={
                            isOnline ? "text-green-500" : "text-gray-500"
                        }
                    >
                        {isOnline ? "🟢" : "⚫"}
                    </span>
                    {/* 🟢 SELF STATUS */}
                    <div className="mb-4">
                        <div className="flex gap-2 flex-wrap">
                            {!isOnline ? <button
                                onClick={() => toggleStatus(true)}
                                className="bg-green-500 text-white px-2"
                            >
                                Go online
                            </button> :
                                <button
                                    onClick={() => toggleStatus(false)}
                                    className="bg-gray-500 text-white px-2"
                                >
                                    Go offline
                                </button>}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
            <div className="flex justify-between items-center px-2 border-b bg-white sticky top-0 z-10">
                <div>
                    <h2 className="font-bold text-lg">
                        {selectedUser ? selectedUser.name : "Select a user"}
                    </h2>
                    {selectedUser && (
                        <p className="text-sm text-gray-500">
                            {selectedUser.isOnline ? "Online" : "Offline"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}