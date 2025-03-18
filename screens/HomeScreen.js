import React, { useState, useEffect } from "react";
import { View, Image, FlatList, ActivityIndicator } from "react-native";
import { Text, Button, Card } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2025-03-12"
  };

  useEffect(() => {
    const fetchEventsAndTasks = async () => {
      try {
        const todayDate = getTodayDate();

        // Fetch all events and filter by today's date
        const eventsResponse = await fetch("http://192.168.1.31:3000/api/events");
        const allEvents = await eventsResponse.json();
        const todayEvents = allEvents.filter((event) => event.date.startsWith(todayDate));
        setEvents(todayEvents);

        // Fetch all tasks and filter by today's deadline
        const tasksResponse = await fetch("http://192.168.1.31:3000/api/tasks");
        const allTasks = await tasksResponse.json();
        const todayTasks = allTasks.filter((task) => task.deadline.startsWith(todayDate));
        setTasks(todayTasks);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndTasks();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo in the top left */}
      <Image source={require("../assets/BlueLogo.png")} style={styles.logo} />

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome to SMU Community App!</Text>

      {/* Events Today Section */}
      <Text style={styles.sectionTitle}>Events Today</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>
                  {item.time} | {item.location}
                </Text>
              </Card.Content>
            </Card>
          )}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>No events today.</Text>
      )}

      {/* Button to navigate to Calendar */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Calendar")}
        style={[
          styles.button,
          { marginTop: events.length > 0 || tasks.length > 0 ? 20 : 10 }, // Dynamically adjusts button position
        ]}
      >
        View Event Calendar
      </Button>

      {/* Available Tasks Today Section */}
      <Text style={styles.sectionTitle}>Available Tasks Today</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDeadline}>
                  Deadline: {new Date(item.deadline).toLocaleTimeString()}
                </Text>
              </Card.Content>
            </Card>
          )}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>No tasks available today.</Text>
      )}

      {/* Button to navigate to TaskScreen */}
      <Button mode="contained" onPress={() => navigation.navigate("Tasks")} style={styles.button}>
        View All Tasks
      </Button>
    </View>
  );
}

const styles = {
  container: {
    flex: 1, // Allows the container to grow and adjust based on content
    alignItems: "flex-start",
    paddingLeft: 20,
    backgroundColor: "#F4F8FB",
    paddingBottom: 20, // Adds padding at the bottom to avoid cutoff
  },
  logo: {
    width: 160,
    height: 100,
    resizeMode: "contain",
    marginTop: 35,
    marginBottom: 20,
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
  taskDeadline: {
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
    flexShrink: 1, // Ensures the FlatList doesn't expand unnecessarily
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
};
