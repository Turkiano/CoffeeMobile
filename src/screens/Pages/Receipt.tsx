import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator, Divider } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OrderResponse } from "../../types";
import api from "../../services/api";

type RootStackParamList = {
  Receipt: { orderId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Receipt">;

/**
 * Receipt Screen
 * Displays order receipt details
 */
export const Receipt: React.FC<Props> = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [orderId]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch receipt", error);
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

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text>Receipt not found</Text>
      </View>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Order Receipt
        </Text>

        <View style={styles.receiptCard}>
          <Text variant="titleMedium">Order Details</Text>
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

          <Divider style={styles.divider} />

          <Text variant="titleSmall" style={styles.sectionTitle}>
            Items Ordered
          </Text>

          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text variant="bodyMedium">{item.productName}</Text>
                <Text variant="bodySmall">Qty: {item.quantity}</Text>
              </View>
              <Text variant="bodyMedium">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

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
        </View>

        <Button mode="contained" style={styles.button}>
          Download Receipt
        </Button>

        <Button mode="outlined" style={styles.button}>
          Back to Orders
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
    paddingTop: 40,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  receiptCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
    marginTop: 12,
    marginBottom: 12,
    fontWeight: "600",
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
  button: {
    marginBottom: 12,
  },
});
