export interface UserProfile {
  username: string;
  correct: number;
  incorrect: number;
}
export interface Question {
  clue: string;
  correctAnswer: string;
  funFact: string;
}
