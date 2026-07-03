import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import type { Voter } from '@/src/data/voterTypes';
import { getStatusColor, getStatusLabel } from '@/src/data/voterData';

interface VoterDetailModalProps {
  voter: Voter | null;
  onClose: () => void;
}

function getInitial(name: string): string {
  return name.replace(/^ENGR\.\s*/i, '').charAt(0).toUpperCase();
}

function formatValue(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

const VoterDetailModal = React.memo(function VoterDetailModal({ voter, onClose }: VoterDetailModalProps) {
  if (!voter) return null;

  const statusColor = getStatusColor(voter.status);
  const statusLabel = getStatusLabel(voter.status);
  const initial = getInitial(voter.name);

  const fields: Array<{ label: string; value: string | number | null | undefined }> = [
    { label: 'University', value: voter.university },
    { label: 'Centre', value: voter.centre },
    { label: 'Division', value: voter.division },
    { label: 'Passing Year', value: voter.passingYear },
    { label: 'Job Location', value: voter.jobLocation },
    { label: 'Address', value: voter.address },
    { label: 'Phone', value: voter.phone },
    { label: 'Email', value: voter.email },
    { label: 'Dues Years', value: voter.duesYears },
    { label: 'Dues Amount', value: voter.duesAmount },
    { label: 'Paid Up To', value: voter.paidUpto },
  ];

  return (
    <Modal
      testID="voter-detail-modal"
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          testID="voter-detail-backdrop"
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close modal"
        />
        <View style={styles.cardContainer} pointerEvents="box-none">
          <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              testID="voter-detail-close"
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <MaterialCommunityIcons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.voterName}>{voter.name}</Text>
              <Text style={styles.membershipNo}>Membership: {voter.membershipNo}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>

          {/* Body */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyContent}>
            {fields
              .filter((field) => formatValue(field.value) !== null)
              .map((field) => (
                <View key={field.label} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue} numberOfLines={3}>{formatValue(field.value)}</Text>
                </View>
              ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.actionRow}>
              {voter.phone && (
                <Pressable
                  testID="voter-detail-phone"
                  style={styles.actionButton}
                  accessibilityLabel="Call"
                >
                  <MaterialCommunityIcons name="phone-in-talk" size={24} color={Colors.primaryBlue} />
                </Pressable>
              )}
              <Pressable
                testID="voter-detail-message"
                style={styles.actionButton}
                accessibilityLabel="Message"
              >
                <MaterialCommunityIcons name="message-text" size={24} color={Colors.success} />
              </Pressable>
            </View>
            <Pressable
              testID="voter-detail-close-button"
              style={styles.closeButtonBottom}
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cardContainer: {
    width: '85%',
    maxHeight: '80%',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    ...Shadow.lg,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeButton: {
    padding: Spacing.xs,
    marginTop: -Spacing.xs,
    marginRight: -Spacing.xs,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
  },
  nameSection: {
    flex: 1,
    minWidth: 0,
  },
  voterName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  membershipNo: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  body: {
    maxHeight: '50%',
  },
  bodyContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  fieldRow: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  actionButton: {
    padding: Spacing.sm,
  },
  closeButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
  },
  closeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

export default VoterDetailModal;