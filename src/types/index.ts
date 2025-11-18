export interface RoundResult {
  round: number;
  targetTime: number;
  measuredTime: number;
  error: number;
  errorPercentage: number;
}

export type GamePhase =
  | 'intro'
  | 'ready'
  | 'playing'
  | 'roundResult'
  | 'finalResult'
  | 'reflection';

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  targetTime: number;
  results: RoundResult[];
  reflectionAnswers: {
    timePerception?: string;
    taskImpact?: string;
  };
}

export interface AppStore extends GameState {
  startGame: () => void;
  nextRound: () => void;
  recordResult: (measuredTime: number) => void;
  showFinalResult: () => void;
  startReflection: () => void;
  saveReflection: (timePerception: string, taskImpact: string) => void;
  resetGame: () => void;
  goBack: () => void;
}
