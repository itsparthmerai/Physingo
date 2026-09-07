import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { friendlyAuthError, signInWithGoogleIdToken, signInWithGooglePopup } from '../services/authService';

// Required once so the auth browser session can close and return control to the app on native.
WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

/**
 * A webClientId is the minimum needed on every platform (native falls back to it via
 * the generic `clientId` field below), so that's the single readiness gate. Only render
 * a component that calls useGoogleSignIn when this is true - the underlying Expo hook
 * throws synchronously during render if its client id is missing.
 */
export const isGoogleSignInConfigured = Boolean(webClientId);

export function useGoogleSignIn(onError: (message: string) => void) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    webClientId,
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    if (Platform.OS === 'web' || !response) return;
    if (response.type === 'success') {
      const idToken = response.params?.id_token ?? response.authentication?.idToken;
      if (idToken) {
        signInWithGoogleIdToken(idToken).catch((e) => onError(friendlyAuthError(e)));
      } else {
        onError('Google sign-in did not return a token. Please try again.');
      }
    } else if (response.type === 'error') {
      onError('Google sign-in was cancelled or failed.');
    }
  }, [response, onError]);

  async function promptGoogleSignIn() {
    try {
      if (Platform.OS === 'web') {
        await signInWithGooglePopup();
      } else {
        await promptAsync();
      }
    } catch (e) {
      onError(friendlyAuthError(e));
    }
  }

  return { promptGoogleSignIn, isReady: Platform.OS === 'web' || Boolean(request) };
}
