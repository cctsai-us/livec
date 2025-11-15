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
  isFollowingBack: boolean;
  followers: number;
}

const mockFollowers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: '@johndoe',
    avatar: '👨',
    isFollowingBack: true,
    followers: 450,
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: '@janesmith',
    avatar: '👩',
    isFollowingBack: false,
    followers: 1200,
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: '@mikechen',
    avatar: '👦',
    isFollowingBack: true,
    followers: 850,
  },
  {
    id: '4',
    name: 'Sarah Lee',
    username: '@sarahlee',
    avatar: '👧',
    isFollowingBack: false,
    followers: 2300,
  },
];

export default function FollowersScreen({ navigation }: any) {
  const [followers, setFollowers] = useState<User[]>(mockFollowers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFollowers = followers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowBack = (userId: string) => {
    setFollowers(
      followers.map((user) =>
        user.id === userId ? { ...user, isFollowingBack: !user.isFollowingBack } : user
      )
    );
  };

  const handleRemoveFollower = (userId: string) => {
    setFollowers(followers.filter((user) => user.id !== userId));
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
        <Text style={styles.headerTitle}>{t('followers')} ({followers.length})</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchFollowers')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Followers List */}
      {filteredFollowers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? t('noUsersFound') : t('noFollowers')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFollowers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleUserPress(item.id)}
            >
              <View style={styles.userAvatar}>
                <Text style={styles.avatarIcon}>{item.avatar}</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userUsername}>{item.username}</Text>
                <Text style={styles.userFollowers}>
                  {item.followers >= 1000
                    ? `${(item.followers / 1000).toFixed(1)}K`
                    : item.followers}{' '}
                  {t('followers')}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.followButton,
                  item.isFollowingBack && styles.followingButton,
                ]}
                onPress={() => handleFollowBack(item.id)}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    item.isFollowingBack && styles.followingButtonText,
                  ]}
                >
                  {item.isFollowingBack ? t('following') : t('followBack')}
                </Text>
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
  },
  avatarIcon: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#6C5CE7',
  },
  followButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followingButtonText: {
    color: '#666',
  },
});
