import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
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
      <Button mode="contained" onPress={() => navigation.navigate('HomeTabs')} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('SignUp')} textColor="#007AFF">
        Don't have an account? Sign Up
      </Button>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A7C7E7' }, // Light Blue
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 20 },
  input: { width: '80%', marginBottom: 10 },
  button: { width: '80%', backgroundColor: '#007AFF', marginVertical: 10 },
};
