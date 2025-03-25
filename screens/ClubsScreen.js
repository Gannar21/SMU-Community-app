import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Platform, StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ClubsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://192.168.1.31:3000/api/clubs');
        const data = await response.json();
        setAllClubs(data); // Store all clubs
        setFilteredClubs(data); // Set filtered clubs to all initially
      } catch (error) {
        console.error('❌ Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Handle search functionality
  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredClubs(allClubs); // Reset if search is cleared
    } else {
      const filtered = allClubs.filter((club) =>
        club.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  };

  const handleSeeEvents = (clubId, clubName) => {
    navigation.navigate('EventsScreen', { clubId, clubName }); // Pass clubName along with clubId
};

  const handleInfo = (club) => {
    // Show club description or toggle visibility
    setSelectedClub(selectedClub === club ? null : club); // Toggle the description visibility
  };

  const renderItem = ({ item }) => (
    <View style={styles.clubCard}>
        <Image
            source={{ uri: item.logo || 'https://via.placeholder.com/100' }}
            style={styles.clubImage}
        />
        <Text style={styles.clubName}>{item.name}</Text>

        <View style={styles.clubActions}>
            <TouchableOpacity onPress={() => handleInfo(item)} style={styles.infoButton}>
                <Ionicons name="information-circle-outline" size={30} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.eventsButton} onPress={() => handleSeeEvents(item._id, item.name)}>
                <Text style={styles.eventsButtonText}>See Events</Text>
            </TouchableOpacity>
        </View>

        {selectedClub === item && (
            <Text style={styles.clubDescription}>{item.description}</Text>
        )}
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
          key={search} // Use `search` as the key to force a re-render when the search text changes
          data={filteredClubs} // Show filtered clubs
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.clubsList}
          numColumns={2} // Display two items per row
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
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight + 20 : 20, // Adjust for notch
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10, // Adjust this value if needed
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
    justifyContent: 'space-between', // Ensures even spacing
    minHeight: 200, // Ensures all cards have the same height
  },

  clubImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: 'cover', // Ensure image is properly fitted inside the square
  },
  clubName: {
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
  textAlign: 'center',
  flex: 1, // Allows text to wrap without affecting button alignment
},
clubActions: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center', // Ensures buttons stay aligned
  width: '100%',
  marginTop: 10,
},

  infoButton: {
    padding: 8,
    width: 50, // Adjust width and height to make the icon size fit
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clubDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
