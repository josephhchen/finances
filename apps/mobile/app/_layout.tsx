import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-reanimated';

import { store, persistor } from '@/src/stores/store';
import { useTheme, useThemeMode } from '@/src/stores/hooks';

const queryClient = new QueryClient();

function AppContent() {
  const theme = useTheme();
  const mode = useThemeMode();
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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
