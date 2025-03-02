import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface Question {
    clue: string;
    correctAnswer: string;
    funFact: string;
}

interface City {
    city: string;
    clues: string[];
    fun_fact: string[];
}

interface UserProfile {
    username: string;
    correct: number;
    incorrect: number;
}

export default function CityTriviaGame(): React.ReactElement {
    const [cities, setCities] = useState<City[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState<{ correct: number; incorrect: number }>({
        correct: 0,
        incorrect: 0
    });
    const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
    const [username, setUsername] = useState<string>("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [challenger, setChallenger] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchCities();
        checkChallengerParam();
    }, []);

    useEffect(() => {
        if (isRegistered) {
            updateBackendScore(score);
        }
    }, [score]);

    async function fetchCities() {
        try {
            const response = await fetch("http://localhost:4000/api/cities");
            const data = await response.json();
            if (data.success) {
                setCities(data.cities);
                loadNewQuestion(data.cities);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    }

    async function checkChallengerParam() {
        const params = new URLSearchParams(window.location.search);
        const challengerName = params.get("challenger");
        if (challengerName) {
            try {
                const response = await fetch(
                    `http://localhost:4000/api/users/${challengerName}`
                );
                const data = await response.json();
                if (data.success) setChallenger(data.user);
            } catch (error) {
                console.error("Error fetching challenger:", error);
            }
        }
    }

    async function updateBackendScore(newScore: {
        correct: number;
        incorrect: number;
    }) {
        try {
            await fetch(`http://localhost:4000/api/users/${username}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newScore),
            });
        } catch (error) {
            console.error("Score sync failed:", error);
        }
    }

    function loadNewQuestion(citiesData: City[] = cities) {
        let availableCities = citiesData.filter((c) => !askedQuestions.has(c.city));
        if (availableCities.length === 0) {
            setAskedQuestions(new Set());
            availableCities = citiesData;
        }

        const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        setAskedQuestions(new Set([...askedQuestions, randomCity.city]));

        const incorrectChoices = citiesData
            .map((c) => c.city)
            .filter((city) => city !== randomCity.city)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setCurrentQuestion({
            clue: randomCity.clues[Math.floor(Math.random() * randomCity.clues.length)],
            correctAnswer: randomCity.city,
            funFact: randomCity.fun_fact[Math.floor(Math.random() * randomCity.fun_fact.length)]
        });

        setChoices(shuffle([randomCity.city, ...incorrectChoices]));
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
    }

    function shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function handleAnswerSelection(answer: string) {
        setSelectedAnswer(answer);
        const correct = answer === currentQuestion?.correctAnswer;
        setIsAnswerCorrect(correct);
        setScore((prev) => ({
            correct: correct ? prev.correct + 1 : prev.correct,
            incorrect: !correct ? prev.incorrect + 1 : prev.incorrect
        }));
    }

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

    function handleChallengeFriend() {
        const shareUrl = `${window.location.origin}?challenger=${username}`;
        const message = `Can you beat my city trivia score? 🌍\nMy Score: ${score.correct} ✅ ${score.incorrect} ❌\nPlay here: ${shareUrl}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }

    // if (!isRegistered) {
    //     return (
    //         <motion.div
    //             className="min-h-screen container min-w-7xl flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100"
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //         >
    //             <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
    //                 <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
    //                     🌍 City Trivia Challenge
    //                 </h2>
    //                 <form onSubmit={handleRegister} className="space-y-6">
    //                     <input
    //                         type="text"
    //                         placeholder="Choose your username"
    //                         className="w-full p-3 border-2 border-purple-200 rounded-lg text-black focus:outline-none focus:border-purple-500 text-center text-lg"
    //                         value={username}
    //                         onChange={(e) => setUsername(e.target.value)}
    //                         required
    //                     />
    //                     <motion.button
    //                         whileHover={{ scale: 1.05 }}
    //                         whileTap={{ scale: 0.95 }}
    //                         className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-600 transition-colors"
    //                         type="submit"
    //                     >
    //                         Start Playing! 🚀
    //                     </motion.button>
    //                 </form>
    //             </div>
    //         </motion.div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gradient-to-b w-screen  from-blue-100 to-purple-100 p-6">
            {isAnswerCorrect && <Confetti recycle={false} numberOfPieces={400} />}

            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md w-full">
                        <h1 className="text-2xl font-bold text-purple-600">
                            🌆 City Trivia Quiz
                        </h1>
                        <p className="text-gray-600">
                            Score: <span className="text-green-500">{score.correct} ✅</span>{" "}
                            <span className="text-red-500">{score.incorrect} ❌</span>
                        </p>
                    </div>


                </div>

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

                {currentQuestion && (
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <p className="text-xl font-semibold text-blue-800 text-center">
                                {currentQuestion.clue}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {choices.map((choice, index) => (
                                <motion.button
                                    key={choice}
                                    className={`p-4 rounded-sm text-lg font-medium transition-all shadow-md flex items-center gap-3 ${selectedAnswer === choice
                                        ? isAnswerCorrect
                                            ? "bg-green-500 text-white"
                                            : "border border-red-500 text-red-500"
                                        : "bg-white hover:bg-gray-50 text-gray-800"
                                        }`}
                                    onClick={() => handleAnswerSelection(choice)}
                                    disabled={!!selectedAnswer}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="bg-sky-200 text-sky-600 shadow-md rounded-sm w-10 h-10 flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    {choice}
                                </motion.button>
                            ))}
                        </div>

                        {selectedAnswer && (
                            <motion.div
                                className={`p-4 rounded-lg text-center ${isAnswerCorrect ? "bg-green-100" : "bg-red-100"
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <p className="text-lg font-semibold mb-2">
                                    {isAnswerCorrect ? "🎉 Correct!" : "😢 Incorrect!"}
                                </p>
                                <p className="text-gray-700">{currentQuestion.funFact}</p>
                            </motion.div>
                        )}

                        {selectedAnswer && (
                            <motion.button
                                className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                                onClick={() => loadNewQuestion()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                Next Question ➡️
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}