import { motion } from "framer-motion";

interface RegisterProps {
    username: string;
    setUsername: (value: string) => void;
    setIsRegistered: (value: boolean) => void;
}

export default function Register({ username, setUsername, setIsRegistered }: RegisterProps) {
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (data.success) setIsRegistered(true);
            else alert("Username is already taken!");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }

    return (
        <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">🌍 City Trivia Challenge</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Choose your username"
                        className="w-full p-3 border-2 border-purple-200 rounded-lg text-black text-center text-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-600">
                        Start Playing! 🚀
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
