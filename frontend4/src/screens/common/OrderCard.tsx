import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderCardProps {
  orderNumber: string;
  date: string;
  status: 'toPay' | 'toShip' | 'toReceive' | 'completed';
  total: number;
  items: OrderItem[];
  onPress?: () => void;
  onPayNow?: () => void;
  onTrack?: () => void;
  onReorder?: () => void;
  onReview?: () => void;
}

export default function OrderCard({
  orderNumber,
  date,
  status,
  total,
  items,
  onPress,
  onPayNow,
  onTrack,
  onReorder,
  onReview,
}: OrderCardProps) {
  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
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

  const getStatusLabel = (orderStatus: string) => {
    switch (orderStatus) {
      case 'toPay':
        return 'Waiting for Payment';
      case 'toShip':
        return 'Processing';
      case 'toReceive':
        return 'Shipped';
      case 'completed':
        return 'Completed';
      default:
        return orderStatus;
    }
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(status) }]}>
          {getStatusLabel(status)}
        </Text>
      </View>

      {items.map((product, index) => (
        <View key={index} style={styles.productRow}>
          <View style={styles.productImage}>
            <Text style={styles.productIcon}>{product.image}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQuantity}>x{product.quantity}</Text>
          </View>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{date}</Text>
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.orderActions}>
        {status === 'toPay' && onPayNow && (
          <TouchableOpacity style={styles.actionButton} onPress={onPayNow}>
            <Text style={styles.actionButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
        {status === 'toReceive' && onTrack && (
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={onTrack}>
            <Text style={styles.actionButtonSecondaryText}>Track</Text>
          </TouchableOpacity>
        )}
        {status === 'completed' && (
          <>
            {onReorder && (
              <TouchableOpacity style={styles.actionButtonSecondary} onPress={onReorder}>
                <Text style={styles.actionButtonSecondaryText}>Reorder</Text>
              </TouchableOpacity>
            )}
            {onReview && (
              <TouchableOpacity style={styles.actionButton} onPress={onReview}>
                <Text style={styles.actionButtonText}>Review</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
