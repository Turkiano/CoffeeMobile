import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "../../services/api";

type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

/**
 * SignUp Screen
 * Handles user registration with form validation
 */
export const SignUp: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  console.log("User inputs:", user);

  const handleChange = (field: string, value: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleSignUp = async () => {
    try {
      const res = await api.post("/users/signup", user);
      return res.data;
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("Something went wrong! Please try again.");
      return Promise.reject(new Error("Something went wrong!!"));
    }
  };

  const handleSubmit = async () => {
    setError(null); // Reset error state

    // Validation
    if (
      !user.firstName ||
      !user.lastName ||
      !user.phone ||
      !user.email ||
      !user.password
    ) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await handleSignUp();
      console.log("response:", response);

      if (response) {
        Alert.alert("Success", "Account created successfully. Please login.");
        navigation.replace("Login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title="Sign Up"
            titleStyle={styles.cardTitle}
            style={styles.cardHeader}
          />
          <Card.Content style={styles.cardContent}>
            <TextInput
              label="First Name"
              value={user.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Last Name"
              value={user.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Phone"
              value={user.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Password"
              value={user.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Sign Up
            </Button>

            <Text style={styles.loginText}>
              Have an account?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
  },
  cardHeader: {
    paddingBottom: 0,
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardContent: {
    paddingTop: 16,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
  },
  loginText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  loginLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
