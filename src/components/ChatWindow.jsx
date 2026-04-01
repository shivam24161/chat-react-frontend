import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({ selectedUser }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const socket = useSocket();
    const [typingUser, setTypingUser] = useState(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (msg) => {
            // 🔥 If chat is NOT open → increase unread
            if (msg.senderId !== selectedUser?._id) {
                setUnread((prev) => ({
                    ...prev,
                    [msg.senderId]: (prev[msg.senderId] || 0) + 1
                }));
            }

            setMessages((prev) => [...prev, msg]);
        };
        socket.on("receiveMessage", handleMessage);
        return () => socket.off("receiveMessage", handleMessage);
    }, [socket, selectedUser]);

    useEffect(() => {
        if (!socket) return;
        socket.on("typing", (userId) => {
            if (userId === selectedUser?._id) {
                setTypingUser(userId);
            }
        });
        socket.on("stopTyping", () => {
            setTypingUser(null);
        });
    }, [socket, selectedUser]);

    const fetchMessages = async () => {
        const res = await axios.get(`/messages/${selectedUser._id}`);
        setMessages(res.data);
    };

    useEffect(() => {
        if (!selectedUser) return;
        fetchMessages();
        if (!socket || !selectedUser) return;
        socket.emit("markSeen", {
            senderId: selectedUser._id,
            receiverId: user._id
        });
    }, [selectedUser]);

    useEffect(() => {
        if (!socket) return;
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        socket.on("messagesSeen", () => {
            setMessages((prev) =>
                prev.map((msg) => ({ ...msg, seen: true }))
            );
        });
    }, [socket]);

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex-1 p-4 overflow-y-auto" ref={chatRef}>
                {messages.map((msg, ind) => {
                    return <MessageBubble key={ind} msg={msg} isLast={messages.length - 1 === ind} />
                })}
            </div>
            {typingUser && (
                <div className="text-sm text-gray-500 px-4">
                    Typing...
                </div>
            )}
            <ChatInput selectedUser={selectedUser} setMessages={setMessages} fetchMessages={fetchMessages} />
        </div>
    );
}