interface ScoreBoardProps {
    score: { correct: number; incorrect: number };
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="bg-white p-4 rounded-lg flex justify-between shadow-md w-full">
                <h1 className="text-2xl font-bold text-purple-600">
                    🌆 City Trivia Quiz
                </h1>
                <div>
                    <p className="text-gray-600">
                        Score: <span className="text-green-500">{score.correct} ✅</span>{" "}
                        <span className="text-red-500">{score.incorrect} ❌</span>
                    </p>
                </div>
            </div>


        </div>
    );
}
