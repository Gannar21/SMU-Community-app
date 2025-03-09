import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

const membersData = [
  { id: '1', name: 'Skander Soussi', status: 'online', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Jane Smith', status: 'offline', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Samuel Green', status: 'online', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', name: 'Eya Bedoui', status: 'offline', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', name: 'Asma Gannar', status: 'online', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: '6', name: 'Mehdi Bouzouaya', status: 'online', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const MembersScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(membersData);
  const [friendMessage, setFriendMessage] = useState('');

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = membersData.filter((member) =>
      member.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleAddFriend = (name) => {
    setFriendMessage(`You added ${name} to your friend list!`);
    setTimeout(() => {
      setFriendMessage(''); // Clear the message after 3 seconds
    }, 3000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.memberCard}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={item.status === 'online' ? styles.online : styles.offline}>
          {item.status === 'online' ? 'Online' : 'Offline'}
        </Text>
      </View>
      {/* Add friend button */}
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.name)}>
        <FontAwesome name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Members"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.membersList}
      />

      {/* Display the message when a friend is added */}
      {friendMessage && (
        <View style={styles.friendMessageContainer}>
          <Text style={styles.friendMessage}>{friendMessage}</Text>
        </View>
      )}

      {/* Button to go back */}
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
  membersList: {
    flexGrow: 1,
  },
  memberCard: {
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
  offline: {
    color: 'gray',
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

export default MembersScreen;
