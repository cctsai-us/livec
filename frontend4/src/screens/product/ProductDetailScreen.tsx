import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { t } from '../../i18n';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }: any) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');

  // Mock product data - in production would come from route params or API
  const product = {
    id: route.params?.productId || '1',
    name: 'Premium Summer Dress',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.5,
    reviews: 234,
    image: '👗',
    seller: 'Fashion Store',
    sellerRating: 4.8,
    sold: 1234,
    stock: 50,
    description:
      'Beautiful summer dress made from premium quality fabric. Perfect for casual outings and beach parties. Breathable and comfortable to wear all day long.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Red', 'White', 'Black'],
    features: [
      'Premium quality fabric',
      'Machine washable',
      'Quick dry technology',
      'UV protection',
    ],
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Text>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Text>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.productImageIcon}>{product.image}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistIcon}>♡</Text>
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>⭐</Text>
            <Text style={styles.rating}>
              {product.rating} ({product.reviews} reviews)
            </Text>
            <Text style={styles.sold}>• {product.sold} sold</Text>
          </View>
        </View>

        {/* Product Name */}
        <View style={styles.nameSection}>
          <Text style={styles.productName}>{product.name}</Text>
        </View>

        {/* Seller Info */}
        <TouchableOpacity style={styles.sellerSection}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerIcon}>🏪</Text>
            </View>
            <View>
              <Text style={styles.sellerName}>{product.seller}</Text>
              <View style={styles.sellerRating}>
                <Text style={styles.sellerRatingText}>⭐ {product.sellerRating}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('size')}</Text>
          <View style={styles.variantRow}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.variantButton,
                  selectedVariant === size && styles.variantButtonActive,
                ]}
                onPress={() => setSelectedVariant(size)}
              >
                <Text
                  style={[
                    styles.variantText,
                    selectedVariant === size && styles.variantTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('color')}</Text>
          <View style={styles.variantRow}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.variantButton,
                  selectedColor === color && styles.variantButtonActive,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text
                  style={[
                    styles.variantText,
                    selectedColor === color && styles.variantTextActive,
                  ]}
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('description')}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('features')}</Text>
          {product.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>{t('reviews')} ({product.reviews})</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>{t('viewAll')} ›</Text>
            </TouchableOpacity>
          </View>
          {/* Add review items here */}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>{t('addToCart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>{t('buyNow')}</Text>
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
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 28,
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    fontSize: 20,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImageIcon: {
    fontSize: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistIcon: {
    fontSize: 24,
    color: '#FF6B6B',
  },
  priceSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  sold: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  nameSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
  },
  sellerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerIcon: {
    fontSize: 20,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerRatingText: {
    fontSize: 12,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  variantButtonActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#F0EDFF',
  },
  variantText: {
    fontSize: 14,
    color: '#666',
  },
  variantTextActive: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 14,
    color: '#6C5CE7',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: '#6C5CE7',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#F0EDFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  addToCartText: {
    color: '#6C5CE7',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
