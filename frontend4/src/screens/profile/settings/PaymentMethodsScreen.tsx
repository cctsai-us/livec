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

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa',
    details: '•••• •••• •••• 1234',
    isDefault: true,
    icon: '💳',
  },
  {
    id: '2',
    type: 'wallet',
    name: 'LINE Pay',
    details: 'Connected',
    isDefault: false,
    icon: '💬',
  },
  {
    id: '3',
    type: 'bank',
    name: 'Bank Transfer',
    details: 'CTBC Bank •••• 5678',
    isDefault: false,
    icon: '🏦',
  },
];

export default function PaymentMethodsScreen({ navigation }: any) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    mockPaymentMethods
  );

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleEdit = (methodId: string) => {
    navigation.navigate('EditPaymentMethod', { methodId });
  };

  const handleDelete = (methodId: string) => {
    Alert.alert(
      t('removePaymentMethod'),
      t('removePaymentConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('remove'),
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(
              paymentMethods.filter((method) => method.id !== methodId)
            );
          },
        },
      ]
    );
  };

  const handleAddNew = (type: 'card' | 'bank' | 'wallet') => {
    navigation.navigate('AddPaymentMethod', { type });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('paymentMethods')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView>
        {/* Current Payment Methods */}
        {paymentMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('myPaymentMethods')}</Text>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentCard}>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>{t('default')}</Text>
                  </View>
                )}

                <View style={styles.paymentInfo}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.paymentIcon}>{method.icon}</Text>
                    <View style={styles.paymentDetails}>
                      <Text style={styles.paymentName}>{method.name}</Text>
                      <Text style={styles.paymentNumber}>{method.details}</Text>
                    </View>
                  </View>

                  <View style={styles.paymentActions}>
                    {!method.isDefault && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={styles.actionButtonText}>{t('setAsDefault')}</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleEdit(method.id)}
                      >
                        <Text style={styles.iconButtonText}>✏️ {t('edit')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.iconButton, styles.deleteButton]}
                        onPress={() => handleDelete(method.id)}
                      >
                        <Text style={[styles.iconButtonText, styles.deleteButtonText]}>
                          🗑️ {t('remove')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add New Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('addPaymentMethod')}</Text>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddNew('card')}
          >
            <View style={styles.addMethodIcon}>
              <Text style={styles.addMethodIconText}>💳</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>{t('creditDebitCard')}</Text>
              <Text style={styles.addMethodDescription}>
                {t('creditDebitCardDesc')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddNew('bank')}
          >
            <View style={styles.addMethodIcon}>
              <Text style={styles.addMethodIconText}>🏦</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>{t('bankAccount')}</Text>
              <Text style={styles.addMethodDescription}>{t('bankAccountDesc')}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddNew('wallet')}
          >
            <View style={styles.addMethodIcon}>
              <Text style={styles.addMethodIconText}>📱</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>{t('eWallet')}</Text>
              <Text style={styles.addMethodDescription}>
                {t('eWalletDesc')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            {t('securityNotice')}
          </Text>
        </View>

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
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  paymentInfo: {},
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 80,
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666',
  },
  paymentActions: {
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
  addMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addMethodIconText: {
    fontSize: 24,
  },
  addMethodInfo: {
    flex: 1,
  },
  addMethodName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  addMethodDescription: {
    fontSize: 13,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
  },
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: '#F0EDFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 40,
  },
});
