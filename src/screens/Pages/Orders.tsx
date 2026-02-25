import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text, ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { OrderTypes } from "../../types";

export const Orders: React.FC = () => {
  const fetchOrders = async (): Promise<OrderTypes[]> => {
    const res = await api.get("/orders");
    return res.data;
  };

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<OrderTypes[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Failed to load orders.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        My Orders
      </Text>

      {!orders || orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        orders.map((order) => (
          <Card key={order.orderId} style={styles.card}>
            <Card.Content>
              <Text>
                <Text style={styles.label}>Order ID: </Text>
                {order.orderId}
              </Text>
              <Text>
                <Text style={styles.label}>Status: </Text>
                {order.status}
              </Text>
              <Text>
                <Text style={styles.label}>Date: </Text>
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "No date available"}
              </Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
  },
});
