import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

const FriendsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [allFriends, setAllFriends] = useState([]); // Store all users from backend
  const [filteredFriends, setFilteredFriends] = useState([]); // Store search results
  const [loading, setLoading] = useState(true);
  const [friendMessage, setFriendMessage] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://192.168.49.76:3000/api/users");
        const data = await response.json();
        setAllFriends(data); // Store all users from backend
      } catch (error) {
        console.error("❌ Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Handle search functionality
  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredFriends([]); // Show blank until user starts typing
    } else {
      const filtered = allFriends.filter((friend) =>
        friend.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const handleAddFriend = (name) => {
    setFriendMessage(`You added ${name} to your friend list!`);
    setTimeout(() => {
      setFriendMessage(''); // Clear message after 3 seconds
    }, 3000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.friendCard}>
      <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.online}>Online</Text> 
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.name)}>
        <FontAwesome name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Friends"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filteredFriends} // Show results only when searching
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.friendsList}
          ListEmptyComponent={search ? <Text style={styles.noResults}>No friends found</Text> : null}
        />
      )}

      {friendMessage && (
        <View style={styles.friendMessageContainer}>
          <Text style={styles.friendMessage}>{friendMessage}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  friendsList: {
    flexGrow: 1,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  friendInfo: {
    flex: 1,
  },
  friendName: {
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
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FriendsScreen;
