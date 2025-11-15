import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { t } from '../../../i18n';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+886 912 345 678',
    address: '123 Main St, Apt 4B, Taipei City, 10001',
    isDefault: true,
  },
  {
    id: '2',
    name: 'John Doe (Office)',
    phone: '+886 912 345 678',
    address: '456 Business Ave, Floor 8, Taipei City, 10002',
    isDefault: false,
  },
];

export default function AddressBookScreen({ navigation }: any) {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const handleEdit = (addressId: string) => {
    navigation.navigate('EditAddress', { addressId });
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      t('deleteAddress'),
      t('deleteAddressConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter((addr) => addr.id !== addressId));
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    navigation.navigate('EditAddress', { addressId: null });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addressBook')}</Text>
        <TouchableOpacity onPress={handleAddNew}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>{t('noAddressesSaved')}</Text>
            <TouchableOpacity style={styles.addNewButton} onPress={handleAddNew}>
              <Text style={styles.addNewButtonText}>{t('addNewAddress')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>{t('default')}</Text>
                  </View>
                )}

                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                </View>

                <View style={styles.addressActions}>
                  {!address.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(address.id)}
                    >
                      <Text style={styles.actionButtonText}>{t('setAsDefault')}</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleEdit(address.id)}
                    >
                      <Text style={styles.iconButtonText}>✏️ {t('edit')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.iconButton, styles.deleteButton]}
                      onPress={() => handleDelete(address.id)}
                    >
                      <Text style={[styles.iconButtonText, styles.deleteButtonText]}>
                        🗑️ {t('delete')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addAddressCard} onPress={handleAddNew}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addText}>{t('addNewAddress')}</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  addButton: {
    fontSize: 32,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
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
  addNewButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressInfo: {
    marginBottom: 16,
    paddingRight: 80,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    flex: 1,
    paddingVertical: 8,
  },
  iconButtonText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {},
  deleteButtonText: {
    color: '#FF6B6B',
  },
  addAddressCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  addIcon: {
    fontSize: 32,
    color: '#6C5CE7',
    marginBottom: 8,
  },
  addText: {
    fontSize: 15,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
