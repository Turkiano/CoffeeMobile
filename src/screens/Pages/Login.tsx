import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/**
 * Login Screen
 * Handles user authentication with email and password
 */
export const Login: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", user);

      console.log("Full login response data:", res.data);

      // res.data IS the token
      const token = res.data;

      if (!token) {
        setError("Login failed: No token received.");
        return;
      }

      // Save token to AsyncStorage
      await AsyncStorage.setItem("token", token);

      // Navigate to home
      navigation.replace("Home");
    } catch (error) {
      console.error("Login error:", error);
      setError("Wrong email or password. Please try again.");
      Alert.alert("Login Failed", "Wrong email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Login Page
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={user.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
          />

          <TextInput
            label="Password"
            value={user.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your password"
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
            Login
          </Button>

          <View style={styles.signupContainer}>
            <Text variant="bodyMedium">
              Create an Account{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("SignUp")}
              >
                here
              </Text>
            </Text>
          </View>
        </View>
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
    paddingTop: 60,
  },
  title: {
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    fontSize: 14,
  },
  signupContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signupLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
