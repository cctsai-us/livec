import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { t } from '../i18n';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>{t('appName')}</Text>
        <TouchableOpacity>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchPlaceholder}>🔍 {t('searchPlaceholder')}</Text>
      </View>

      {/* Featured Live Stream Hero */}
      <View style={styles.heroLive}>
        <View style={styles.liveVideoPlaceholder}>
          <Text style={styles.liveBadge}>🔴 LIVE</Text>
          <Text style={styles.viewerCount}>12.5K {t('watching')}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.streamerName}>@fashionista_jane</Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>{t('joinLive')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Now Carousel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('liveNow')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.liveCard}>
              <View style={styles.liveCardImage}>
                <Text style={styles.miniLiveBadge}>🔴 LIVE</Text>
              </View>
              <Text style={styles.liveCardTitle}>Stream {item}</Text>
              <Text style={styles.liveCardViews}>8.2K {t('viewers')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {['beauty', 'fashion', 'electronics', 'food', 'fitness', 'homeCategory'].map((cat) => (
          <TouchableOpacity key={cat} style={styles.categoryPill}>
            <Text style={styles.categoryText}>{t(cat)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Upcoming Lives */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('upcomingLives')}</Text>
        {[1, 2].map((item) => (
          <View key={item} style={styles.upcomingCard}>
            <View style={styles.upcomingImage} />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Beauty Product Launch</Text>
              <Text style={styles.upcomingTime}>{t('startsIn')} 2h 30m</Text>
              <TouchableOpacity style={styles.remindButton}>
                <Text style={styles.remindButtonText}>{t('remindMe')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Trending Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('trendingProducts')}</Text>
        <View style={styles.productGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.discountBadge}>-30%</Text>
              </View>
              <Text style={styles.productName}>Product {item}</Text>
              <Text style={styles.productPrice}>$29.99</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>{t('addToCart')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6C5CE7',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationIcon: {
    fontSize: 24,
  },
  searchBar: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchPlaceholder: {
    color: '#999',
  },
  heroLive: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  liveVideoPlaceholder: {
    height: 200,
    justifyContent: 'space-between',
    padding: 12,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
  },
  viewerCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  streamerName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  liveCard: {
    width: 120,
    marginRight: 12,
  },
  liveCardImage: {
    width: 120,
    height: 160,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'flex-start',
    padding: 8,
  },
  miniLiveBadge: {
    alignSelf: 'flex-start',
    fontSize: 10,
  },
  liveCardTitle: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  liveCardViews: {
    fontSize: 12,
    color: '#666',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontWeight: '600',
  },
  upcomingCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  upcomingImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  upcomingTitle: {
    fontWeight: 'bold',
  },
  upcomingTime: {
    color: '#666',
    fontSize: 12,
  },
  remindButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#6C5CE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  remindButtonText: {
    color: '#6C5CE7',
    fontSize: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 8,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B6B',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productName: {
    fontWeight: '600',
    marginTop: 8,
  },
  productPrice: {
    color: '#6C5CE7',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
