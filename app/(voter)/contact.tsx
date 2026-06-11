import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface ContactMethod {
  id: string;
  label: string;
  value: string;
  icon: string;
  iconType: 'material' | 'fontawesome';
  color: string;
  action: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    id: 'phone',
    label: 'Phone',
    value: '+880 171-234-5678',
    icon: 'phone-alt',
    iconType: 'fontawesome',
    color: Colors.success,
    action: 'tel:+8801712345678',
  },
  {
    id: 'email',
    label: 'Email',
    value: 'info@aeb.org.bd',
    icon: 'envelope',
    iconType: 'fontawesome',
    color: Colors.primaryBlue,
    action: 'mailto:info@aeb.org.bd',
  },
  {
    id: 'website',
    label: 'Website',
    value: 'www.aeb.org.bd',
    icon: 'globe',
    iconType: 'fontawesome',
    color: Colors.warning,
    action: 'https://www.aeb.org.bd',
  },
  {
    id: 'address',
    label: 'Address',
    value: 'AEB Complex, Dhaka 1212',
    icon: 'map-marker-alt',
    iconType: 'fontawesome',
    color: Colors.danger,
    action: '',
  },
];

const SOCIAL_LINKS = [
  { icon: 'facebook-f', color: '#1877F2' },
  { icon: 'twitter', color: '#1DA1F2' },
  { icon: 'linkedin-in', color: '#0A66C2' },
  { icon: 'youtube', color: '#FF0000' },
];

const OFFICE_HOURS = [
  { day: 'Saturday - Thursday', time: '9:00 AM - 5:00 PM', isOpen: true },
  { day: 'Friday', time: 'Closed', isOpen: false },
  { day: 'Public Holidays', time: 'Closed', isOpen: false },
];

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleContactPress = (method: ContactMethod) => {
    if (method.action) {
      Linking.openURL(method.action).catch(() => {
        Alert.alert('Error', 'Could not open this link');
      });
    }
  };

  const handleSendMessage = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your name, email, and message.');
      return;
    }
    Alert.alert('Message Sent', 'Thank you! We will get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const renderIcon = (method: ContactMethod) => {
    if (method.iconType === 'fontawesome') {
      return (
        <FontAwesome5 name={method.icon as any} size={20} color={method.color} />
      );
    }
    return (
      <MaterialCommunityIcons name={method.icon as any} size={22} color={method.color} />
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader variant="light" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Dark Header */}
        <View style={styles.darkHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerIconCircle}>
              <MaterialCommunityIcons name="headset" size={28} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Contact Us</Text>
              <Text style={styles.headerSubtitle}>Association of Engineers Bangladesh</Text>
            </View>
          </View>

          {/* Social Icons Row */}
          <View style={styles.socialRow}>
            {SOCIAL_LINKS.map((social, index) => (
              <Pressable
                key={index}
                style={[styles.socialIcon, { backgroundColor: social.color }]}
              >
                <FontAwesome5 name={social.icon as any} size={16} color={Colors.white} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contact Methods Cards */}
        <View style={styles.contactGrid}>
          {CONTACT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              style={styles.contactCard}
              onPress={() => handleContactPress(method)}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: method.color + '15' }]}>
                {renderIcon(method)}
              </View>
              <Text style={styles.cardLabel}>{method.label}</Text>
              <Text style={styles.cardValue} numberOfLines={2}>{method.value}</Text>
            </Pressable>
          ))}
        </View>

        {/* Office Hours */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.sectionTitle}>Office Hours</Text>
          </View>

          <View style={styles.hoursList}>
            {OFFICE_HOURS.map((item, index) => (
              <View key={index} style={styles.hoursRow}>
                <View style={styles.hoursLeft}>
                  <MaterialCommunityIcons
                    name={item.isOpen ? 'check-circle' : 'close-circle'}
                    size={16}
                    color={item.isOpen ? Colors.success : Colors.danger}
                  />
                  <Text style={styles.hoursDay}>{item.day}</Text>
                </View>
                <Text
                  style={[
                    styles.hoursTime,
                    { color: item.isOpen ? Colors.success : Colors.danger },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Send Message Form */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="email-edit-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.sectionTitle}>Send a Message</Text>
          </View>

          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Subject */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="format-title" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="What is this about?"
                  placeholderTextColor={Colors.textMuted}
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>
            </View>

            {/* Message */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message</Text>
              <View style={[styles.inputContainer, styles.messageContainer]}>
                <MaterialCommunityIcons name="message-text-outline" size={18} color={Colors.textMuted} style={[styles.inputIcon, { marginTop: 14 }]} />
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Write your message here..."
                  placeholderTextColor={Colors.textMuted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              style={styles.submitButton}
              onPress={handleSendMessage}
            >
              <MaterialCommunityIcons name="send" size={18} color={Colors.white} />
              <Text style={styles.submitButtonText}>  Send Message</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <View style={styles.helpIconCircle}>
              <MaterialCommunityIcons name="help-circle" size={24} color={Colors.primaryBlue} />
            </View>
            <View style={styles.helpTextSection}>
              <Text style={styles.helpTitle}>Need Quick Help?</Text>
              <Text style={styles.helpSubtitle}>
                Call our hotline: +880 171-234-5678
              </Text>
            </View>
            <Pressable
              style={styles.helpCallButton}
              onPress={() => Linking.openURL('tel:+8801712345678')}
            >
              <FontAwesome5 name="phone-alt" size={14} color={Colors.white} />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },

  // Dark Header
  darkHeader: {
    backgroundColor: Colors.darkNavy,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  headerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Contact Grid
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  contactCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
    flexGrow: 1,
    flexBasis: '45%',
  },
  cardIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },

  // Section Card
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
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // Office Hours
  hoursList: {
    gap: 0,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  hoursLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  hoursDay: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  hoursTime: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },

  // Form
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageContainer: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  messageInput: {
    minHeight: 80,
    lineHeight: 22,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  submitButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Quick Help
  helpSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bannerBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primaryBlue + '15',
  },
  helpIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryBlue + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  helpTextSection: {
    flex: 1,
  },
  helpTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  helpSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  helpCallButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
