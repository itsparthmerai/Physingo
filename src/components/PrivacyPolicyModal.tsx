import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrivacyPolicyContent } from './PrivacyPolicyContent';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

export function PrivacyPolicyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { scale, contentMaxWidth } = useResponsive();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: rs(22, scale) }]}>Privacy Policy</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
            <PrivacyPolicyContent scale={scale} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontWeight: '800', color: colors.text },
  closeIcon: { fontSize: 20, color: colors.textMuted, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
});
