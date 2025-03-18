import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import EventCalendarScreen from '../screens/EventCalendarScreen';
import MembersScreen from '../screens/MembersScreen';
import ClubsScreen from '../screens/ClubsScreen';  // ✅ Added Clubs
import ProfileScreen from '../screens/ProfileScreen'; // ✅ Added Profile
import TasksScreen from '../screens/TasksScreen'; // ✅ Added Tasks Screen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tab Navigator (Home + Calendar + Members + Clubs + Profile + Tasks)
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={EventCalendarScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
        }}
      />
      
      <Tab.Screen 
        name="Clubs" 
        component={ClubsScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="celebration" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={24} color={color} />, // "edit" icon
        }}
      />
      <Tab.Screen 
        name="Members" 
        component={MembersScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={24} color={color} />,
        }}
      />
      {/* Move Profile tab to the far right by placing it last */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ✅ Stack Navigator (Includes SplashScreen first)
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
    </Stack.Navigator>
  );
}
