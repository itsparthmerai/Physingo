import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/Buttons';
import { PrivacyPolicyContent } from '../components/PrivacyPolicyContent';
import { useLegalStore } from '../store/useLegalStore';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

export function PrivacyGateScreen() {
  const [checked, setChecked] = useState(false);
  const acceptPrivacyPolicy = useLegalStore((s) => s.acceptPrivacyPolicy);
  const { scale, contentMaxWidth } = useResponsive();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: rs(24, scale) }]}>Welcome to Physingo</Text>
        <Text style={[styles.subtitle, { fontSize: rs(14, scale) }]}>
          Please review our privacy policy before you get started.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          <PrivacyPolicyContent scale={scale} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { color: colors.textMuted, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
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
