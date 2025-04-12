import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native'; // Add this import

const MembersScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [suggestedMembers, setSuggestedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendMessage, setFriendMessage] = useState('');

  // Function to get random suggestions
  const getRandomSuggestions = useCallback((members, count) => {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  // Fetch members and set random suggestions
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.49.76:3000/api/users");
      const data = await response.json();
      setAllMembers(data);
      setSuggestedMembers(getRandomSuggestions(data, 5)); // Get new random suggestions
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [getRandomSuggestions]);

  // Refresh suggestions when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (allMembers.length > 0) {
        setSuggestedMembers(getRandomSuggestions(allMembers, 5)); // Refresh with new random members
      }
    }, [allMembers, getRandomSuggestions])
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredMembers([]);
    } else {
      const filtered = allMembers.filter((member) =>
        member.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleAddFriend = (name) => {
    setFriendMessage(`Friend request sent to ${name}!`);
    setTimeout(() => {
      setFriendMessage('');
    }, 3000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.memberCard}>
      <Image 
        source={{ uri: item.profilePicture || "https://randomuser.me/api/portraits/men/1.jpg" }} 
        style={styles.profileImage} 
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.online}>Online</Text> 
      </View>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => handleAddFriend(item.name)}
      >
        <FontAwesome name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Make some new friends!"
        value={search}
        onChangeText={handleSearch}
      />

      {/* Suggestions Section - Only shown when not searching */}
      {!search && suggestedMembers.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <FlatList
            data={suggestedMembers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.membersList}
          ListEmptyComponent={
            search ? (
              <Text style={styles.noResults}>No members found</Text>
            ) : null
          }
        />
      )}

      {friendMessage && (
        <View style={styles.friendMessageContainer}>
          <Text style={styles.friendMessage}>{friendMessage}</Text>
        </View>
      )}
    </View>
  );
};

// ... (keep the same styles as before)



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  membersList: {
    flexGrow: 1,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  online: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendMessageContainer: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  friendMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MembersScreen;