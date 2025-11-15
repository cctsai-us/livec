import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ProductList from '../../common/ProductList';
import { t } from '../../../i18n';

const mockRecentProducts = [
  {
    id: '1',
    name: 'Summer Dress',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.5,
    image: '👗',
  },
  {
    id: '2',
    name: 'Sneakers',
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.8,
    image: '👟',
  },
  {
    id: '3',
    name: 'Lipstick Set',
    price: 24.99,
    rating: 4.6,
    image: '💄',
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.7,
    image: '🎧',
  },
  {
    id: '5',
    name: 'Sunglasses',
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.3,
    image: '🕶️',
  },
  {
    id: '6',
    name: 'Perfume',
    price: 69.99,
    rating: 4.5,
    image: '🌸',
  },
];

export default function RecentlyViewedScreen({ navigation }: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [recentItems, setRecentItems] = useState(mockRecentProducts);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Add to cart logic
  };

  const handleClearAll = () => {
    Alert.alert(
      t('clearHistory'),
      t('clearHistoryConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: () => setRecentItems([]),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('recentlyViewed')}</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          <Text style={styles.viewModeButton}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
        </TouchableOpacity>
      </View>

      {recentItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👁️</Text>
          <Text style={styles.emptyTitle}>{t('noRecentItems')}</Text>
          <Text style={styles.emptyText}>
            {t('recentViewMessage')}
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Text style={styles.browseButtonText}>{t('startShopping')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Action Bar */}
          <View style={styles.actionBar}>
            <Text style={styles.itemCount}>{recentItems.length} {t('items')}</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearButton}>{t('clearAll')}</Text>
            </TouchableOpacity>
          </View>

          {/* Recently Viewed Items */}
          <ProductList
            products={recentItems}
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
    lineHeight: 22,
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
  clearButton: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
