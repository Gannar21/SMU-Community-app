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
import ClubsScreen from '../screens/ClubsScreen';  
import ProfileScreen from '../screens/ProfileScreen'; 
import TasksScreen from '../screens/TasksScreen'; 
import MyTasksScreen from '../screens/MyTasksScreen'; // ✅ Import My Tasks Screen
import EventsScreen from '../screens/EventsScreen'; // Import the new EventsScreen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Nested Stack for Tasks (Includes TasksScreen & MyTasksScreen)
const TasksStack = createStackNavigator();

function TasksStackNavigator() {
  return (
    <TasksStack.Navigator>
      <TasksStack.Screen 
        name="TasksMain" 
        component={TasksScreen} 
        options={{ title: 'Tasks' }}
      />
      <TasksStack.Screen 
        name="MyTasks" 
        component={MyTasksScreen} 
        options={{ title: 'My Tasks' }}
      />
    </TasksStack.Navigator>
  );
}

// ✅ Nested Stack for Clubs (Includes ClubsScreen & EventsScreen)
const ClubsStack = createStackNavigator();

function ClubsStackNavigator() {
  return (
    <ClubsStack.Navigator>
      <ClubsStack.Screen 
        name="ClubsMain" 
        component={ClubsScreen} 
        options={{ title: 'Clubs' }}
      />
      <ClubsStack.Screen 
        name="EventsScreen" 
        component={EventsScreen} 
        options={{ title: 'Events' }}
      />
    </ClubsStack.Navigator>
  );
}

// ✅ Bottom Tab Navigator (Includes Home + Calendar + Clubs + Tasks + Members + Profile)
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
        component={ClubsStackNavigator} // ✅ Use the Clubs Stack Navigator
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="celebration" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksStackNavigator} // ✅ Use the Tasks Stack Navigator
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Members" 
        component={MembersScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={24} color={color} />,
        }}
      />
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

// ✅ Main Stack Navigator (Includes Splash + Auth + Home)
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