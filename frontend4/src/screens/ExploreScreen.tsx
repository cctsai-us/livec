import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { t } from '../i18n';

const { width } = Dimensions.get('window');

const mockLiveStreams = [
  { id: '1', streamer: '@fashionista', viewers: 12500, category: 'Fashion', image: '👗' },
  { id: '2', streamer: '@beautyguru', viewers: 8200, category: 'Beauty', image: '💄' },
  { id: '3', streamer: '@techreview', viewers: 5800, category: 'Electronics', image: '📱' },
  { id: '4', streamer: '@foodie', viewers: 3200, category: 'Food', image: '🍜' },
];

const mockProducts = [
  { id: '1', name: 'Summer Dress', price: 29.99, originalPrice: 49.99, rating: 4.5, image: '👗' },
  { id: '2', name: 'Sneakers', price: 59.99, rating: 4.8, image: '👟' },
  { id: '3', name: 'Lipstick Set', price: 24.99, originalPrice: 34.99, rating: 4.7, image: '💄' },
  { id: '4', name: 'Wireless Earbuds', price: 79.99, rating: 4.6, image: '🎧' },
];

const categories = [
  { id: '1', name: 'Beauty', icon: '💄', color: '#FFB6C1' },
  { id: '2', name: 'Fashion', icon: '👗', color: '#DDA0DD' },
  { id: '3', name: 'Electronics', icon: '📱', color: '#87CEEB' },
  { id: '4', name: 'Food', icon: '🍜', color: '#FFD700' },
  { id: '5', name: 'Fitness', icon: '💪', color: '#90EE90' },
  { id: '6', name: 'Home', icon: '🏠', color: '#F0E68C' },
];

const mockStreamers = [
  { id: '1', name: 'Fashion Queen', handle: '@fashionista', followers: 125000, image: '👑' },
  { id: '2', name: 'Beauty Guru', handle: '@beautyguru', followers: 98000, image: '✨' },
  { id: '3', name: 'Tech Expert', handle: '@techreview', followers: 76000, image: '🤓' },
];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<'live' | 'products' | 'categories' | 'streamers'>('live');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('exploreTitle')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search live streams, products, streamers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'live' && styles.tabActive]}
            onPress={() => setActiveTab('live')}
          >
            <Text style={[styles.tabText, activeTab === 'live' && styles.tabTextActive]}>
              🔴 Live
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.tabActive]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
              🛍️ Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
            onPress={() => setActiveTab('categories')}
          >
            <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
              📂 Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'streamers' && styles.tabActive]}
            onPress={() => setActiveTab('streamers')}
          >
            <Text style={[styles.tabText, activeTab === 'streamers' && styles.tabTextActive]}>
              ⭐ Streamers
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'live' && <LiveTab streams={mockLiveStreams} />}
        {activeTab === 'products' && <ProductsTab products={mockProducts} />}
        {activeTab === 'categories' && <CategoriesTab categories={categories} />}
        {activeTab === 'streamers' && <StreamersTab streamers={mockStreamers} />}
      </ScrollView>
    </View>
  );
}

// Live Streams Tab
function LiveTab({ streams }: { streams: typeof mockLiveStreams }) {
  return (
    <View style={styles.gridContainer}>
      {streams.map((stream) => (
        <TouchableOpacity key={stream.id} style={styles.liveCard}>
          <View style={styles.liveCardImage}>
            <Text style={styles.liveCardIcon}>{stream.image}</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>🔴 LIVE</Text>
            </View>
            <View style={styles.viewersBadge}>
              <Text style={styles.viewersBadgeText}>👁️ {(stream.viewers / 1000).toFixed(1)}K</Text>
            </View>
          </View>
          <View style={styles.liveCardInfo}>
            <Text style={styles.liveCardStreamer}>{stream.streamer}</Text>
            <Text style={styles.liveCardCategory}>{stream.category}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Products Tab
function ProductsTab({ products }: { products: typeof mockProducts }) {
  return (
    <View style={styles.productsContainer}>
      {products.map((product) => (
        <TouchableOpacity key={product.id} style={styles.productCard}>
          <View style={styles.productCardImage}>
            <Text style={styles.productCardIcon}>{product.image}</Text>
            {product.originalPrice && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.productCardName} numberOfLines={2}>{product.name}</Text>
          <View style={styles.productCardPriceRow}>
            <Text style={styles.productCardPrice}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.productCardOriginalPrice}>${product.originalPrice}</Text>
            )}
          </View>
          <View style={styles.productCardRating}>
            <Text style={styles.ratingStars}>⭐</Text>
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>+ Add</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Categories Tab
function CategoriesTab({ categories }: { categories: typeof categories }) {
  return (
    <View style={styles.categoriesContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Searches</Text>
        <View style={styles.tagContainer}>
          {['Summer Fashion', 'Skincare', 'Gadgets', 'Healthy Food', 'Yoga'].map((tag) => (
            <TouchableOpacity key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Streamers Tab
function StreamersTab({ streamers }: { streamers: typeof mockStreamers }) {
  return (
    <View style={styles.streamersContainer}>
      <Text style={styles.sectionTitle}>Popular Streamers</Text>
      {streamers.map((streamer) => (
        <TouchableOpacity key={streamer.id} style={styles.streamerCard}>
          <View style={styles.streamerAvatar}>
            <Text style={styles.streamerAvatarIcon}>{streamer.image}</Text>
          </View>
          <View style={styles.streamerInfo}>
            <Text style={styles.streamerName}>{streamer.name}</Text>
            <Text style={styles.streamerHandle}>{streamer.handle}</Text>
            <Text style={styles.streamerFollowers}>
              {(streamer.followers / 1000).toFixed(0)}K followers
            </Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6C5CE7',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    paddingVertical: 10,
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 4,
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
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  tabTextActive: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  liveCard: {
    width: (width - 36) / 2,
    marginBottom: 16,
    marginHorizontal: 6,
  },
  liveCardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveCardIcon: {
    fontSize: 60,
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewersBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewersBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  liveCardInfo: {
    marginTop: 8,
  },
  liveCardStreamer: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  liveCardCategory: {
    fontSize: 12,
    color: '#666',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  productCard: {
    width: (width - 36) / 2,
    marginBottom: 16,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  productCardImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCardIcon: {
    fontSize: 50,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productCardName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    height: 36,
  },
  productCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productCardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 6,
  },
  productCardOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  productCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStars: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 48) / 2,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#6C5CE7',
  },
  streamersContainer: {
    padding: 16,
  },
  streamerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  streamerAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streamerAvatarIcon: {
    fontSize: 30,
  },
  streamerInfo: {
    flex: 1,
  },
  streamerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  streamerHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  streamerFollowers: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
