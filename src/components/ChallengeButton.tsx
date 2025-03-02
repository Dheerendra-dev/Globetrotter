import { motion } from "framer-motion";

const ChallengeButton = ({ username, score }: { username: string, score: { correct: number; incorrect: number } }) => {

    const handleChallengeFriend = () => {
        const shareUrl = `${window.location.origin}?challenger=${username}`;
        const message = `Can you beat my city trivia score? 🌍\nMy Score: ${score.correct} ✅ ${score.incorrect} ❌\nPlay here: ${shareUrl}`;
        navigator.clipboard.writeText(message).then(() => {
            alert("Challenge link copied to clipboard! 📋");
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }

    return (
        <div className="w-full">
            <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-tr from-indigo-600  to-purple-500 text-green-800  px-6 py-3 w-full text-center rounded-lg font-semibold hover:bg-green-600 flex justify-center gap-2"
                onClick={handleChallengeFriend}
            >
                <span className="text-2xl font-manrope font-bold text-white">Challenge Friend</span>
                <span className="text-xl">🤼</span>
            </motion.button>
        </div>
    )
}

export default ChallengeButton
