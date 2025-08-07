import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';

import { useThemeStore } from '@/src/stores/themeStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { theme, mode } = useThemeStore();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="transaction/[id]" 
          options={{ 
            title: 'Transaction Details',
            presentation: 'modal' 
          }} 
        />
        <Stack.Screen 
          name="add-transaction" 
          options={{ 
            title: 'Add Transaction',
            presentation: 'modal' 
          }} 
        />
        <Stack.Screen 
          name="budget/[id]" 
          options={{ 
            title: 'Budget Details',
            presentation: 'modal' 
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </QueryClientProvider>
  );
}
