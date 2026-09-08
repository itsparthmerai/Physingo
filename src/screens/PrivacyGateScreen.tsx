import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/Buttons';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { useLegalStore } from '../store/useLegalStore';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

export function PrivacyGateScreen() {
  const [checked, setChecked] = useState(false);
  const [policyVisible, setPolicyVisible] = useState(false);
  const acceptPrivacyPolicy = useLegalStore((s) => s.acceptPrivacyPolicy);
  const { scale } = useResponsive();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={[styles.card, styles.shadow]}>
          <Text style={[styles.title, { fontSize: rs(22, scale) }]}>Welcome to Physingo</Text>
          <Text style={[styles.subtitle, { fontSize: rs(14, scale) }]}>
            Please review our Privacy Policy before you get started.
          </Text>

          <Pressable onPress={() => setPolicyVisible(true)} hitSlop={8} style={styles.linkWrap}>
            <Text style={[styles.link, { fontSize: rs(14, scale) }]}>Read Privacy Policy</Text>
          </Pressable>

          <Pressable style={styles.checkboxRow} onPress={() => setChecked((c) => !c)} hitSlop={8}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { fontSize: rs(14, scale) }]}>
              I have read and agree to the Privacy Policy
            </Text>
          </Pressable>

          <PrimaryButton
            label="Accept & Continue"
            onPress={acceptPrivacyPolicy}
            disabled={!checked}
            variant="success"
            scale={scale}
          />
        </View>
      </View>

      <PrivacyPolicyModal visible={policyVisible} onClose={() => setPolicyVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  title: { fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.textMuted, fontWeight: '600', marginBottom: 16 },
  linkWrap: { marginBottom: 20 },
  link: { color: colors.primaryDark, fontWeight: '700', textDecorationLine: 'underline' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  checkmark: { color: colors.white, fontWeight: '800', fontSize: 14 },
  checkboxLabel: { flex: 1, color: colors.text, fontWeight: '600' },
});
