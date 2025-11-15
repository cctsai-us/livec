import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { t } from '../../../i18n';

type StreamStatus = 'all' | 'live' | 'scheduled' | 'past';

const mockStreams = [
  {
    id: '1',
    title: 'Summer Fashion Haul 2025',
    status: 'past',
    viewers: 1234,
    duration: '1h 23m',
    date: '2025-01-13',
    thumbnail: '👗',
    revenue: 456.78,
  },
  {
    id: '2',
    title: 'Beauty Products Review',
    status: 'scheduled',
    scheduledTime: '2025-01-15 19:00',
    thumbnail: '💄',
  },
  {
    id: '3',
    title: 'New Year Sale Live!',
    status: 'past',
    viewers: 2341,
    duration: '2h 15m',
    date: '2025-01-10',
    thumbnail: '🎉',
    revenue: 1234.56,
  },
];

export default function MyLiveStreamsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<StreamStatus>('all');

  const tabs = [
    { key: 'all', label: t('all') },
    { key: 'live', label: t('live') },
    { key: 'scheduled', label: t('scheduled') },
    { key: 'past', label: t('past') },
  ];

  const filteredStreams =
    activeTab === 'all'
      ? mockStreams
      : mockStreams.filter((stream) => stream.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return { text: t('live'), color: '#FF6B6B' };
      case 'scheduled':
        return { text: t('scheduled'), color: '#6C5CE7' };
      case 'past':
        return { text: t('ended'), color: '#999' };
      default:
        return { text: status, color: '#999' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myLiveStreams')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('GoLive')}>
          <Text style={styles.goLiveButton}>📹</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>{t('totalStreams')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>15.2K</Text>
          <Text style={styles.statLabel}>{t('totalViews')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>$3,456</Text>
          <Text style={styles.statLabel}>{t('totalRevenue')}</Text>
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
            onPress={() => setActiveTab(tab.key as StreamStatus)}
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

      {/* Streams List */}
      {filteredStreams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📹</Text>
          <Text style={styles.emptyText}>{t('noStreamsFound')}</Text>
          <TouchableOpacity
            style={styles.goLiveButtonLarge}
            onPress={() => navigation.navigate('GoLive')}
          >
            <Text style={styles.goLiveButtonText}>{t('startFirstStream')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredStreams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.streamCard}
              onPress={() =>
                navigation.navigate('StreamDetail', { streamId: item.id })
              }
            >
              <View style={styles.streamThumbnail}>
                <Text style={styles.thumbnailIcon}>{item.thumbnail}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBadge(item.status).color },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {getStatusBadge(item.status).text}
                  </Text>
                </View>
              </View>

              <View style={styles.streamInfo}>
                <Text style={styles.streamTitle}>{item.title}</Text>

                {item.status === 'scheduled' && (
                  <Text style={styles.streamTime}>⏰ {item.scheduledTime}</Text>
                )}

                {item.status === 'past' && (
                  <>
                    <View style={styles.streamStats}>
                      <Text style={styles.streamStat}>👁️ {item.viewers} {t('viewers')}</Text>
                      <Text style={styles.streamStat}>⏱️ {item.duration}</Text>
                    </View>
                    <Text style={styles.streamRevenue}>
                      {t('revenue')}: ${item.revenue?.toFixed(2)}
                    </Text>
                    <Text style={styles.streamDate}>{item.date}</Text>
                  </>
                )}
              </View>

              <View style={styles.streamActions}>
                {item.status === 'scheduled' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{t('edit')}</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'past' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{t('review')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
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
  goLiveButton: {
    fontSize: 24,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
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
  goLiveButtonLarge: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  goLiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  streamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  streamThumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailIcon: {
    fontSize: 80,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streamInfo: {
    padding: 16,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  streamTime: {
    fontSize: 14,
    color: '#6C5CE7',
    marginBottom: 4,
  },
  streamStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  streamStat: {
    fontSize: 13,
    color: '#666',
  },
  streamRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  streamDate: {
    fontSize: 12,
    color: '#999',
  },
  streamActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
    alignItems: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  actionButtonText: {
    color: '#6C5CE7',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
