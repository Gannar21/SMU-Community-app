import React, { useState, useEffect } from "react";
import { View, Image, FlatList, ActivityIndicator, Modal, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import icons for the modal
import styled from "styled-components/native"; // Import styled-components for the modal

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false); // Track event modal visibility
  const [clubDetails, setClubDetails] = useState(null); // Track club details for the selected event
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2025-03-12"
  };

  const fetchEventsAndTasks = async () => {
    try {
      const todayDate = getTodayDate();

      // Fetch all events and filter by today's date
      const eventsResponse = await fetch("http://192.168.49.76:3000/api/events");
      const allEvents = await eventsResponse.json();
      const todayEvents = allEvents.filter((event) => event.date.startsWith(todayDate));
      setEvents(todayEvents);

      // Fetch all tasks and filter by today's timeUploaded field and unassigned tasks
      const tasksResponse = await fetch("http://192.168.49.76:3000/api/tasks");
      const allTasks = await tasksResponse.json();
      const todayTasks = allTasks.filter(
        (task) =>
          task.timeUploaded &&
          task.timeUploaded.startsWith(todayDate) &&
          !task.assignedTo // Only show unassigned tasks
      );
      setTasks(todayTasks);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refreshing indicator
    }
  };

  useEffect(() => {
    fetchEventsAndTasks();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setProfilePicture(parsedUser.profilePicture || "https://randomuser.me/api/portraits/men/3.jpg");
        }
      } catch (error) {
        console.error("❌ Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventsAndTasks();
  };

  // Handle clicking on a task to show details
  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setIsTaskModalVisible(true);
  };

  // Handle clicking on an event to show details
  const handleEventPress = async (eventId) => {
    try {
      const response = await fetch(`http://192.168.49.76:3000/api/events/${eventId}`);
      const data = await response.json();
      setSelectedEvent(data);
      setIsEventModalVisible(true);
    } catch (error) {
      console.error("❌ Error fetching event details:", error);
    }
  };

  // Handle taking a task (assigning it to the current user)
  const handleTakeTask = async (taskId) => {
    try {
      // Fetch the current user's ID from AsyncStorage
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
                // Remove the task from the "Recently Added Tasks" list
                const updatedTasks = tasks.filter((task) => task._id !== taskId);
                setTasks(updatedTasks);
                setIsTaskModalVisible(false); // Close the modal
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

  return (
    <View style={styles.container}>
      {/* Profile Picture in the top-right */}
      <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate("Profile")}>
        <Icon name="account-circle" size={50} color="#007AFF" />
      </TouchableOpacity>

      {/* Logo in the top left */}
      <Image source={require("../assets/BlueLogo.png")} style={styles.logo} />

      {/* Events Today Section */}
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item._id)}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>
                  {item.time} | {item.location}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Welcome to SMU Community App!</Text>
            <Text style={styles.sectionTitle}>Events Today</Text>
          </>
        }
        ListEmptyComponent={
          !loading && <Text style={styles.noDataText}>No events today.</Text>
        }
      />

      {/* Recently Added Tasks Section */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTaskPress(item)}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.taskTitle}>{item.name}</Text>
                <Text style={styles.taskDetails}>
                  Due: {new Date(item.dueTo).toLocaleDateString()} | Priority: {item.priority}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={<Text style={styles.sectionTitle}>Recently Added Tasks</Text>}
        ListEmptyComponent={
          !loading && <Text style={styles.noDataText}>No tasks added today.</Text>
        }
      />

      {/* Task Details Modal */}
      <Modal visible={isTaskModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.name}</Text>
                <Text style={styles.modalText}>Description: {selectedTask.description}</Text>
                <Text style={styles.modalText}>Due: {new Date(selectedTask.dueTo).toLocaleDateString()}</Text>
                <Text style={styles.modalText}>Priority: {selectedTask.priority}</Text>
                <Text style={styles.modalText}>
                  Assigned To: {selectedTask.assignedTo?.name || "Unassigned"}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleTakeTask(selectedTask._id)}
                  style={styles.takeTaskButton}
                >
                  Take Task
                </Button>
                <Button mode="outlined" onPress={() => setIsTaskModalVisible(false)} style={styles.closeButton}>
                  Close
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Event Details Modal */}
      <Modal visible={isEventModalVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          {selectedEvent && (
            <ModalContent>
              {/* Close Button in Top-Right Corner */}
              <CloseButton onPress={() => setIsEventModalVisible(false)}>
                <Icon name="close" size={24} color="#2979ff" />
              </CloseButton>

              {/* Event Details */}
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{selectedEvent.title}</Text>

              {/* Club Logo and Name */}
              {selectedEvent.clubId && (
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Image
                    source={{ uri: selectedEvent.clubId.logo }}
                    style={{ width: 50, height: 50, marginRight: 10 }} // Smaller logo
                  />
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{selectedEvent.clubId.name}</Text>
                </View>
              )}

              <Text style={{ fontSize: 14, marginBottom: 5 }}>Description: {selectedEvent.description}</Text>
              <Text style={{ fontSize: 14, marginBottom: 5 }}>Location: {selectedEvent.location}</Text>
              <Text style={{ fontSize: 14, marginBottom: 5 }}>Time: {selectedEvent.time}</Text>
              <Text style={{ fontSize: 14, marginBottom: 5 }}>Date: {new Date(selectedEvent.date).toLocaleDateString()}</Text>

              {/* Participate Button */}
              <TouchableOpacity style={styles.participateButton}>
                <Text style={styles.participateButtonText}>Participate!</Text>
              </TouchableOpacity>
            </ModalContent>
          )}
        </ModalContainer>
      </Modal>
    </View>
  );
}

// Styled Components for the Modal (Same as in EventCalendar)
const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  align-items: center;
  position: relative; /* For positioning the close button */
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
`;

const styles = {
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 20,
    backgroundColor: "#F4F8FB",
    paddingBottom: 20,
  },
  logo: {
    width: 200, // Increased from 160
    height: 120, // Increased from 100
    resizeMode: "contain",
    marginTop: 35,
    marginBottom: 20,
    marginLeft: 0, // Added to move the logo further to the left
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#fff",
    width: "100%",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  eventDate: {
    fontSize: 14,
    color: "#007AFF",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  taskDetails: {
    fontSize: 14,
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    alignSelf: "center",
    marginBottom: 20,
  },
  list: {
    width: "100%",
    flexShrink: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  takeTaskButton: {
    backgroundColor: "#007AFF",
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
  },
  participateButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#007BFF",
    borderRadius: 50, // Make it circular
    alignItems: "center",
  },
  participateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileIcon: {
    position: "absolute",
    top: 69, // Adjusted to be a little higher
    right: 20,
    zIndex: 1,
  },
};