import React from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { Text, ActivityIndicator, Card } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { ProductTypes } from "../../types";
import api from "../../services/api";
import { useGlobalContext } from "../../context/GlobalContext";

/**
 * AboutUs Screen
 * Displays about information and product search results
 */
export const AboutUs: React.FC = () => {
  const { searchBy } = useGlobalContext();

  const getProducts = async (): Promise<ProductTypes[]> => {
    const res = await api.get("/products");
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const filteredProducts = data?.filter((product: ProductTypes) =>
    product.name.toLowerCase().includes(searchBy.toLowerCase()),
  );

  const renderProductItem = ({ item }: { item: ProductTypes }) => (
    <Card style={styles.productCard}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodySmall">SAR {item.price}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* About Us Content Section - TODO: Add AboutMeSection component */}
      <View style={styles.aboutSection}>
        <Text variant="headlineMedium" style={styles.aboutTitle}>
          About Us
        </Text>

        <Text variant="bodyMedium" style={styles.aboutText}>
          Welcome to CoffeeMobile, your favorite coffee shop experience
          delivered to your mobile device. We're passionate about delivering
          high-quality coffee and exceptional service.
        </Text>

        <View style={styles.missionCard}>
          <Text variant="titleMedium" style={styles.missionTitle}>
            Our Mission
          </Text>
          <Text variant="bodyMedium">
            To provide the finest coffee experience with convenient ordering and
            delivery to our valued customers.
          </Text>
        </View>

        <View style={styles.missionCard}>
          <Text variant="titleMedium" style={styles.missionTitle}>
            Contact Us
          </Text>
          <Text variant="bodyMedium">Email: info@coffeemobile.com</Text>
          <Text variant="bodyMedium">Phone: +1 (800) COFFEE-1</Text>
          <Text variant="bodyMedium">
            Address: 123 Coffee Street, Brew City, CA 90210
          </Text>
        </View>
      </View>

      {/* Search Results Section */}
      {searchBy && (
        <View style={styles.searchSection}>
          <Text variant="titleLarge" style={styles.searchTitle}>
            Search Results:
          </Text>

          {!isLoading ? (
            filteredProducts && filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <Text style={styles.noResultsText}>No products found</Text>
            )
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size="large" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  aboutSection: {
    padding: 20,
    paddingTop: 40,
  },
  aboutTitle: {
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  aboutText: {
    marginBottom: 24,
    lineHeight: 24,
    textAlign: "justify",
  },
  missionCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  missionTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  searchSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  searchTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    paddingVertical: 20,
  },
});
