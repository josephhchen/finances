import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Building2, RotateCw, Pause } from 'lucide-react-native';
import { useTheme } from '../../stores/hooks';
import { Account } from '../../types/financial';
import { formatCurrency } from '../../utils/format';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
  onSyncToggle?: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onPress,
  onSyncToggle
}) => {
  const theme = useTheme();

  const getAccountTypeColor = (type: Account['type']) => {
    switch (type) {
      case 'checking': return '#4CAF50';
      case 'savings': return '#2196F3';
      case 'credit': return '#FF9800';
      case 'investment': return '#9C27B0';
      default: return theme.colors.primary;
    }
  };

  const formatAccountType = (type: Account['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.accountInfo}>
          <View style={[
            styles.typeIndicator, 
            { backgroundColor: getAccountTypeColor(account.type) }
          ]} />
          <View style={styles.textInfo}>
            <Text style={[styles.accountName, { color: theme.colors.text }]}>
              {account.name}
            </Text>
            <Text style={[styles.accountType, { color: theme.colors.textSecondary }]}>
              {formatAccountType(account.type)}
              {account.institution_name && ` • ${account.institution_name}`}
            </Text>
          </View>
        </View>
        
        {account.plaid_account_id && (
          <TouchableOpacity 
            onPress={() => onSyncToggle?.(account)}
            style={styles.syncButton}
          >
            {account.sync_enabled ? (
              <RotateCw size={20} color={theme.colors.primary} />
            ) : (
              <Pause size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.balanceSection}>
        <Text style={[styles.balance, { color: theme.colors.text }]}>
          {formatCurrency(account.balance, account.currency)}
        </Text>
        
        {account.last_synced && (
          <Text style={[styles.lastSync, { color: theme.colors.textSecondary }]}>
            Last synced: {account.last_synced.toLocaleDateString()}
          </Text>
        )}
      </View>
      
      {account.plaid_account_id && (
        <View style={styles.footer}>
          <Building2 size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.plaidIndicator, { color: theme.colors.textSecondary }]}>
            Connected via Plaid
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
  },
  syncButton: {
    padding: 8,
  },
  balanceSection: {
    marginBottom: 8,
  },
  balance: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  lastSync: {
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  plaidIndicator: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});