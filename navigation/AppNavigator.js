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
import MyTasksScreen from '../screens/MyTasksScreen';
import EventsScreen from '../screens/EventsScreen';
import ClubInfo from '../screens/ClubInfo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tasks Stack Navigator
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

// Clubs Stack Navigator
const ClubsStack = createStackNavigator();

function ClubsStackNavigator() {
  return (
    <ClubsStack.Navigator>
      <ClubsStack.Screen 
        name="ClubsMain" 
        component={ClubsScreen}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen 
        name="ClubInfo" 
        component={ClubInfo}
        options={({ route }) => ({ 
          title: route.params.club.name,
          headerBackTitle: 'Back'
        })}
      />
      <ClubsStack.Screen 
        name="EventsScreen" 
        component={EventsScreen} 
        options={({ route }) => ({ 
          title: route.params?.clubName || 'Events',
          headerBackTitle: 'Back'
        })}
      />
    </ClubsStack.Navigator>
  );
}

// Bottom Tab Navigator
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
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
        component={ClubsStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="celebration" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksStackNavigator}
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

// Main Stack Navigator
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