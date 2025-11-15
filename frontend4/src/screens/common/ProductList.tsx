import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
}

interface ProductListProps {
  products: Product[];
  variant?: 'grid' | 'list';
  onProductPress?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  numColumns?: number;
}

export default function ProductList({
  products,
  variant = 'grid',
  onProductPress,
  onAddToCart,
  numColumns = 2,
}: ProductListProps) {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      id={item.id}
      name={item.name}
      price={item.price}
      originalPrice={item.originalPrice}
      rating={item.rating}
      image={item.image}
      variant={variant}
      onPress={() => onProductPress?.(item.id)}
      onAddToCart={() => onAddToCart?.(item.id)}
    />
  );

  if (variant === 'list') {
    return (
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
      contentContainerStyle={styles.gridContainer}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  listContainer: {
    padding: 16,
  },
});
