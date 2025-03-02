import { motion } from "framer-motion";
import { UserProfile } from "./type";

const Challenger = ({ challenger }: { challenger: UserProfile | null }) => {
    return (
        <div>
            {challenger && (
                <motion.div
                    className="bg-yellow-100 p-4 rounded-lg mb-6 shadow-md"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="font-bold text-lg text-yellow-800">
                        Challenging {challenger.username}!
                    </h3>
                    <p className="text-yellow-700">
                        Their Score: {challenger.correct} ✅ / {challenger.incorrect} ❌
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default Challenger
