import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const API_URL = "http://192.168.1.31:3000/api/auth/signup";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation function to ensure all fields are filled
  const validateInputs = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    console.log("📌 Sending Signup Request:", { name, email, phone, password });

    try {
      const response = await axios.post(API_URL, {
        name,
        email,
        phone,
        password,
      });

      console.log("✅ Signup Response:", response.data);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "User created successfully! Please log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Signup Failed", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Signup Failed:", error.response?.data);

      if (error.response?.status === 400) {
        Alert.alert("Signup Failed", error.response.data.message || "User already exists! Try logging in.");
      } else {
        Alert.alert("Signup Failed", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started !</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
        <Text style={styles.signupText}>{loading ? "Signing Up..." : "Create Account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0083a9", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#ffffff", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#000000", marginBottom: 20 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, paddingLeft: 15, backgroundColor: "#fff", marginBottom: 15 },
  signupButton: { width: "100%", backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  signupText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginText: { fontSize: 14, color: "#ffffff", marginTop: 10 },
});

export default SignupScreen;
