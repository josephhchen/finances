import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Palette
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeStore } from '@/src/stores/themeStore';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  showChevron = true,
}) => {
  const { theme } = useThemeStore();

  return (
    <TouchableOpacity
      style={[styles.settingsItem, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
          {icon}
        </View>
        <View style={styles.settingsItemText}>
          <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showChevron && !rightComponent && (
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleSecurityPress = () => {
    console.log('Security pressed');
  };

  const handleHelpPress = () => {
    console.log('Help pressed');
  };

  const handleLogoutPress = () => {
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Settings
        </Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>
          <SettingsItem
            icon={<User size={20} color={theme.colors.primary} />}
            title="Profile"
            subtitle="Manage your personal information"
            onPress={handleProfilePress}
          />
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>
          
          <SettingsItem
            icon={mode === 'dark' ? 
              <Moon size={20} color={theme.colors.primary} /> : 
              <Sun size={20} color={theme.colors.primary} />
            }
            title="Theme"
            subtitle={`Currently using ${mode} mode`}
            onPress={handleThemeToggle}
            rightComponent={
              <TouchableOpacity
                style={[styles.themeToggle, { backgroundColor: theme.colors.surface }]}
                onPress={handleThemeToggle}
              >
                <Animated.View
                  style={[
                    styles.themeToggleIndicator,
                    { backgroundColor: theme.colors.primary },
                    mode === 'dark' && styles.themeToggleIndicatorRight,
                  ]}
                />
              </TouchableOpacity>
            }
            showChevron={false}
          />

          <SettingsItem
            icon={<Bell size={20} color={theme.colors.primary} />}
            title="Notifications"
            subtitle="Manage your notification preferences"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ 
                  false: theme.colors.border, 
                  true: theme.colors.primary + '40' 
                }}
                thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.textSecondary}
              />
            }
            showChevron={false}
          />

          <SettingsItem
            icon={<Palette size={20} color={theme.colors.primary} />}
            title="Currency"
            subtitle="USD ($)"
            onPress={() => console.log('Currency pressed')}
          />
        </Animated.View>

        {/* Security Section */}
        <Animated.View entering={FadeInDown.duration(700).delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Security & Privacy
          </Text>
          
          <SettingsItem
            icon={<Shield size={20} color={theme.colors.primary} />}
            title="Security"
            subtitle="Password, biometrics, and more"
            onPress={handleSecurityPress}
          />
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>
          
          <SettingsItem
            icon={<HelpCircle size={20} color={theme.colors.primary} />}
            title="Help & Support"
            subtitle="FAQs, contact us, and more"
            onPress={handleHelpPress}
          />
        </Animated.View>

        {/* Logout Section */}
        <Animated.View entering={FadeInDown.duration(900).delay(500)} style={styles.section}>
          <SettingsItem
            icon={<LogOut size={20} color={theme.colors.error} />}
            title="Sign Out"
            onPress={handleLogoutPress}
            showChevron={false}
          />
        </Animated.View>

        {/* App Version */}
        <Animated.View entering={FadeInDown.duration(1000).delay(600)} style={styles.versionSection}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Budget Tracker v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 12,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  themeToggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeToggleIndicatorRight: {
    alignSelf: 'flex-end',
  },
  versionSection: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
  },
});