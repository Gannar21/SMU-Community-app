import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Error", "No authentication token found. Please log in.");
          navigation.replace("Login"); // Redirect to login if no token
          return;
        }

        const response = await fetch("http://192.168.49.76:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch user data");

        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data)); // Save user data in AsyncStorage
      } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out", 
      "Are you sure you want to sign out?", 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token"); // Clear Token
            navigation.replace("Login"); // Navigate to Login
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load user data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user.profilePicture || "https://randomuser.me/api/portraits/men/3.jpg" }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Sign Out Button with DoorOpen Icon */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <MaterialIcons name="exit-to-app" size={20} color="white" style={styles.signOutIcon} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0083a9",
    padding: 20,
  },
  profileContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 40,  // Pushes the profile down a bit from the top
  },
  profileImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15,  // Space between image and text
  },
  userName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333" 
  },
  userEmail: { 
    fontSize: 14, 
    color: "#666" 
  },
  signOutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF3B30", // Red color for sign-out
    borderRadius: 5,
    alignItems: "center",
    width: "50%",
    alignSelf: "flex-start", // Aligns it to the left
    flexDirection: "row", // Align icon and text in a row
    justifyContent: "center", // Center icon and text
  },
  signOutIcon: {
    marginRight: 10, // Space between icon and text
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: { 
    fontSize: 16, 
    color: "red" 
  },
});
