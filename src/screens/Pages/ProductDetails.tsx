import React from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductTypes } from "../../types";
import { useGlobalContext } from "../../context/GlobalContext";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

type RootStackParamList = {
  ProductDetails: { productId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

/**
 * Product Details Screen
 * Uses React Query to fetch product by id from route params
 */
export const ProductDetails: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;
  const { handleAddToCart } = useGlobalContext();

  const getProduct = async (): Promise<ProductTypes> => {
    const res = await api.get(`/products/${productId}`);
    return res.data;
  };

  const {
    data: product,
    error,
    isLoading,
  } = useQuery<ProductTypes>({
    queryKey: ["productDetails", productId],
    queryFn: getProduct,
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}

        <Text variant="headlineMedium" style={styles.title}>
          {product.name}
        </Text>

        <Text variant="displayMedium" style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.infoCard}>
          <Text variant="bodySmall">Category ID: {product.categoryId}</Text>
          <Text variant="bodySmall">In Stock: {product.quantity}</Text>
          <Text variant="bodySmall">
            Created: {new Date(product.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => handleAddToCart(product)}
          style={styles.button}
        >
          Add to Cart
        </Button>

        <Button mode="outlined" style={styles.button}>
          View Reviews
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
  price: {
    color: "#6F4E37",
    marginBottom: 15,
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
  },
});
