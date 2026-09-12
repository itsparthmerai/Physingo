# Physingo

A Duolingo-style study app for physical therapy students and clinicians, covering:

- 🦴 Anatomy
- 📐 Goniometry
- 🔍 Special Tests
- 🧠 Differential Diagnosis
- 📝 Documentation
- 🏠 HEP (Home Exercise Programs)

## Stack

- Expo (React Native) + TypeScript
- React Navigation (native stack)
- Zustand + AsyncStorage for persisted progress (XP, streaks, lesson stars)
- Content authored as typed local data files under `src/content/`

## Running the app

```bash
npm install
npm run android   # or: npm run ios / npm run web
```

Requires the Expo Go app (or a simulator) to run on a device.

## Project structure

```
src/
  content/       Topic + lesson + question data (typed, no backend)
  store/         Zustand progress store (XP, streak, lesson stars)
  theme/         Shared color tokens
  components/    Reusable UI (OptionButton, HeartsDisplay, ProgressBar, LessonNode, StatPill)
  screens/       Home, Lesson, LessonResult, Profile
  navigation/    Root stack navigator
```

## Gameplay

Each topic is a vertical lesson path. Answering questions correctly earns XP;
wrong answers cost a heart (5 per lesson attempt) — run out and the lesson
must be retried. Completing lessons on consecutive days builds a streak.
Question types include multiple choice, true/false, fill-in-the-blank, and
multi-select.

## Adding content

Add new questions/lessons by editing the relevant file in `src/content/`
(e.g. `anatomy.ts`). Each lesson is an array of typed `Question` objects
(`mcq`, `true-false`, `fill-blank`, `multi-select`) — see `src/content/types.ts`.
