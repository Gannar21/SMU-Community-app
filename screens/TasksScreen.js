import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, Modal 
} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Platform, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Track the selected task for details
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const navigation = useNavigation();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://192.168.49.76:3000/api/tasks');
      // Filter tasks to only show those with status 'Pending' and unassigned
      setTasks(response.data.filter(task => task.status === 'Pending' && !task.assignedTo));
    } catch (error) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch tasks whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleTakeTask = async (taskId) => {
    try {
      const currentUserId = await AsyncStorage.getItem("userId");

      if (!currentUserId) {
        alert("User not logged in. Please log in to take tasks.");
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        "Confirm",
        "Are you sure you want to take this task?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const response = await fetch(`http://192.168.49.76:3000/api/tasks/${taskId}/assign`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: currentUserId }),
              });

              if (response.ok) {
                const data = await response.json();
                alert("Task assigned successfully!");
                // Re-fetch tasks after assigning
                fetchTasks();
                setIsModalVisible(false); // Close the modal after taking the task
              } else {
                const errorData = await response.json();
                alert("Failed to assign task.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error assigning task:", error);
    }
  };

  // Function to parse the dueTo field
  const parseDueTo = (dueTo) => {
    if (!dueTo) return "No due date";
  
    const parsedDate = new Date(dueTo);
    if (isNaN(parsedDate)) {
      console.warn("Invalid date format:", dueTo);
      return "Invalid date";
    }
  
    return parsedDate.toLocaleDateString();
  };

  // Handle clicking on a task to show details
  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };
  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleTaskPress(item)}>
        <View style={styles.taskContainer}>
          <Text style={styles.taskName}>{item.name || "Unnamed Task"}</Text>
          <Text style={styles.taskDetails}>Due: {parseDueTo(item.dueTo)}</Text>
          <Text style={styles.taskDetails}>
            Priority: {item.priority ? String(item.priority) : "Not specified"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  const administrativeTasks = tasks.filter(task => task.category === 'administrative');
  const clubTasks = tasks.filter(task => task.category === 'club');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Tasks</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('MyTasks')} 
          style={styles.myTasksButton}
        >
          <Text style={styles.myTasksButtonText}>My Tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Line */}
      <View style={styles.horizontalLine} />

      <Text style={styles.sectionTitle}>Administrative Tasks</Text>
      <FlatList
        data={administrativeTasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionTitle}>Club Tasks</Text>
      <FlatList
        data={clubTasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Task Details Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.name}</Text>
                <Text style={styles.modalText}>Description: {selectedTask.description}</Text>
                <Text style={styles.modalText}>Due: {parseDueTo(selectedTask.dueTo)}</Text>
                <Text style={styles.modalText}>Priority: {selectedTask.priority}</Text>
                <Text style={styles.modalText}>
                  Assigned To: {selectedTask.assignedTo?.name || "Unassigned"}
                </Text>

                {/* Button to take the task */}
                <Button
                  title="Take Task"
                  onPress={() => handleTakeTask(selectedTask._id)}
                  style={styles.takeTaskButton}
                />

                {/* Button to close the modal */}
                <Button
                  title="Close"
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? (StatusBar.currentHeight || 40) : 20, 
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin to bring the line closer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  myTasksButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  myTasksButtonText: {
    color: 'white',
    fontSize: 16,
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20, // Space below the line
  },
  loading: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  takeTaskButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});