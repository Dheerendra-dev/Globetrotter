interface AnswerButtonProps {
    choice: string;
    selectedAnswer: string | null;
    isAnswerCorrect: boolean | null;
    handleAnswerSelection: (answer: string) => void;
}

export default function AnswerButton({ choice, selectedAnswer, isAnswerCorrect, handleAnswerSelection }: AnswerButtonProps) {
    return (
        <button
            className={`p-4 rounded-sm text-lg font-medium shadow-md ${selectedAnswer === choice ? (isAnswerCorrect ? "border-green-400" : "border-red-500") : "bg-white hover:bg-gray-50"}`}
            onClick={() => handleAnswerSelection(choice)}
            disabled={!!selectedAnswer}
        >
            {choice}
        </button>
    );
}
