import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { formatAmount } from '@/utils/currency';
import { useApp } from '@/contexts/AppContext';
import { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  categoryColor?: string;
  categoryIcon?: string;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onMorePress?: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  categoryColor = '#4facfe',
  categoryIcon = '💰',
  onEdit,
  onDelete,
  onMorePress,
}: TransactionItemProps) {
  const { state: themeState } = useTheme();
  const { state } = useApp();
  const { colors } = themeState.theme;
  const styles = createStyles(colors);
  const userCurrency = state.user?.currency || 'INR';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress(transaction);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleMorePress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: categoryColor + '10' }]}>
          {React.createElement((Icons as any)[categoryIcon || 'Circle'] || Icons.Circle, {
            size: 20,
            color: categoryColor
          })}
        </View>
        <View style={styles.details}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          {
            color: transaction.type === 'income' ? '#10B981' : '#EF4444'
          }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount, userCurrency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});