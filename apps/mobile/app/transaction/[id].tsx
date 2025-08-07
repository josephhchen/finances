import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useThemeStore } from '@/src/stores/themeStore';
import { Button } from '@/src/components/ui';

export default function TransactionDetailScreen() {
  const { theme } = useThemeStore();
  const { id } = useLocalSearchParams();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Button
          title="Back"
          onPress={handleGoBack}
          variant="ghost"
          icon={<ArrowLeft size={18} color={theme.colors.text} />}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Transaction Details
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Transaction ID: {id}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          This screen will show detailed information about the transaction.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});