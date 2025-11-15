import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    // Navigation will automatically switch to Login screen due to auth state
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profileTitle')}</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {isLoggedIn ? user?.name?.charAt(0).toUpperCase() : '👤'}
            </Text>
          </View>
        </View>

        {!isLoggedIn ? (
          <View style={styles.userInfo}>
            <Text style={styles.username}>{t('guestUser')}</Text>
            <Text style={styles.guestMessage}>{t('loginToUnlock')}</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => (navigation as any).navigate('Login')}
            >
              <Text style={styles.loginButtonText}>{t('loginRegister')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.name || 'User'}</Text>
              <Text style={styles.userId}>@{user?.username || 'username'}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => (navigation as any).navigate('EditProfile')}>
                <Text style={styles.editButtonText}>{t('editProfile')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.stat} onPress={() => (navigation as any).navigate('Following')}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>{t('following')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat} onPress={() => (navigation as any).navigate('Followers')}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>{t('followers')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Orders Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('myOrders')}</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('MyOrders')}>
            <Text style={styles.viewAll}>{t('viewAll')} →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orderStatusRow}>
          {[
            { icon: '💳', labelKey: 'toPay', count: 0 },
            { icon: '📦', labelKey: 'toShip', count: 0 },
            { icon: '🚚', labelKey: 'toReceive', count: 0 },
            { icon: '⭐', labelKey: 'toReview', count: 0 },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.orderStatus} onPress={() => (navigation as any).navigate('MyOrders')}>
              <View style={styles.orderIconContainer}>
                <Text style={styles.orderIcon}>{item.icon}</Text>
                {item.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.count}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.orderLabel}>{t(item.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Shopping Section */}
      <View style={styles.menuSection}>
        <MenuItem icon="❤️" title={t('wishlist')} badge={0} onPress={() => (navigation as any).navigate('Wishlist')} />
        <MenuItem icon="👁️" title={t('recentlyViewed')} onPress={() => (navigation as any).navigate('RecentlyViewed')} />
        <MenuItem icon="🎟️" title={t('vouchersAndCoupons')} badge={3} onPress={() => (navigation as any).navigate('Vouchers')} />
        <MenuItem icon="🎁" title={t('pointsRewards')} value={`0 ${t('pts')}`} />
      </View>

      {/* Live Streaming Section */}
      <View style={styles.menuSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('liveStreaming')}</Text>
        </View>
        <MenuItem icon="📹" title={t('myLiveStreams')} onPress={() => (navigation as any).navigate('MyLiveStreams')} />
        <MenuItem icon="📊" title={t('streamAnalytics')} onPress={() => (navigation as any).navigate('StreamAnalytics')} />
        <MenuItem icon="💰" title={t('earningsWallet')} onPress={() => (navigation as any).navigate('Wallet')} />
      </View>

      {/* Account Settings */}
      <View style={styles.menuSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
        </View>
        <MenuItem icon="💳" title={t('paymentMethods')} onPress={() => (navigation as any).navigate('PaymentMethods')} />
        <MenuItem icon="📍" title={t('shippingAddresses')} onPress={() => (navigation as any).navigate('AddressBook')} />
        <MenuItem icon="🌐" title={t('language')} onPress={() => (navigation as any).navigate('LanguageSettings')} />
        <MenuItem icon="🔔" title={t('notifications')} />
        <MenuItem icon="🔒" title={t('privacySecurity')} />
      </View>

      {/* Help & Support */}
      <View style={styles.menuSection}>
        <MenuItem icon="❓" title={t('helpCenter')} />
        <MenuItem icon="💬" title={t('customerService')} />
        <MenuItem icon="📄" title={t('termsConditions')} />
        <MenuItem icon="ℹ️" title={t('about')} value="v1.0.0" />
      </View>

      {/* Logout Button - Only show if logged in */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  badge,
  value,
  onPress,
}: {
  icon: string;
  title: string;
  badge?: number;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuTitle}>{title}</Text>
        {badge !== undefined && badge > 0 && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
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
  userSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  guestMessage: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    color: '#6C5CE7',
  },
  orderStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderStatus: {
    alignItems: 'center',
    flex: 1,
  },
  orderIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  orderIcon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    color: '#333',
  },
  menuBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
