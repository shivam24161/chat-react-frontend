export default function Header({ selectedUser, onLogout }) {
    return (
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
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
            <div className="flex items-center gap-3">
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}