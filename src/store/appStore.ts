import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, RoundResult } from '../types';

const TARGET_TIME = 10000; // 10초 (밀리초)
const TOTAL_ROUNDS = 5;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      phase: 'intro',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      targetTime: TARGET_TIME,
      results: [],
      reflectionAnswers: {},

      startGame: () => {
        set({
          phase: 'ready',
          currentRound: 1,
          results: [],
          reflectionAnswers: {},
        });
      },

      nextRound: () => {
        const { currentRound, totalRounds } = get();
        if (currentRound < totalRounds) {
          set({
            phase: 'ready',
            currentRound: currentRound + 1,
          });
        } else {
          get().showFinalResult();
        }
      },

      recordResult: (measuredTime: number) => {
        const { currentRound, targetTime, results } = get();
        const error = measuredTime - targetTime;
        const errorPercentage = (error / targetTime) * 100;

        const newResult: RoundResult = {
          round: currentRound,
          targetTime,
          measuredTime,
          error,
          errorPercentage,
        };

        set({
          results: [...results, newResult],
          phase: 'roundResult',
        });
      },

      showFinalResult: () => {
        set({ phase: 'finalResult' });
      },

      startReflection: () => {
        set({ phase: 'reflection' });
      },

      saveReflection: (timePerception: string, taskImpact: string) => {
        set({
          reflectionAnswers: {
            timePerception,
            taskImpact,
          },
        });
      },

      resetGame: () => {
        set({
          phase: 'intro',
          currentRound: 0,
          results: [],
          reflectionAnswers: {},
        });
      },

      goBack: () => {
        const { phase, currentRound, results } = get();

        if (phase === 'reflection') {
          set({ phase: 'finalResult' });
        } else if (phase === 'finalResult') {
          set({ phase: 'roundResult' });
        } else if (phase === 'roundResult') {
          // 라운드 결과에서 뒤로가면 해당 라운드 삭제하고 ready로
          const newResults = results.slice(0, -1);
          set({
            results: newResults,
            phase: 'ready',
          });
        } else if (phase === 'ready' && currentRound > 1) {
          // ready에서 뒤로가면 이전 라운드 결과로
          set({
            phase: 'roundResult',
            currentRound: currentRound - 1,
          });
        } else if (phase === 'ready' && currentRound === 1) {
          // 첫 라운드 준비에서 뒤로가면 intro로
          set({
            phase: 'intro',
            currentRound: 0,
            results: [],
          });
        }
      },
    }),
    {
      name: 'timecog-storage',
    }
  )
);
