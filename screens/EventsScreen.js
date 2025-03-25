import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Platform, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import icons for the modal
import styled from "styled-components/native"; // Import styled-components for the modal

export default function EventsScreen({ route }) {
    const { clubId } = route.params;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
    const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://192.168.1.31:3000/api/events/club/${clubId}`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('❌ Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [clubId]);

    // Function to handle event press and fetch details
    const handleEventPress = async (eventId) => {
        try {
            const response = await fetch(`http://192.168.1.31:3000/api/events/${eventId}`);
            const data = await response.json();
            setSelectedEvent(data); // Set the selected event with fetched details
            setModalVisible(true); // Show the modal
        } catch (error) {
            console.error("❌ Error fetching event details:", error);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setModalVisible(false); // Hide the modal
        setSelectedEvent(null); // Clear the selected event
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Events</Text>
            <FlatList
                data={events}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleEventPress(item._id)}>
                        <View style={styles.eventCard}>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
                            <Text style={styles.eventTime}>{item.time}</Text>
                            <Text style={styles.eventLocation}>{item.location}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.eventsList}
                ListEmptyComponent={<Text style={styles.noResults}>No events found</Text>}
            />

            {/* Modal to show event details */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <ModalContainer>
                    {selectedEvent && (
                        <ModalContent>
                            {/* Close Button in Top-Right Corner */}
                            <CloseButton onPress={closeModal}>
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

// Styled Components for the Modal
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight + 20 : 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 10,
        textAlign: "center",
        color: "#333",
    },
    eventCard: {
        margin: 10,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    eventDate: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    eventTime: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    eventLocation: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    eventsList: {
        flexGrow: 1,
    },
    noResults: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    modalLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});