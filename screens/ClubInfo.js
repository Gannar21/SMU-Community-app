import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClubInfo({ route, navigation }) {
  const { club } = route.params;

  return (
    <ScrollView style={styles.container}>
 
      <View style={styles.content}>
        <Image
          source={{ uri: club.logo || 'https://via.placeholder.com/200' }}
          style={styles.clubLogo}
        />
        
        <Text style={styles.clubName}>{club.name}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{club.description}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.infoText}>Email: {club.email}</Text>
          {club.president_id && (
            <Text style={styles.infoText}>President: {club.president_id.name}</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.eventsButton}
          onPress={() => navigation.navigate('EventsScreen', { 
            clubId: club._id, 
            clubName: club.name 
          })}
        >
          <Text style={styles.eventsButtonText}>View Events</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 15,
  },


  content: {
    padding: 20,
    alignItems: 'center',
  },
  clubLogo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  eventsButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  eventsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});