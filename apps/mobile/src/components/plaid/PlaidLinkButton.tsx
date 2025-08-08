import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Landmark } from 'lucide-react-native';
import { useTheme } from '../../stores/hooks';
import { plaidService } from '../../services/plaidService';
import { Button } from '../ui/Button';

interface PlaidLinkButtonProps {
  onSuccess?: (accountIds: string[]) => void;
  onError?: (error: Error) => void;
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess,
  onError,
  title = 'Link Bank Account',
  variant = 'primary'
}) => {
  const theme = useTheme();
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkPress = async () => {
    try {
      setIsLinking(true);
      
      // Get link token from backend
      const { link_token } = await plaidService.createLinkToken();
      
      // TODO: Initialize Plaid Link with the token
      // For now, show a placeholder message
      Alert.alert(
        'Plaid Integration',
        `Link token received: ${link_token.substring(0, 20)}... \n\nPlaid Link integration requires the expo-plaid-link package. Please install it to complete the integration.`,
        [{ text: 'OK', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Error creating link token:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to initialize Plaid Link: ${errorMessage}`);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Button
      title={title}
      onPress={handleLinkPress}
      variant={variant}
      disabled={isLinking}
      loading={isLinking}
      icon={<Landmark size={20} color={
        variant === 'primary' ? theme.colors.surface : theme.colors.primary
      } />}
    />
  );
};