import React, { useState } from "react";
import { View, Image, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import axios from "axios";

const API_URL = "http://192.168.1.31:3000/api/auth/signin-user";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, { email, password });

      if (response.data.token) {
        Alert.alert("Success", "Login successful!");
        // TODO: Store the token for future API calls (AsyncStorage)
        navigation.navigate("HomeTabs");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate("SignUp")} textColor="#007AFF">
        Don't have an account? Sign Up
      </Button>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#A7C7E7" },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007AFF", marginBottom: 20 },
  input: { width: "80%", marginBottom: 10 },
  button: { width: "80%", backgroundColor: "#007AFF", marginVertical: 10 },
};
