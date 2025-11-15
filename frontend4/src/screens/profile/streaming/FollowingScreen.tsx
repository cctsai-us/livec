import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { t } from '../../../i18n';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isLive: boolean;
  followers: number;
}

const mockFollowing: User[] = [
  {
    id: '1',
    name: 'Fashion Store',
    username: '@fashionstore',
    avatar: '👗',
    isLive: true,
    followers: 12500,
  },
  {
    id: '2',
    name: 'Beauty Queen',
    username: '@beautyqueen',
    avatar: '💄',
    isLive: false,
    followers: 8900,
  },
  {
    id: '3',
    name: 'Tech Guru',
    username: '@techguru',
    avatar: '📱',
    isLive: false,
    followers: 25000,
  },
  {
    id: '4',
    name: 'Sneaker Head',
    username: '@sneakerhead',
    avatar: '👟',
    isLive: true,
    followers: 15200,
  },
];

export default function FollowingScreen({ navigation }: any) {
  const [following, setFollowing] = useState<User[]>(mockFollowing);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFollowing = following.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnfollow = (userId: string) => {
    setFollowing(following.filter((user) => user.id !== userId));
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('following')} ({following.length})</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchFollowing')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Following List */}
      {filteredFollowing.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? t('noUsersFound') : t('notFollowingAnyone')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFollowing}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleUserPress(item.id)}
            >
              <View style={styles.userAvatar}>
                <Text style={styles.avatarIcon}>{item.avatar}</Text>
                {item.isLive && <View style={styles.liveBadge} />}
              </View>

              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{item.name}</Text>
                  {item.isLive && (
                    <View style={styles.liveTag}>
                      <Text style={styles.liveTagText}>LIVE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userUsername}>{item.username}</Text>
                <Text style={styles.userFollowers}>
                  {item.followers >= 1000
                    ? `${(item.followers / 1000).toFixed(1)}K`
                    : item.followers}{' '}
                  {t('followers')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.unfollowButton}
                onPress={() => handleUnfollow(item.id)}
              >
                <Text style={styles.unfollowButtonText}>{t('following')}</Text>
              </TouchableOpacity>
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
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
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
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 28,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  liveTag: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userFollowers: {
    fontSize: 13,
    color: '#999',
  },
  unfollowButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  unfollowButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
