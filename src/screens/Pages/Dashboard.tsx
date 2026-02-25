import React, { useState } from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { Text, ActivityIndicator, TextInput, Button, Card } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductTypes } from "../../types";
import api from "../../services/api";
import { useGlobalContext } from "../../context/GlobalContext";

/**
 * Dashboard Screen (React Native)
 * Admin-style dashboard: add product, list products, delete/edit placeholders
 */
export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [product, setProduct] = useState<Partial<ProductTypes>>({
    name: "",
    categoryId: "",
    image: "",
    quantity: 0,
    price: 0,
    description: "",
  });

  const [selectedTab, setSelectedTab] = useState<"users" | "products" | "categories">("products");

  const handleChange = (field: keyof Partial<ProductTypes>, value: string) => {
    setProduct((prev) => ({ ...prev, [field]: field === "price" || field === "quantity" ? Number(value) : value }));
  };

  const getProducts = async (): Promise<ProductTypes[]> => {
    const res = await api.get("/products");
    return res.data;
  };

  const { data: products, error, isLoading } = useQuery<ProductTypes[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteProduct = async (productId: string) => {
    try {
      const res = await api.delete(`/products/${productId}`);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const postProduct = async () => {
    try {
      const payload = {
        name: product.name,
        categoryId: product.categoryId,
        image: product.image,
        quantity: product.quantity || 0,
        price: product.price || 0,
        description: product.description || "",
      };
      const res = await api.post("/products", payload);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    await postProduct();
    setProduct({ name: "", categoryId: "", image: "", quantity: 0, price: 0, description: "" });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  if (isLoading) return (
    <View style={styles.centerContainer}><ActivityIndicator animating size={"large"} /></View>
  );
  if (error) return <View style={styles.centerContainer}><Text>Error loading product data</Text></View>;

  const renderProduct = ({ item }: { item: ProductTypes }) => (
    <Card style={styles.productCard} key={item.productId}>
      <Card.Title title={item.name} subtitle={`SAR ${item.price}`} />
      <Card.Content>
        <Text>Category: {item.categoryId}</Text>
        <Text>Quantity: {item.quantity}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={() => {/* TODO: edit flow */}}>Edit</Button>
        <Button mode="contained" onPress={() => handleDeleteProduct(item.productId)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formCard}>
        <Text style={styles.heading}>Add New Product</Text>
        <TextInput label="Name" value={product.name as string} onChangeText={(v) => handleChange("name", v)} style={styles.input} />
        <TextInput label="Category Id" value={product.categoryId as string} onChangeText={(v) => handleChange("categoryId", v)} style={styles.input} />
        <TextInput label="Price" value={String(product.price ?? "")} onChangeText={(v) => handleChange("price", v)} keyboardType="numeric" style={styles.input} />
        <Button mode="contained" onPress={handleSubmit} style={styles.submitBtn}>Submit</Button>
      </View>

      <View style={styles.tabs}>
        <Button mode={selectedTab === "users" ? "contained" : "outlined"} onPress={() => setSelectedTab("users")} style={styles.tabBtn}>Users</Button>
        <Button mode={selectedTab === "products" ? "contained" : "outlined"} onPress={() => setSelectedTab("products")} style={styles.tabBtn}>Products</Button>
        <Button mode={selectedTab === "categories" ? "contained" : "outlined"} onPress={() => setSelectedTab("categories")} style={styles.tabBtn}>Categories</Button>
      </View>

      {selectedTab === "products" && (
        <View style={styles.productsList}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList data={products} renderItem={renderProduct} keyExtractor={(i) => i.productId} />
        </View>
      )}

      {selectedTab === "users" && (
        <View style={styles.emptySection}><Text>Users management UI (TODO)</Text></View>
      )}

      {selectedTab === "categories" && (
        <View style={styles.emptySection}><Text>Categories management UI (TODO)</Text></View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 16, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  formCard: { marginBottom: 20, backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { marginBottom: 10, backgroundColor: "transparent" },
  submitBtn: { marginTop: 8 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tabBtn: { flex: 1, marginHorizontal: 6 },
  productsList: {},
  productCard: { marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  emptySection: { padding: 20, alignItems: "center" },
});
