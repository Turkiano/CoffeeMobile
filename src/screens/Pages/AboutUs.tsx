import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

/**
 * About Us Screen
 * Displays information about the coffee shop
 */
export const AboutUs: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          About Us
        </Text>

        <Text variant="bodyMedium" style={styles.section}>
          Welcome to CoffeeMobile, your favorite coffee shop experience on your mobile device.
        </Text>

        {/* TODO: Add company description, mission, values, team info */}

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contact Us
        </Text>
        <Text variant="bodyMedium">Email: info@coffeemobile.com</Text>
        <Text variant="bodyMedium">Phone: +1 (800) COFFEE-1</Text>
        <Text variant="bodyMedium">Address: 123 Coffee Street, Brew City, CA 90210</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
});
