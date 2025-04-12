import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Platform, StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ClubsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://192.168.49.76:3000/api/clubs');
        const data = await response.json();
        setAllClubs(data);
        setFilteredClubs(data);
      } catch (error) {
        console.error('❌ Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredClubs(allClubs);
    } else {
      const filtered = allClubs.filter((club) =>
        club.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  };

  const handleClubPress = (club) => {
    navigation.navigate('ClubInfo', { club });
  };

  const handleSeeEvents = (clubId, clubName) => {
    navigation.navigate('EventsScreen', { clubId, clubName });
  };

  const renderItem = ({ item }) => (
    <View style={styles.clubCard}>
      <TouchableOpacity onPress={() => handleClubPress(item)}>
        <Image
          source={{ uri: item.logo || 'https://via.placeholder.com/100' }}
          style={styles.clubImage}
        />
      </TouchableOpacity>
      
      <Text style={styles.clubName}>{item.name}</Text>

      
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMU Clubs</Text>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search Clubs"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          key={search}
          data={filteredClubs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.clubsList}
          numColumns={2}
          ListEmptyComponent={search ? <Text style={styles.noResults}>No clubs found</Text> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight + 20 : 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    textAlign: "center",
    color: "#333",
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
  clubsList: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  clubCard: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  clubImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  clubName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  eventsButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  
});