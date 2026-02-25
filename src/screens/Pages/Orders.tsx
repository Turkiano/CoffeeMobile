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
