import React from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { Text, ActivityIndicator, Divider, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../../types";
import api from "../../services/api";

type RootStackParamList = {
  Receipt: { orderId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Receipt">;

/**
 * Receipt Screen (React Native)
 * Displays order receipt details fetched via React Query
 */
export const Receipt: React.FC<Props> = ({ route }) => {
  const { orderId } = route.params;

  const fetchReceipt = async (): Promise<OrderResponse> => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  };

  const { data: order, isLoading, error } = useQuery<OrderResponse>({
    queryKey: ["order", orderId],
    queryFn: fetchReceipt,
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating size="large" />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.centerContainer}>
        <Text>Failed to load receipt.</Text>
      </View>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const renderItem = ({
    item,
  }: {
    item: { productName: string; quantity: number; unitPrice: number };
  }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text variant="bodyMedium">{item.productName}</Text>
        <Text variant="bodySmall">Qty: {item.quantity}</Text>
      </View>
      <Text variant="bodyMedium">
        ${(item.unitPrice * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Order Receipt
        </Text>

        <Card style={styles.receiptCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionHeader}>
              Order Details
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="bodyMedium">Order ID:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {order.orderId}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">Date:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {new Date(order.orderDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">Time:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {new Date(order.orderDate).toLocaleTimeString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">Status:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {order.status}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">User ID:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {order.userId}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Items Ordered
            </Text>

            <FlatList
              data={order.items}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />

            <Divider style={styles.divider} />

            <View style={styles.totalRow}>
              <Text variant="bodyMedium">Subtotal:</Text>
              <Text variant="bodyMedium">${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text variant="titleMedium">Total:</Text>
              <Text variant="titleMedium" style={styles.totalAmount}>
                ${order.totalPrice.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  receiptCard: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    fontWeight: "600",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  value: {
    fontWeight: "600",
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalAmount: {
    color: "#6F4E37",
    fontWeight: "700",
  },
});

export default Receipt;
