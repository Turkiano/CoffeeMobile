import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { UserTypes } from "../../types";
import api from "../../services/api";

/**
 * Dashboard Screen
 * Displays user profile, order history, and account settings
 */
export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          My Dashboard
        </Text>

        {user && (
          <>
            <View style={styles.profileCard}>
              <Text variant="titleMedium">Profile Information</Text>
              <Text variant="bodyMedium">
                Name: {user.firstName} {user.lastName}
              </Text>
              <Text variant="bodyMedium">Email: {user.email}</Text>
              <Text variant="bodyMedium">Phone: {user.phone}</Text>
              <Text variant="bodyMedium">Role: {user.role}</Text>
            </View>

            {/* TODO: Add order history, addresses, preferences */}

            <Button mode="outlined" style={styles.button}>
              Edit Profile
            </Button>

            <Button mode="outlined" style={styles.button}>
              View Orders
            </Button>

            <Button mode="outlined" style={styles.button}>
              Logout
            </Button>
          </>
        )}
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
  profileCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
  },
});
