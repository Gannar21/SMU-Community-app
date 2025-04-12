import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyTasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Track the selected task for details
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Fetched User ID:", userId); // Debugging

        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://192.168.49.76:3000/api/tasks");

        // Filter tasks based on the assigned userId
        const userTasks = response.data.filter(
          (task) => task.assignedTo && String(task.assignedTo.userId) === String(userId)
        );
        setTasks(userTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Re-run whenever the screen is focused, ensuring that we get the latest tasks

  // Handle task status update
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const updatedFields = {
        status: newStatus,
      };

      // If the task is being set to "Pending", clear the assignedTo field
      if (newStatus === "Pending") {
        updatedFields.assignedTo = null;
      }

      const response = await axios.put(`http://192.168.49.76:3000/api/tasks/${taskId}`, updatedFields);

      if (response.status === 200) {
        // Update the task list
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedFields } : task
        );
        setTasks(updatedTasks);
        setIsModalVisible(false); // Close the modal
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  // Show confirmation dialog for updating task status
  const confirmUpdateStatus = (taskId, newStatus) => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to mark this task as ${newStatus}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => updateTaskStatus(taskId, newStatus),
        },
      ]
    );
  };

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      {/* "In Progress" Tasks */}
      <Text style={styles.sectionTitle}>In Progress</Text>
      <FlatList
        data={tasks.filter((task) => task.status === 'In Progress')}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTaskClick(item)}>
            <View style={styles.taskContainer}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskDetails}>
                Due: {new Date(item.dueTo).toLocaleDateString()} | Priority: {item.priority}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* "Completed" Tasks */}
      <Text style={styles.sectionTitle}>Completed</Text>
      <FlatList
        data={tasks.filter((task) => task.status === 'Completed')}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskDetails}>
              Due: {new Date(item.dueTo).toLocaleDateString()} | Priority: {item.priority}
            </Text>
          </View>
        )}
      />

      {/* Task Details Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.name}</Text>
                <Text style={styles.modalText}>Description: {selectedTask.description}</Text>
                <Text style={styles.modalText}>Due: {new Date(selectedTask.dueTo).toLocaleDateString()}</Text>
                <Text style={styles.modalText}>Priority: {selectedTask.priority}</Text>
                <Text style={styles.modalText}>Status: {selectedTask.status}</Text>
                <Text style={styles.modalText}>
                  Assigned To: {selectedTask.assignedTo?.name || "Unassigned"}
                </Text>

                {/* Buttons to update status */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Mark as Completed"
                    onPress={() => confirmUpdateStatus(selectedTask._id, "Completed")}
                  />
                  <Button
                    title="Cancel (Set to Pending)"
                    onPress={() => confirmUpdateStatus(selectedTask._id, "Pending")}
                  />
                  <Button
                    title="Close"
                    onPress={() => setIsModalVisible(false)}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDetails: {
    fontSize: 14,
    color: '#007AFF',
  },
  loading: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
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
  buttonContainer: {
    marginTop: 20,
  },
});