import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalContextProvider } from "./src/context/GlobalContext.tsx";

import { Home } from "./src/screens/Pages/Home";
import { Login } from "./src/screens/Pages/Login";
import { SignUp } from "./src/screens/Pages/SignUp";
import { ProductDetails } from "./src/screens/Pages/ProductDetails";
import { Orders } from "./src/screens/Pages/Orders";
import { Dashboard } from "./src/screens/Pages/Dashboard";
import { AboutUs } from "./src/screens/Pages/AboutUs";
import { Reservation } from "./src/screens/Pages/Reservation";
import { Receipt } from "./src/screens/Pages/Receipt";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Orders" component={Orders} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="AboutUs" component={AboutUs} />
              <Stack.Screen name="Reservation" component={Reservation} />
              <Stack.Screen name="Receipt" component={Receipt} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </PaperProvider>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({});
