import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!form.email || !form.password) return;
        try {
            const res = await axios.post("/auth/signup", form);
            login(res.data); // auto login after signup
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 shadow-lg rounded w-80 bg-white">
                <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

                <input
                    className="border p-2 w-full mb-3"
                    placeholder="Name"
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    className="border p-2 w-full mb-3"
                    placeholder="Email"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    className="border p-2 w-full mb-3"
                    placeholder="Password"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white w-full p-2 rounded"
                >
                    Signup
                </button>

                <p className="text-sm mt-3 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}