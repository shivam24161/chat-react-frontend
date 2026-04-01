import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!form.email || !form.password) return;
        const res = await axios.post("/auth/login", form);
        login(res.data);
        navigate("/");
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="p-6 shadow-lg rounded w-80">
                <input
                    className="border p-2 w-full mb-3"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    className="border p-2 w-full mb-3"
                    placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white w-full p-2"
                >
                    Login
                </button>
            </div>
            <p className="text-sm mt-3 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500">
                    Signup
                </Link>
            </p>
        </div>
    );
}