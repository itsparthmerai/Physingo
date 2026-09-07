import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { isGoogleSignInConfigured, useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { friendlyAuthError, isFirebaseConfigured, signInWithEmail, signUpWithEmail } from '../services/authService';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

type Mode = 'signIn' | 'signUp';

/**
 * Isolated in its own component so the underlying expo-auth-session hook - which throws
 * synchronously during render if its client id is missing - is only ever mounted (and thus
 * only ever called) when isGoogleSignInConfigured is true. Do not call useGoogleSignIn
 * directly from SignInScreen.
 */
function GoogleSignInButton({
  scale,
  submitting,
  onStart,
  onDone,
  onError,
}: {
  scale: number;
  submitting: boolean;
  onStart: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { promptGoogleSignIn } = useGoogleSignIn(onError);

  async function handlePress() {
    onStart();
    try {
      await promptGoogleSignIn();
      onDone();
    } catch (e) {
      onError(friendlyAuthError(e));
    }
  }

  return (
    <PrimaryButton label="Continue with Google" onPress={handlePress} disabled={submitting} variant="neutral" scale={scale} />
  );
}

export function SignInScreen({ navigation }: Props) {
  const { scale, contentMaxWidth } = useResponsive();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !submitting;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigation.goBack();
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          <Text style={[styles.title, { fontSize: rs(26, scale) }]}>
            {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signIn'
              ? 'Sign in to sync your progress across devices.'
              : 'Save your streak, XP, and lesson progress to the cloud.'}
          </Text>

          {!isFirebaseConfigured && (
            <View style={styles.noticeBanner}>
              <Text style={styles.noticeText}>
                Cloud sync isn’t configured yet for this app. Add your Firebase project details to enable
                account sign-in.
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={isFirebaseConfigured && !submitting}
            />

            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={isFirebaseConfigured && !submitting}
            />
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            {submitting ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <PrimaryButton
                label={mode === 'signIn' ? 'Sign In' : 'Create Account'}
                onPress={handleSubmit}
                disabled={!canSubmit || !isFirebaseConfigured}
                variant="primary"
                scale={scale}
              />
            )}
          </View>

          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <GhostButton
              label={mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              onPress={() => {
                setError(null);
                setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
              }}
              scale={scale}
            />
          </View>

          {isGoogleSignInConfigured && isFirebaseConfigured && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <GoogleSignInButton
                scale={scale}
                submitting={submitting}
                onStart={() => {
                  setError(null);
                  setSubmitting(true);
                }}
                onDone={() => {
                  setSubmitting(false);
                  navigation.goBack();
                }}
                onError={(message) => {
                  setSubmitting(false);
                  setError(message);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeIcon: { fontSize: 20, color: colors.textMuted },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, fontWeight: '500', color: colors.textMuted, marginBottom: 20 },
  noticeBanner: {
    backgroundColor: colors.warningTint,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  noticeText: { fontSize: 13, fontWeight: '600', color: colors.text },
  form: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginTop: 10 },
  input: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderBottomColor: colors.cardBorderBottom,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
  },
  errorBanner: {
    backgroundColor: colors.errorTint,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  errorText: { fontSize: 13, fontWeight: '600', color: colors.errorDark },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
});
