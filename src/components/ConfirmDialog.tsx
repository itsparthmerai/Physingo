import React from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { PrimaryButton, GhostButton } from './Buttons';
import { colors } from '../theme/colors';

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'danger' : 'success'}
              style={styles.confirmButton}
            />
            <GhostButton label={cancelLabel} onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 37, 48, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  message: { fontSize: 14, fontWeight: '500', color: colors.textMuted, lineHeight: 20, marginBottom: 18 },
  actions: { gap: 4 },
  confirmButton: { marginBottom: 4 },
});
