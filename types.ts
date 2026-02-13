export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
  explanation?: string;
}

export enum GameState {
  INTRO = 'INTRO',
  LOADING_QUESTIONS = 'LOADING_QUESTIONS',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

export interface QuizConfig {
  totalQuestions: number;
}