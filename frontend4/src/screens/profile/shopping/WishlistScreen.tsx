import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ProductList from '../../common/ProductList';
import { t } from '../../../i18n';

const mockWishlistProducts = [
  {
    id: '1',
    name: 'Designer Handbag',
    price: 149.99,
    originalPrice: 249.99,
    rating: 4.9,
    image: '👜',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    rating: 4.4,
    image: '⌚',
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.7,
    image: '🎧',
  },
  {
    id: '4',
    name: 'Running Shoes',
    price: 89.99,
    originalPrice: 139.99,
    rating: 4.6,
    image: '👟',
  },
];

export default function WishlistScreen({ navigation }: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistItems, setWishlistItems] = useState(mockWishlistProducts);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Add to cart logic
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
  };

  const handleAddAllToCart = () => {
    console.log('Add all to cart');
    // Add all to cart logic
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('wishlist')} ({wishlistItems.length})</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          <Text style={styles.viewModeButton}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
        </TouchableOpacity>
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>{t('yourWishlistEmpty')}</Text>
          <Text style={styles.emptyText}>
            {t('saveItemsMessage')}
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Text style={styles.browseButtonText}>{t('browseProducts')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Action Bar */}
          <View style={styles.actionBar}>
            <Text style={styles.itemCount}>{wishlistItems.length} {t('items')}</Text>
            <TouchableOpacity onPress={handleAddAllToCart}>
              <Text style={styles.addAllButton}>{t('addAllToCart')}</Text>
            </TouchableOpacity>
          </View>

          {/* Wishlist Items */}
          <ProductList
            products={wishlistItems}
            variant={viewMode}
            onProductPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        </>
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
  viewModeButton: {
    fontSize: 24,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  addAllButton: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
});
