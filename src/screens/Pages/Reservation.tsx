import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { ReservationTypes } from "../../types";
import api from "../../services/api";

/**
 * Reservation Screen
 * Allows users to reserve a table at the coffee shop
 */
export const CoffeeShopReservation: React.FC = () => {
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReservation = async () => {
    if (!reservationDate || !reservationTime || !numberOfPeople) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    const reservation: ReservationTypes = {
      userId: "", // TODO: Get from auth context
      reservationDate,
      reservationTime,
      numberOfPeople: parseInt(numberOfPeople),
      specialRequests: specialRequests || undefined,
    };

    try {
      setLoading(true);
      const response = await api.post("/reservations", reservation);
      Alert.alert("Success", "Reservation created successfully");
      // TODO: Clear form and navigate to confirmation
    } catch (error) {
      Alert.alert("Reservation Failed", "Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Reserve a Table
        </Text>

        <TextInput
          label="Reservation Date (YYYY-MM-DD)"
          value={reservationDate}
          onChangeText={setReservationDate}
          mode="outlined"
          style={styles.input}
          placeholder="2026-02-25"
        />

        <TextInput
          label="Reservation Time (HH:MM)"
          value={reservationTime}
          onChangeText={setReservationTime}
          mode="outlined"
          style={styles.input}
          placeholder="14:30"
          keyboardType="number-pad"
        />

        <TextInput
          label="Number of People"
          value={numberOfPeople}
          onChangeText={setNumberOfPeople}
          keyboardType="number-pad"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Special Requests (Optional)"
          value={specialRequests}
          onChangeText={setSpecialRequests}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.inputLarge}
          placeholder="Any dietary restrictions or special arrangements?"
        />

        <Button
          mode="contained"
          onPress={handleReservation}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Confirm Reservation
        </Button>

        {/* TODO: Add calendar picker, time picker, availability checker */}
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  inputLarge: {
    marginBottom: 15,
    minHeight: 100,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
});

export default CoffeeShopReservation;
