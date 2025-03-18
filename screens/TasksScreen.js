import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://192.168.1.31:3000/api/tasks');
        // Filter tasks to only show those with status 'Pending'
        setTasks(response.data.filter(task => task.status === 'Pending'));
      } catch (error) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Function to handle taking a task (updating status to 'In Progress')
  const handleTakeTask = async (taskId) => {
    try {
      const response = await axios.put(`http://192.168.1.31:3000/api/tasks/${taskId}`, {
        status: 'In Progress',
      });

      // Update the local task list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: 'In Progress' } : task
        )
      );

      Alert.alert('Task Taken', 'You have successfully taken the task.');
    } catch (error) {
      setError('Error updating task status');
    }
  };

  // Render each task in a FlatList
  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskDetails}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
      <Text style={styles.taskDetails}>Priority: {item.priority}</Text>
      <Button title="Take Task" onPress={() => handleTakeTask(item._id)} />
    </View>
  );

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
