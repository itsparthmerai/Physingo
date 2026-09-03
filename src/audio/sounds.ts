import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const correctPlayer = createAudioPlayer(require('../../assets/sounds/correct.wav'));
const incorrectPlayer = createAudioPlayer(require('../../assets/sounds/incorrect.wav'));
const completePlayer = createAudioPlayer(require('../../assets/sounds/complete.wav'));

let audioModeReady: Promise<void> | null = null;

function ensureAudioMode(): Promise<void> {
  if (!audioModeReady) {
    audioModeReady = setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
  }
  return audioModeReady;
}

async function play(player: AudioPlayer) {
  try {
    await ensureAudioMode();
    await player.seekTo(0);
    player.play();
  } catch {
    // Ignore playback errors (e.g. sound not yet loaded) - SFX are non-critical.
  }
}

export const sounds = {
  playCorrect: () => play(correctPlayer),
  playIncorrect: () => play(incorrectPlayer),
  playComplete: () => play(completePlayer),
};
