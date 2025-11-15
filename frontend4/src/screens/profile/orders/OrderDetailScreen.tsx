import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { t } from '../../../i18n';

export default function OrderDetailScreen({ navigation, route }: any) {
  // Mock order data - in production would come from route params or API
  const order = {
    id: route.params?.orderId || '1',
    orderNumber: 'ORD-20250114-001',
    date: '2025-01-14 10:30 AM',
    status: 'toShip',
    paymentMethod: 'Credit Card •••• 1234',
    shippingAddress: {
      name: 'John Doe',
      phone: '+886 912 345 678',
      address: '123 Main St, Apt 4B, Taipei City, 10001',
    },
    items: [
      {
        id: '1',
        name: 'Summer Dress',
        variant: 'Size: M, Color: Blue',
        quantity: 1,
        price: 29.99,
        image: '👗',
      },
      {
        id: '2',
        name: 'Sneakers',
        variant: 'Size: 42',
        quantity: 1,
        price: 59.98,
        image: '👟',
      },
    ],
    subtotal: 89.97,
    shipping: 5.00,
    discount: 10.00,
    total: 84.97,
    trackingNumber: 'TW123456789',
    timeline: [
      { status: 'Order Placed', date: '2025-01-14 10:30', completed: true },
      { status: 'Payment Confirmed', date: '2025-01-14 10:35', completed: true },
      { status: 'Processing', date: '2025-01-14 14:00', completed: true },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  };

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('orderDetail')}</Text>
        <TouchableOpacity>
          <Text style={styles.helpButton}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Order Status */}
        <View style={styles.statusCard}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusLabel(order.status)}
          </Text>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orderTimeline')}</Text>
          <View style={styles.timeline}>
            {order.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[
                      styles.timelineIcon,
                      item.completed && styles.timelineIconCompleted,
                    ]}
                  >
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  {index < order.timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        item.completed && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStatus,
                      item.completed && styles.timelineStatusCompleted,
                    ]}
                  >
                    {item.status}
                  </Text>
                  {item.date && <Text style={styles.timelineDate}>{item.date}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping Info */}
        {order.trackingNumber && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('shippingInfo')}</Text>
              <TouchableOpacity>
                <Text style={styles.trackButton}>{t('trackPackage')} →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.trackingNumber}>
              {t('tracking')}: {order.trackingNumber}
            </Text>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('deliveryAddress')}</Text>
          <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
          <Text style={styles.addressPhone}>{order.shippingAddress.phone}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.address}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orderItems')}</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemImage}>
                <Text style={styles.itemIcon}>{item.image}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemVariant}>{item.variant}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('paymentSummary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('shipping')}</Text>
            <Text style={styles.summaryValue}>${order.shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('discount')}</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>
              -${order.discount.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentLabel}>{t('paymentMethod')}</Text>
            <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {order.status === 'toPay' && (
          <>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{t('cancelOrder')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t('payNow')}</Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === 'toShip' && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>{t('cancelOrder')}</Text>
          </TouchableOpacity>
        )}
        {order.status === 'toReceive' && (
          <>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t('contactSeller')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t('confirmReceipt')}</Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === 'completed' && (
          <>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t('reorder')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t('leaveReview')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  helpButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  trackButton: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  trackingNumber: {
    fontSize: 14,
    color: '#666',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE7',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#6C5CE7',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineStatus: {
    fontSize: 15,
    color: '#999',
    marginBottom: 2,
  },
  timelineStatusCompleted: {
    color: '#333',
    fontWeight: '600',
  },
  timelineDate: {
    fontSize: 13,
    color: '#999',
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#999',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  discountValue: {
    color: '#FF6B6B',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C5CE7',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6C5CE7',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
