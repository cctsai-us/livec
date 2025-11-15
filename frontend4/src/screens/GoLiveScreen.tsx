import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { t } from '../i18n';

const categories = ['Beauty', 'Fashion', 'Electronics', 'Food', 'Fitness', 'Home'];

const mockProducts = [
  { id: '1', name: 'Summer Dress', price: 29.99, image: '👗' },
  { id: '2', name: 'Sneakers', price: 59.99, image: '👟' },
];

export default function GoLiveScreen() {
  const [streamTitle, setStreamTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Fashion');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [enableShopping, setEnableShopping] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(mockProducts);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('goLiveTitle')}</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Camera Preview */}
        <View style={styles.cameraPreview}>
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewIcon}>📹</Text>
            <Text style={styles.previewText}>Camera Preview</Text>
          </View>

          {/* Camera Controls Overlay */}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setCameraFacing(cameraFacing === 'front' ? 'back' : 'front')}
            >
              <Text style={styles.controlIcon}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>✨</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>💡</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stream Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stream Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Give your stream a catchy title..."
              value={streamTitle}
              onChangeText={setStreamTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{streamTitle.length}/100</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell viewers what this stream is about..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {selectedProducts.length === 0 ? (
            <View style={styles.emptyProducts}>
              <Text style={styles.emptyIcon}>🛍️</Text>
              <Text style={styles.emptyText}>No products added yet</Text>
              <TouchableOpacity style={styles.addProductButton}>
                <Text style={styles.addProductButtonText}>Add Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Text style={styles.productIcon}>{product.image}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
                <TouchableOpacity style={styles.removeProductButton}>
                  <Text style={styles.removeProductIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Audience Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Public Stream</Text>
              <Text style={styles.settingDescription}>
                Anyone can find and watch your stream
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#ccc', true: '#6C5CE7' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Allow Comments</Text>
              <Text style={styles.settingDescription}>
                Viewers can chat during your stream
              </Text>
            </View>
            <Switch
              value={allowComments}
              onValueChange={setAllowComments}
              trackColor={{ false: '#ccc', true: '#6C5CE7' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Shopping</Text>
              <Text style={styles.settingDescription}>
                Viewers can purchase featured products
              </Text>
            </View>
            <Switch
              value={enableShopping}
              onValueChange={setEnableShopping}
              trackColor={{ false: '#ccc', true: '#6C5CE7' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Stream Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for a Great Stream</Text>
          <Text style={styles.tipText}>• Use good lighting and stable internet</Text>
          <Text style={styles.tipText}>• Engage with your viewers</Text>
          <Text style={styles.tipText}>• Showcase products clearly</Text>
          <Text style={styles.tipText}>• Keep your stream lively and fun</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>📅 Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.goLiveButton,
            !streamTitle && styles.goLiveButtonDisabled,
          ]}
          disabled={!streamTitle}
        >
          <Text style={styles.goLiveButtonText}>
            🔴 {t('startLiveStream')}
          </Text>
        </TouchableOpacity>
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
  headerButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  cameraPreview: {
    height: 250,
    backgroundColor: '#000',
    position: 'relative',
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  previewText: {
    color: '#fff',
    fontSize: 16,
  },
  cameraControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlIcon: {
    fontSize: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6C5CE7',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyProducts: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  addProductButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addProductButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productIcon: {
    fontSize: 30,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  removeProductButton: {
    padding: 8,
  },
  removeProductIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  tipsSection: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goLiveButton: {
    flex: 2,
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  goLiveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  goLiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
