import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { t } from '../../../i18n';

type TransactionType = 'all' | 'topup' | 'payment' | 'refund' | 'withdrawal';

const mockTransactions = [
  {
    id: '1',
    type: 'payment',
    description: 'Order #ORD-20250114-001',
    amount: -84.97,
    date: '2025-01-14 10:30',
    status: 'completed',
  },
  {
    id: '2',
    type: 'topup',
    description: 'Top Up via Credit Card',
    amount: 100.00,
    date: '2025-01-13 15:20',
    status: 'completed',
  },
  {
    id: '3',
    type: 'refund',
    description: 'Refund - Order #ORD-20250110-003',
    amount: 45.99,
    date: '2025-01-12 09:15',
    status: 'completed',
  },
  {
    id: '4',
    type: 'payment',
    description: 'Order #ORD-20250111-002',
    amount: -29.99,
    date: '2025-01-11 14:45',
    status: 'completed',
  },
];

export default function WalletScreen({ navigation }: any) {
  const [balance] = useState(156.03);
  const [filterType, setFilterType] = useState<TransactionType>('all');

  const filters = [
    { key: 'all', label: t('all') },
    { key: 'topup', label: t('topUp') },
    { key: 'payment', label: t('paymentMethod') },
    { key: 'refund', label: 'Refund' },
    { key: 'withdrawal', label: t('withdraw') },
  ];

  const filteredTransactions =
    filterType === 'all'
      ? mockTransactions
      : mockTransactions.filter((t) => t.type === filterType);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return '↓';
      case 'payment':
        return '→';
      case 'refund':
        return '↑';
      case 'withdrawal':
        return '↗';
      default:
        return '•';
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? '#4CAF50' : '#666';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myWallet')}</Text>
        <TouchableOpacity>
          <Text style={styles.historyButton}>📊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('availableBalance')}</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonIcon}>↓</Text>
              <Text style={styles.balanceButtonText}>{t('topUp')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonIcon}>↑</Text>
              <Text style={styles.balanceButtonText}>{t('withdraw')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonIcon}>⟳</Text>
              <Text style={styles.balanceButtonText}>{t('transfer')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>🎁</Text>
            <Text style={styles.quickActionLabel}>{t('vouchers')}</Text>
            <Text style={styles.quickActionBadge}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionLabel}>{t('points')}</Text>
            <Text style={styles.quickActionValue}>250</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>💰</Text>
            <Text style={styles.quickActionLabel}>{t('cashback')}</Text>
            <Text style={styles.quickActionValue}>$12.50</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('transactionHistory')}</Text>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  filterType === filter.key && styles.filterChipActive,
                ]}
                onPress={() => setFilterType(filter.key as TransactionType)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterType === filter.key && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transactions List */}
          <View style={styles.transactionsList}>
            {filteredTransactions.map((transaction) => (
              <TouchableOpacity key={transaction.id} style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionIconText}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: getTransactionColor(transaction.amount) },
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}

            {filteredTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>{t('noTransactionsFound')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyButton: {
    fontSize: 24,
    color: '#fff',
  },
  balanceCard: {
    backgroundColor: '#6C5CE7',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0D9FF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceButtonIcon: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  balanceButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quickActionBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  quickActionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterChipActive: {
    backgroundColor: '#6C5CE7',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  transactionsList: {
    gap: 4,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
    color: '#666',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  bottomPadding: {
    height: 40,
  },
});
