import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PRIVACY_POLICY_EFFECTIVE_DATE, PRIVACY_POLICY_SECTIONS } from '../content/privacyPolicy';
import { colors } from '../theme/colors';
import { rs } from '../theme/responsive';

export function PrivacyPolicyContent({ scale = 1 }: { scale?: number }) {
  return (
    <View>
      <Text style={[styles.effectiveDate, { fontSize: rs(13, scale) }]}>
        Effective {PRIVACY_POLICY_EFFECTIVE_DATE}
      </Text>
      {PRIVACY_POLICY_SECTIONS.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={[styles.heading, { fontSize: rs(16, scale) }]}>{section.heading}</Text>
          <Text style={[styles.body, { fontSize: rs(14, scale) }]}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  effectiveDate: { color: colors.textMuted, fontWeight: '600', marginBottom: 16 },
  section: { marginBottom: 20 },
  heading: { fontWeight: '800', color: colors.text, marginBottom: 6 },
  body: { color: colors.textMuted, fontWeight: '500', lineHeight: 21 },
});
