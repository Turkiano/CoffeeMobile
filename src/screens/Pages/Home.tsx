import React, { useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Text,
} from "react-native";
import { Card, Button, ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { ProductTypes } from "../../types";
import api from "../../services/api";
import { GlobalContext, useGlobalContext } from "../../context/GlobalContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  ProductDetails: { productId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/**
 * Home Screen
 * Displays featured products with search filtering and add to cart functionality
 */
export const Home: React.FC<Props> = ({ navigation }) => {
  const { handleAddToCart, searchBy } = useGlobalContext();

  const getProducts = async (): Promise<ProductTypes[]> => {
    const res = await api.get("/products");
    return res.data;
  };

  // Using React Query for data fetching
  const { data, error, isLoading } = useQuery<ProductTypes[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Filter products based on search input
  const filteredProducts = data?.filter((product) =>
    product.name.toLowerCase().includes(searchBy.toLowerCase()),
  );

  const renderProductCard = ({ item }: { item: ProductTypes }) => (
    <Card style={styles.productCard}>
      <Card.Cover style={styles.image} source={{ uri: item.image }} />
      <Card.Title title={item.name} subtitle={`SAR ${item.price}`} />
      <Card.Content>
        <Text style={styles.description}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate("ProductDetails", {
              productId: item.productId,
            })
          }
        >
          Details
        </Button>
        <Button
          mode="contained"
          onPress={() => handleAddToCart(item)}
          style={styles.addButton}
        >
          Add 🛒
        </Button>
      </Card.Actions>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Loading products...</Text>
        <Text style={styles.loadingText}>Less than 60 seconds</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section - TODO: Add hero component */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Welcome to Coffee Mobile</Text>
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Products</Text>

        {filteredProducts?.length === 0 && (
          <Text style={styles.noProductsText}>
            No products found, search for other names
          </Text>
        )}

        {error && (
          <Text style={styles.errorText}>
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        )}

        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.productId}
          scrollEnabled={false}
          numColumns={1}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Promo Section - TODO: Add promo component */}
      <View style={styles.promoSection}>
        <Text style={styles.promoText}>Special Offers Coming Soon!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141e20",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141e20",
  },
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#1a2a2d",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  productsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  image: {
    height: 200,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  addButton: {
    marginLeft: 8,
  },
  noProductsText: {
    fontSize: 16,
    color: "#4ade80",
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
  promoSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#1a2a2d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  promoText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
