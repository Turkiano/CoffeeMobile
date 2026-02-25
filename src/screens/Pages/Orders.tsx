import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { Text, Button, ActivityIndicator, Card } from "react-native-paper";
import { OrderResponse } from "../../types";
import api from "../../services/api";

/**
 * Orders Screen
 * Displays user's order history
 */
export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderOrderItem = ({ item }: { item: OrderResponse }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <Text variant="titleMedium">Order #{item.orderId}</Text>
        <Text variant="bodySmall">
          Date: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text variant="bodySmall">Status: {item.status}</Text>
        <Text variant="titleSmall" style={styles.totalPrice}>
          Total: ${item.totalPrice.toFixed(2)}
        </Text>
        <Text variant="bodySmall">Items: {item.items.length}</Text>
      </Card.Content>
      <Card.Actions>
        <Button>View Details</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        My Orders
      </Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">No orders yet</Text>
          <Button mode="contained" style={styles.browseButton}>
            Start Shopping
          </Button>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    marginBottom: 12,
  },
  totalPrice: {
    color: "#6F4E37",
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  browseButton: {
    marginTop: 20,
  },
});
