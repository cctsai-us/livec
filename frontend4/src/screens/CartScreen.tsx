import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { t } from '../i18n';

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    seller: 'Fashion Store',
    name: 'Summer Dress',
    price: 29.99,
    originalPrice: 49.99,
    quantity: 1,
    image: '👗',
    variant: 'Size: M, Color: Blue',
  },
  {
    id: '2',
    seller: 'Fashion Store',
    name: 'Sneakers',
    price: 59.99,
    originalPrice: 79.99,
    quantity: 1,
    image: '👟',
    variant: 'Size: 9',
  },
  {
    id: '3',
    seller: 'Beauty Shop',
    name: 'Lipstick Set',
    price: 24.99,
    quantity: 2,
    image: '💄',
    variant: 'Color: Red Collection',
    fromLive: true,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectAll, setSelectAll] = useState(true);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>{t('cartEmpty')}</Text>
        <TouchableOpacity style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cartTitle')}</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Live Stream Items */}
        {cartItems.some((item) => item.fromLive) && (
          <View style={styles.section}>
            <View style={styles.liveHeader}>
              <Text style={styles.liveTitle}>🔴 From Live Streams</Text>
              <Text style={styles.liveTimer}>⏰ 2h 30m left</Text>
            </View>
            {cartItems
              .filter((item) => item.fromLive)
              .map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
          </View>
        )}

        {/* Regular Items Grouped by Seller */}
        {Object.entries(groupedItems).map(([seller, items]) => (
          <View key={seller} style={styles.section}>
            <View style={styles.sellerHeader}>
              <Text style={styles.sellerName}>🏪 {seller}</Text>
            </View>
            {items
              .filter((item) => !item.fromLive)
              .map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
          </View>
        ))}

        {/* Voucher Section */}
        <View style={styles.section}>
          <View style={styles.voucherRow}>
            <Text style={styles.voucherIcon}>🎟️</Text>
            <TextInput
              style={styles.voucherInput}
              placeholder="Enter voucher code"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggested Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You May Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.suggestedItem}>
                <View style={styles.suggestedImage}>
                  <Text style={styles.suggestedIcon}>🎁</Text>
                </View>
                <Text style={styles.suggestedName}>Product {i}</Text>
                <Text style={styles.suggestedPrice}>$19.99</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Checkout Section */}
      <View style={styles.checkoutSection}>
        <View style={styles.selectAllRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSelectAll(!selectAll)}
          >
            <Text style={styles.checkboxIcon}>{selectAll ? '☑️' : '⬜'}</Text>
            <Text style={styles.selectAllText}>Select All ({cartItems.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceDetails}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceDetails}>
            <Text style={styles.priceLabel}>Shipping:</Text>
            <Text style={styles.priceValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout ({cartItems.length})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: (typeof mockCartItems)[0];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <View style={styles.cartItem}>
      <TouchableOpacity style={styles.itemCheckbox}>
        <Text style={styles.checkboxIcon}>☑️</Text>
      </TouchableOpacity>

      <View style={styles.itemImage}>
        <Text style={styles.itemIcon}>{item.image}</Text>
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemVariant}>{item.variant}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.itemOriginalPrice}>${item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.itemActions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, -1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onRemove(item.id)}>
            <Text style={styles.removeButton}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    fontSize: 16,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 16,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  liveTimer: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  sellerHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemCheckbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 40,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 8,
  },
  itemOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantity: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  removeButton: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voucherIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestedItem: {
    width: 100,
    marginRight: 12,
  },
  suggestedImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestedIcon: {
    fontSize: 40,
  },
  suggestedName: {
    fontSize: 12,
    marginBottom: 4,
  },
  suggestedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  checkoutSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  selectAllRow: {
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 14,
    marginLeft: 8,
  },
  priceRow: {
    marginBottom: 12,
  },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  checkoutButton: {
    backgroundColor: '#6C5CE7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});
