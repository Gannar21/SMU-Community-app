import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SMU Community</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Calendar')} style={styles.button}>
        View Event Calendar
      </Button>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F8FB' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 20 },
  button: { backgroundColor: '#007AFF' },
};
