import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { User, Mail, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { router } = require('expo-router');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const userName = user?.user_metadata?.name || 'User';
  const userEmail = user?.email || '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User color="#3B82F6" size={40} />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.emailContainer}>
                <Mail color="#6B7280" size={18} />
                <Text style={styles.userEmail}>{userEmail}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>Privacy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>Help Center</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuItemText}>About</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signOutContainer}>
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              variant="secondary"
              style={styles.signOutButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 64, // Increase bottom padding to move content above tab bar and phone navigation
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    alignItems: 'center',
    borderRadius: 16,
    margin: 24,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#EFF6FF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  sectionContent: {
    paddingBottom: 8,
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  signOutContainer: {
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 48, // Increase margin to move button above tab bar
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    padding: 16,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  signOutButton: {
    borderColor: '#EF4444',
  },
});