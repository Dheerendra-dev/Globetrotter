import { motion } from "framer-motion";
import { useState } from "react";

interface RegisterProps {
    username: string;
    setUsername: (value: string) => void;
    setIsRegistered: (value: boolean) => void;
}

export default function Register({ username, setUsername, setIsRegistered }: RegisterProps) {
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = "https://globetrotter-game-4wkh.onrender.com/api";

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (data.success) setIsRegistered(true);
            else alert("Username is already taken!");
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">City Trivia Challenge</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Choose your username"
                        className="w-full p-3 border-2 border-purple-200 rounded-lg text-black text-center text-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <motion.button
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-lg text-white ${loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"}`}
                    >
                        {loading ? "Registering..." : "Start Playing!"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
