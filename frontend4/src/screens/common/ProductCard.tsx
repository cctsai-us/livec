import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
  onPress?: () => void;
  onAddToCart?: () => void;
  variant?: 'grid' | 'list';
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  image,
  onPress,
  onAddToCart,
  variant = 'grid',
}: ProductCardProps) {
  if (variant === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress}>
        <View style={styles.listImage}>
          <Text style={styles.listIcon}>{image}</Text>
          {originalPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                -{Math.round((1 - price / originalPrice) * 100)}%
              </Text>
            </View>
          )}
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.listPriceRow}>
            <Text style={styles.listPrice}>${price.toFixed(2)}</Text>
            {originalPrice && (
              <Text style={styles.listOriginalPrice}>${originalPrice.toFixed(2)}</Text>
            )}
          </View>
          {rating && (
            <View style={styles.rating}>
              <Text style={styles.ratingStars}>⭐</Text>
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}
        </View>
        {onAddToCart && (
          <TouchableOpacity style={styles.listAddButton} onPress={onAddToCart}>
            <Text style={styles.listAddButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress}>
      <View style={styles.gridImage}>
        <Text style={styles.gridIcon}>{image}</Text>
        {originalPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>
              -{Math.round((1 - price / originalPrice) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.gridName} numberOfLines={2}>
        {name}
      </Text>
      <View style={styles.gridPriceRow}>
        <Text style={styles.gridPrice}>${price.toFixed(2)}</Text>
        {originalPrice && (
          <Text style={styles.gridOriginalPrice}>${originalPrice.toFixed(2)}</Text>
        )}
      </View>
      {rating && (
        <View style={styles.rating}>
          <Text style={styles.ratingStars}>⭐</Text>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      )}
      {onAddToCart && (
        <TouchableOpacity style={styles.gridAddButton} onPress={onAddToCart}>
          <Text style={styles.gridAddButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid variant
  gridCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  gridImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 50,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    height: 36,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 6,
  },
  gridOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  gridAddButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  gridAddButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // List variant
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  listImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listIcon: {
    fontSize: 40,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 8,
  },
  listOriginalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  listAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listAddButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Common
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
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
});
