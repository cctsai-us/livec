import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { t } from '../../../i18n';

type OrderStatus = 'all' | 'toPay' | 'toShip' | 'toReceive' | 'completed';

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-20250114-001',
    date: '2025-01-14',
    status: 'toShip',
    total: 89.97,
    items: [
      { name: 'Summer Dress', quantity: 1, price: 29.99, image: '👗' },
      { name: 'Sneakers', quantity: 1, price: 59.98, image: '👟' },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-20250113-002',
    date: '2025-01-13',
    status: 'completed',
    total: 24.99,
    items: [{ name: 'Lipstick Set', quantity: 1, price: 24.99, image: '💄' }],
  },
];

export default function MyOrdersScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const tabs = [
    { key: 'all', label: t('all') },
    { key: 'toPay', label: t('toPay') },
    { key: 'toShip', label: t('toShip') },
    { key: 'toReceive', label: t('toReceive') },
    { key: 'completed', label: t('completed') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'toPay':
        return '#FF6B6B';
      case 'toShip':
        return '#FFA500';
      case 'toReceive':
        return '#6C5CE7';
      case 'completed':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'toPay':
        return t('waitingForPayment');
      case 'toShip':
        return t('processing');
      case 'toReceive':
        return t('shipped');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  const filteredOrders =
    activeTab === 'all'
      ? mockOrders
      : mockOrders.filter((order) => order.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myOrders')}</Text>
        <TouchableOpacity>
          <Text style={styles.searchButton}>🔍</Text>
        </TouchableOpacity>
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
            onPress={() => setActiveTab(tab.key as OrderStatus)}
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>{t('noOrdersFound')}</Text>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>{t('startShopping')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate('OrderDetail', { orderId: item.id })
              }
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>

              {item.items.map((product, index) => (
                <View key={index} style={styles.productRow}>
                  <View style={styles.productImage}>
                    <Text style={styles.productIcon}>{product.image}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productQuantity}>x{product.quantity}</Text>
                  </View>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
              ))}

              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>{item.date}</Text>
                <View style={styles.orderTotal}>
                  <Text style={styles.totalLabel}>{t('total')}: </Text>
                  <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                {item.status === 'toPay' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{t('payNow')}</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'toReceive' && (
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonSecondaryText}>{t('track')}</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'completed' && (
                  <>
                    <TouchableOpacity style={styles.actionButtonSecondary}>
                      <Text style={styles.actionButtonSecondaryText}>{t('reorder')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>{t('review')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
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
  searchButton: {
    fontSize: 20,
    color: '#fff',
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
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productIcon: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 13,
    color: '#666',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonSecondaryText: {
    color: '#6C5CE7',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
