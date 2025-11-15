import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import ProductList from '../common/ProductList';
import { t } from '../../i18n';

type SortOption = 'popular' | 'price_low' | 'price_high' | 'newest' | 'rating';

const mockProducts = [
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
    name: 'Designer Handbag',
    price: 149.99,
    originalPrice: 249.99,
    rating: 4.9,
    image: '👜',
  },
  {
    id: '6',
    name: 'Smart Watch',
    price: 199.99,
    rating: 4.4,
    image: '⌚',
  },
];

export default function ProductListScreen({ navigation, route }: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const category = route.params?.category || t('productList');

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Add to cart logic
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'popular':
        return 'Most Popular';
      case 'price_low':
        return 'Price: Low to High';
      case 'price_high':
        return 'Price: High to Low';
      case 'newest':
        return 'Newest';
      case 'rating':
        return 'Top Rated';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          <Text style={styles.viewModeButton}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('search') + '...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Sort and Filter Bar */}
      <View style={styles.toolBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['popular', 'price_low', 'price_high', 'newest', 'rating'] as SortOption[]).map(
            (option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
                onPress={() => setSortBy(option)}
              >
                <Text
                  style={[styles.sortChipText, sortBy === option && styles.sortChipTextActive]}
                >
                  {getSortLabel(option)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterTitle}>Filters</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceInputs}>
              <TextInput style={styles.priceInput} placeholder="Min" keyboardType="numeric" />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput style={styles.priceInput} placeholder="Max" keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Rating</Text>
            <View style={styles.ratingOptions}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <TouchableOpacity key={stars} style={styles.ratingOption}>
                  <Text style={styles.ratingStars}>
                    {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
                  </Text>
                  <Text style={styles.ratingLabel}>{stars}+ stars</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>{t('clearAll')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Products Grid/List */}
      <View style={styles.productsContainer}>
        <Text style={styles.resultCount}>{mockProducts.length} {t('productList')}</Text>
        <ProductList
          products={mockProducts}
          variant={viewMode}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />
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
  viewModeButton: {
    fontSize: 24,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  toolBar: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  sortChipActive: {
    backgroundColor: '#6C5CE7',
  },
  sortChipText: {
    fontSize: 13,
    color: '#666',
  },
  sortChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filtersPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
  },
  ratingOptions: {
    gap: 8,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ratingStars: {
    fontSize: 14,
    marginRight: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  productsContainer: {
    flex: 1,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
