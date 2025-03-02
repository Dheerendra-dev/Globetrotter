import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Register from "./Register";
import ChallengeButton from "./ChallengeButton";
import Challenger from "./Challenger";
import ScoreBoard from "./ScoreBoard";
import QuestionCard from "./QuestionCard";
import { Question, UserProfile } from "./type";

interface City {
    city: string;
    clues: string[];
    fun_fact: string[];
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
            updateScore(score);
        }
    }, [score]);

    const fetchCities = async () => {
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

    const checkChallengerParam = async () => {
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

    const updateScore = async (newScore: {
        correct: number;
        incorrect: number;
    }) => {
        try {
            await fetch(`http://localhost:4000/api/users/${username}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newScore),
            });
        } catch (error) {
            console.error("Score sync failed:", error);
        }
    };

    const loadNewQuestion = (citiesData: City[] = cities) => {
        let availableCities = citiesData.filter((c) => !askedQuestions.has(c.city));
        if (availableCities.length === 0) {
            setAskedQuestions(new Set());
            availableCities = citiesData;
        }

        const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        setAskedQuestions(new Set([...askedQuestions, randomCity.city]));

        // Get unique incorrect choices
        const allIncorrectCities = citiesData
            .map((c) => c.city)
            .filter((city) => city !== randomCity.city);

        // Ensure we have at least 3 unique incorrect cities
        const uniqueIncorrectChoices = [...new Set(allIncorrectCities)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setCurrentQuestion({
            clue: randomCity.clues[Math.floor(Math.random() * randomCity.clues.length)],
            correctAnswer: randomCity.city,
            funFact: randomCity.fun_fact[Math.floor(Math.random() * randomCity.fun_fact.length)]
        });

        // Create choices with exactly 4 unique cities
        const newChoices = shuffle([randomCity.city, ...uniqueIncorrectChoices]);
        setChoices(newChoices);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
    };
    const shuffle = <T,>(array: T[]): T[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const handleAnswerSelection = (answer: string) => {
        setSelectedAnswer(answer);
        const correct = answer === currentQuestion?.correctAnswer;
        setIsAnswerCorrect(correct);
        setScore((prev) => ({
            correct: correct ? prev.correct + 1 : prev.correct,
            incorrect: !correct ? prev.incorrect + 1 : prev.incorrect
        }));
    };

    if (!isRegistered) {
        return (
            <Register username={username} setUsername={setUsername} setIsRegistered={setIsRegistered} />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b w-screen  from-blue-100 to-purple-100 p-6">
            {isAnswerCorrect && <Confetti recycle={false} numberOfPieces={400} />}

            <div className="max-w-2xl mx-auto">
                <ScoreBoard score={score} />

                <Challenger challenger={challenger} />

                <QuestionCard loadNewQuestion={loadNewQuestion} currentQuestion={currentQuestion} choices={choices} selectedAnswer={selectedAnswer} isAnswerCorrect={isAnswerCorrect} handleAnswerSelection={handleAnswerSelection} />

                <ChallengeButton username={username} score={score} />
            </div>
        </div>
    );
}