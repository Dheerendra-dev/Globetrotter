import { motion } from "framer-motion";
import { Question } from "../type";
import { useState, useEffect } from "react";

interface QuestionCardProps {
    currentQuestion: Question | null;
    choices: string[];
    selectedAnswer: string | null;
    isAnswerCorrect: boolean | null;
    handleAnswerSelection: (answer: string) => void;
    loadNewQuestion: () => void;
}

export default function QuestionCard({ currentQuestion, choices, selectedAnswer, isAnswerCorrect, loadNewQuestion, handleAnswerSelection }: QuestionCardProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentQuestion) {
            setLoading(false);
        }
    }, [currentQuestion]);

    return (
        <>
            {loading ? (
                <motion.div className="bg-white p-6 rounded-xl shadow-lg mb-8 animate-pulse">
                    <div className="bg-gray-200 p-4 rounded-lg mb-6 h-16"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {Array(4).fill(0).map((_, index) => (
                            <div key={index} className="p-4 rounded-sm bg-gray-200 h-12" />
                        ))}
                    </div>
                    <div className="p-4 rounded-lg bg-gray-200 h-16"></div>
                </motion.div>
            ) : (
                currentQuestion && (
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
                                    key={`${choice}-${index}`}
                                    className={`p-4 rounded-sm text-lg font-medium transition-all shadow-md flex items-center gap-3 ${selectedAnswer === choice
                                        ? isAnswerCorrect
                                            ? "border border-green-400 text-black"
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
                                className={`p-4 rounded-lg text-center ${isAnswerCorrect ? "bg-green-100" : "bg-red-100"}`}
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
                                className="w-full mt-6 bg-sky-200  text-sky-600 py-3 rounded-sm font-semibold hover:cursor-pointer transition-colors"
                                onClick={() => loadNewQuestion()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                Next Question ➡️
                            </motion.button>
                        )}
                    </motion.div>
                )
            )}
        </>
    );
}
