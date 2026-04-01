import { useAuth } from "../context/AuthContext";

export default function MessageBubble({ msg, isLast }) {
    const { user } = useAuth();
    const isMe = msg.senderId === user._id;
    return (
        <div className={`mb-2 ${isMe ? "text-right" : "text-left"}`}>
            <span className="inline-block p-2 rounded bg-green-500 text-white">
                {msg.message}
            </span>
            {isMe && isLast  && (
                <span className="text-xs ml-2">
                    {msg.seen ? "seen" : "sent"}
                </span>
            )}
        </div>
    );
}