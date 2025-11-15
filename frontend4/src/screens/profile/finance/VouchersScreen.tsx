import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { t } from '../../../i18n';

type VoucherStatus = 'all' | 'available' | 'used' | 'expired';

interface Voucher {
  id: string;
  title: string;
  discount: string;
  minPurchase?: number;
  expiryDate: string;
  status: 'available' | 'used' | 'expired';
  code: string;
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    title: '20% Off First Purchase',
    discount: '20%',
    minPurchase: 50,
    expiryDate: '2025-02-28',
    status: 'available',
    code: 'FIRST20',
  },
  {
    id: '2',
    title: 'Free Shipping',
    discount: 'Free Ship',
    expiryDate: '2025-01-31',
    status: 'available',
    code: 'FREESHIP',
  },
  {
    id: '3',
    title: '$10 Off',
    discount: '$10',
    minPurchase: 100,
    expiryDate: '2025-01-20',
    status: 'used',
    code: 'SAVE10',
  },
  {
    id: '4',
    title: 'Summer Sale 30%',
    discount: '30%',
    minPurchase: 80,
    expiryDate: '2025-01-10',
    status: 'expired',
    code: 'SUMMER30',
  },
];

export default function VouchersScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<VoucherStatus>('available');
  const [voucherCode, setVoucherCode] = useState('');

  const tabs = [
    { key: 'all', label: t('all') },
    { key: 'available', label: t('available') },
    { key: 'used', label: t('used') },
    { key: 'expired', label: t('expired') },
  ];

  const filteredVouchers =
    activeTab === 'all'
      ? mockVouchers
      : mockVouchers.filter((v) => v.status === activeTab);

  const handleRedeemCode = () => {
    console.log('Redeem code:', voucherCode);
    // Redeem voucher code logic
  };

  const renderVoucher = ({ item }: { item: Voucher }) => (
    <View
      style={[
        styles.voucherCard,
        item.status !== 'available' && styles.voucherCardInactive,
      ]}
    >
      <View style={styles.voucherLeft}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>

      <View style={styles.voucherRight}>
        <Text style={styles.voucherTitle}>{item.title}</Text>
        {item.minPurchase && (
          <Text style={styles.voucherMin}>
            {t('minPurchase')} ${item.minPurchase.toFixed(2)}
          </Text>
        )}
        <Text style={styles.voucherCode}>{t('code')}: {item.code}</Text>
        <Text style={styles.voucherExpiry}>{t('validUntil')} {item.expiryDate}</Text>

        {item.status === 'available' && (
          <TouchableOpacity style={styles.useButton}>
            <Text style={styles.useButtonText}>{t('useNow')}</Text>
          </TouchableOpacity>
        )}
        {item.status === 'used' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{t('used')}</Text>
          </View>
        )}
        {item.status === 'expired' && (
          <View style={[styles.statusBadge, styles.expiredBadge]}>
            <Text style={styles.statusBadgeText}>{t('expired')}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('vouchersAndCoupons')}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Redeem Code Section */}
      <View style={styles.redeemSection}>
        <Text style={styles.redeemTitle}>{t('haveVoucherCode')}</Text>
        <View style={styles.redeemRow}>
          <TextInput
            style={styles.redeemInput}
            placeholder={t('enterVoucherCode')}
            value={voucherCode}
            onChangeText={setVoucherCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={handleRedeemCode}
          >
            <Text style={styles.redeemButtonText}>{t('redeem')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key as VoucherStatus)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Vouchers List */}
      {filteredVouchers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎟️</Text>
          <Text style={styles.emptyText}>{t('noTransactionsFound')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVouchers}
          renderItem={renderVoucher}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  redeemSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  redeemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  redeemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  redeemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  redeemButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  voucherCardInactive: {
    opacity: 0.6,
  },
  voucherLeft: {
    width: 100,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  discountBadge: {
    alignItems: 'center',
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  voucherRight: {
    flex: 1,
    padding: 16,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  voucherMin: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  voucherCode: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '600',
    marginBottom: 4,
  },
  voucherExpiry: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  useButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#999',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  expiredBadge: {
    backgroundColor: '#FF6B6B',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
