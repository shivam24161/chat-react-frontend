import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function ChatInput({ selectedUser, fetchMessages }) {
    const [message, setMessage] = useState("");
    const socket = useSocket();
    const { user } = useAuth();

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", {
            senderId: user._id,
            receiverId: selectedUser._id
        });
        setTimeout(() => {
            socket.emit("stopTyping", {
                senderId: user._id,
                receiverId: selectedUser._id
            });
        }, 1000);
    };

    const sendMessage = () => {
        if (!message.trim() || !selectedUser) return;
        const newMsg = {
            _id: Date.now(),
            senderId: user._id,
            receiverId: selectedUser._id,
            message,
            seen: false
        };
        socket.emit("sendMessage", newMsg);
        setMessage("");
        fetchMessages();
    };

    return (
        <div className="p-4 border-t flex sticky bottom-0 bg-white gap-0.5">
            <input
                className="flex-1 border p-2"
                placeholder="type your message"
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        sendMessage();
                    }
                }}
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </div>
    );
}