import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface ProfileData {
  fullName: string;
  membershipNo: string;
  organization: string;
  designation: string;
  institution: string;
  email: string;
  phone: string;
  position: string;
  electionYear: string;
  slogan: string;
}

const initialProfile: ProfileData = {
  fullName: 'Engr. Md. Ashraful Islam',
  membershipNo: 'IEB-880123',
  organization: 'PDB (Power Dev. Board)',
  designation: 'Chief Engineer',
  institution: 'BUET',
  email: 'ashraful@pdb.gov.bd',
  phone: '+880 171-234-5678',
  position: 'President',
  electionYear: '2026',
  slogan: 'Together We Build, Together We Lead',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [tempProfile, setTempProfile] = useState<ProfileData>(initialProfile);

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Dark Profile Header */}
      <View style={[styles.profileHeader, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.profileAvatarSection}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-tie" size={44} color={Colors.white} />
          </View>
          <Pressable style={styles.editPhotoBtn}>
            <MaterialCommunityIcons name="camera" size={14} color={Colors.white} />
          </Pressable>
        </View>
        <Text style={styles.profileName}>{profile.fullName}</Text>
        <Text style={styles.profilePosition}>{profile.position} Candidate</Text>
        <Text style={styles.profileMembership}>
          {profile.membershipNo} • {profile.institution} • {profile.organization.split(' ')[0]}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {isEditing && (
              <Pressable onPress={handleSave}>
                <MaterialCommunityIcons name="content-save-outline" size={22} color={Colors.primaryBlue} />
              </Pressable>
            )}
          </View>

          <EditableProfileRow
            label="Full Name"
            field="fullName"
            value={isEditing ? tempProfile.fullName : profile.fullName}
            isEditing={isEditing}
            onChange={(val) => updateField('fullName', val)}
          />
          <EditableProfileRow
            label="Membership No."
            field="membershipNo"
            value={isEditing ? tempProfile.membershipNo : profile.membershipNo}
            isEditing={isEditing}
            onChange={(val) => updateField('membershipNo', val)}
          />
          <EditableProfileRow
            label="Organization"
            field="organization"
            value={isEditing ? tempProfile.organization : profile.organization}
            isEditing={isEditing}
            onChange={(val) => updateField('organization', val)}
          />
          <EditableProfileRow
            label="Designation"
            field="designation"
            value={isEditing ? tempProfile.designation : profile.designation}
            isEditing={isEditing}
            onChange={(val) => updateField('designation', val)}
          />
          <EditableProfileRow
            label="Institution"
            field="institution"
            value={isEditing ? tempProfile.institution : profile.institution}
            isEditing={isEditing}
            onChange={(val) => updateField('institution', val)}
          />
          <EditableProfileRow
            label="Email"
            field="email"
            value={isEditing ? tempProfile.email : profile.email}
            isEditing={isEditing}
            onChange={(val) => updateField('email', val)}
            keyboardType="email-address"
          />
          <EditableProfileRow
            label="Phone"
            field="phone"
            value={isEditing ? tempProfile.phone : profile.phone}
            isEditing={isEditing}
            onChange={(val) => updateField('phone', val)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Election Information</Text>
          <EditableProfileRow
            label="Position"
            field="position"
            value={isEditing ? tempProfile.position : profile.position}
            isEditing={isEditing}
            onChange={(val) => updateField('position', val)}
          />
          <EditableProfileRow
            label="Election Year"
            field="electionYear"
            value={isEditing ? tempProfile.electionYear : profile.electionYear}
            isEditing={isEditing}
            onChange={(val) => updateField('electionYear', val)}
            keyboardType="numeric"
          />
          <EditableProfileRow
            label="Slogan"
            field="slogan"
            value={isEditing ? tempProfile.slogan : profile.slogan}
            isEditing={isEditing}
            onChange={(val) => updateField('slogan', val)}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Campaign Media</Text>
          <View style={styles.mediaGrid}>
            <Pressable style={styles.mediaBtn}>
              <MaterialCommunityIcons name="file-document-outline" size={28} color={Colors.primaryBlue} />
              <Text style={styles.mediaLabel}>Manifesto</Text>
            </Pressable>
            <Pressable style={styles.mediaBtn}>
              <MaterialCommunityIcons name="image-multiple" size={28} color={Colors.success} />
              <Text style={styles.mediaLabel}>Photos</Text>
            </Pressable>
            <Pressable style={styles.mediaBtn}>
              <MaterialCommunityIcons name="video" size={28} color={Colors.danger} />
              <Text style={styles.mediaLabel}>Videos</Text>
            </Pressable>
          </View>
        </View>

        {/* Edit / Save / Cancel */}
        {!isEditing ? (
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <MaterialCommunityIcons name="pencil" size={18} color={Colors.white} />
            <Text style={styles.editButtonText}>  Edit Profile</Text>
          </Pressable>
        ) : (
          <View style={styles.editActionsRow}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <MaterialCommunityIcons name="content-save" size={18} color={Colors.white} />
              <Text style={styles.editButtonText}>  Save</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <MaterialCommunityIcons name="close" size={18} color={Colors.textSecondary} />
              <Text style={styles.cancelButtonText}>  Cancel</Text>
            </Pressable>
          </View>
        )}

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace('/(voter)/home')}
        >
          <MaterialCommunityIcons name="logout" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>  Logout</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Editable row component
function EditableProfileRow({
  label,
  field,
  value,
  isEditing,
  onChange,
  keyboardType = 'default',
}: {
  label: string;
  field: string;
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
}) {
  return (
    <View style={rowStyles.container}>
      <Text style={rowStyles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={rowStyles.input}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          autoCapitalize="none"
          placeholderTextColor={Colors.textMuted}
        />
      ) : (
        <Text style={rowStyles.value}>{value}</Text>
      )}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  value: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    flex: 1.5,
    textAlign: 'right',
  },
  input: {
    flex: 1.5,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceLight,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    backgroundColor: Colors.darkNavy,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  profileAvatarSection: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.darkNavySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryBlueLight,
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.darkNavy,
  },
  profileName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  profilePosition: {
    fontSize: FontSize.md,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
    marginTop: 4,
  },
  profileMembership: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  mediaGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  mediaBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mediaLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  editActionsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.danger,
    backgroundColor: Colors.white,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
});
