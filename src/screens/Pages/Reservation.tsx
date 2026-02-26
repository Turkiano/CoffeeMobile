import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { Card, Text, Button, TextInput, RadioButton } from "react-native-paper";

/**
 * Reservation Screen (React Native)
 * Coffee shop table reservation with location selection, date/time picker, and booking form
 */
export const Reservation: React.FC = () => {
  const [location, setLocation] = useState("downtown");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("12:00 PM");
  const [guests, setGuests] = useState("2");
  const [seatingType, setSeatingType] = useState("indoor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const locations = {
    downtown: {
      name: "Downtown Café",
      description:
        "Our flagship location in the heart of the city with a modern urban vibe.",
      image:
        "https://i.postimg.cc/R0bDB7jH/a-3d-top-view-blueprint-of-a-cozy-coffee-VT0-Wh-OZz-RF297-JGTRTEllg-ogpa5-Rv4-Sk2-Dq-OLW6a2ul-Q.jpg",
    },
    riverside: {
      name: "Riverside Retreat",
      description:
        "Peaceful outdoor seating with beautiful views of the river and nature.",
      image:
        "https://i.postimg.cc/wM8vwbQx/a-3d-top-view-blueprint-of-a-modern-coff-TX-p1ya7-Qayj-Sc-J3dk-JIlg-ogpa5-Rv4-Sk2-Dq-OLW6a2ul-Q.jpg",
    },
    historic: {
      name: "Historic District",
      description:
        "Charming café housed in a renovated 19th century building with classic decor.",
      image:
        "https://i.postimg.cc/LsKb6tDY/a-3d-top-view-blueprint-of-a-modern-coff-t-n-Wk-DBy-Qnqzdvq-SGn-Hz-DA-ogpa5-Rv4-Sk2-Dq-OLW6a2ul-Q.jpg",
    },
  };

  const currentLocation = locations[location as keyof typeof locations];
  const timeSlots = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 8;
    return hour > 12
      ? `${hour - 12}:00 PM`
      : hour === 12
        ? "12:00 PM"
        : `${hour}:00 AM`;
  });

  const guestOptions = Array.from({ length: 8 }).map((_, i) => `${i + 1}`);

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert(
      "Reservation Confirmed",
      `Table reserved for ${guests} guests at ${currentLocation.name} on ${date.toDateString()} at ${time}`,
    );

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setSpecialRequests("");
  };

  const renderLocationThumbnail = ({
    item,
  }: {
    item: [string, (typeof locations)[keyof typeof locations]];
  }) => {
    const [key, loc] = item;
    const isSelected = location === key;

    return (
      <TouchableOpacity
        onPress={() => setLocation(key)}
        style={[
          styles.thumbnailContainer,
          isSelected && styles.thumbnailSelected,
        ]}
      >
        <Image source={{ uri: loc.image }} style={styles.thumbnail} />
        <View style={styles.thumbnailLabel}>
          <Text style={styles.thumbnailText} numberOfLines={1}>
            {loc.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text variant="headlineMedium" style={styles.title}>
        Table Reservation
      </Text>

      {/* Main Location Image */}
      <Card style={styles.mainCard}>
        <Card.Cover
          source={{ uri: currentLocation.image }}
          style={styles.mainImage}
        />
        <Card.Content style={styles.cardContent}>
          <Text variant="headlineSmall">{currentLocation.name}</Text>
          <Text style={styles.description}>{currentLocation.description}</Text>
        </Card.Content>
      </Card>

      {/* Location Thumbnails */}
      <View style={styles.thumbnailsSection}>
        <FlatList
          data={Object.entries(locations)}
          renderItem={renderLocationThumbnail}
          keyExtractor={([key]) => key}
          horizontal
          scrollEnabled={false}
          contentContainerStyle={styles.thumbnailsList}
        />
      </View>

      {/* Location Select RadioButton */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Select Location</Text>
        <RadioButton.Group value={location} onValueChange={setLocation}>
          {Object.entries(locations).map(([key, loc]) => (
            <View key={key} style={styles.radioItem}>
              <RadioButton value={key} />
              <Text style={styles.radioLabel}>{loc.name}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>

      {/* Seating Preference */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Seating Preference</Text>
        <RadioButton.Group value={seatingType} onValueChange={setSeatingType}>
          {["indoor", "outdoor", "bar"].map((type) => (
            <View key={type} style={styles.radioItem}>
              <RadioButton value={type} />
              <Text style={styles.radioLabel}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>

      {/* Date Selection */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Date: {date.toDateString()}</Text>
        <Button mode="outlined" style={styles.button}>
          Change Date (TODO: Date Picker)
        </Button>
      </View>

      {/* Time Selection */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Time</Text>
        <RadioButton.Group value={time} onValueChange={setTime}>
          {timeSlots.slice(0, 4).map((slot) => (
            <View key={slot} style={styles.radioItem}>
              <RadioButton value={slot} />
              <Text style={styles.radioLabel}>{slot}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>

      {/* Number of Guests */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Number of Guests</Text>
        <RadioButton.Group value={guests} onValueChange={setGuests}>
          {guestOptions.slice(0, 4).map((option) => (
            <View key={option} style={styles.radioItem}>
              <RadioButton value={option} />
              <Text style={styles.radioLabel}>
                {option} {option === "1" ? "Guest" : "Guests"}
              </Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>

      {/* Contact Information */}
      <View style={styles.formSection}>
        <TextInput
          label="Your Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.formSection}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          placeholder="you@example.com"
        />
      </View>

      <View style={styles.formSection}>
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="(059) 493-0211"
        />
      </View>

      <View style={styles.formSection}>
        <TextInput
          label="Special Requests"
          value={specialRequests}
          onChangeText={setSpecialRequests}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Any special requests or dietary requirements?"
        />
      </View>

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Confirm Reservation
      </Button>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  mainCard: {
    marginBottom: 20,
    overflow: "hidden",
  },
  mainImage: {
    height: 300,
  },
  cardContent: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#7a7a7a",
    marginTop: 8,
  },
  thumbnailsSection: {
    marginBottom: 20,
  },
  thumbnailsList: {
    gap: 12,
  },
  thumbnailContainer: {
    width: 80,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailSelected: {
    borderColor: "#6200ee",
  },
  thumbnail: {
    width: "100%",
    height: "70%",
  },
  thumbnailLabel: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  thumbnailText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 8,
    marginTop: 20,
  },
  spacer: {
    height: 20,
  },
});

export default Reservation;
