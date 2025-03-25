import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Image } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Platform, StatusBar } from "react-native";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [dates, setDates] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); // Track start of the displayed week
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleDateString("en-US", { month: "long" }));
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false); // Modal visibility

  useEffect(() => {
    generateCalendarDates(currentWeekStart);
    fetchEvents();
    updateMonthForWeek(currentWeekStart); // Update month when week changes
  }, [currentWeekStart]);

  useEffect(() => {
    const month = new Date(selectedDate).toLocaleDateString("en-US", { month: "long" });
    setCurrentMonth(month);
  }, [selectedDate]);

  const generateCalendarDates = (startDate) => {
    const week = [];
    const start = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push({
        fullDate: date.toISOString().split("T")[0],
        day: date.getDate(),
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    setDates(week);
  };

  const updateMonthForWeek = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of the week

    const startMonth = start.toLocaleDateString("en-US", { month: "long" });
    const endMonth = end.toLocaleDateString("en-US", { month: "long" });

    // If the week spans two months, show the month with more days
    if (startMonth !== endMonth) {
      const startMonthDays = 7 - (end.getDate() - start.getDate());
      const endMonthDays = 7 - startMonthDays;

      if (endMonthDays > startMonthDays) {
        setCurrentMonth(endMonth);
      } else {
        setCurrentMonth(startMonth);
      }
    } else {
      setCurrentMonth(startMonth);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://192.168.1.31:3000/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
  };

  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
  };

  const handleEventClick = async (eventId) => {
    try {
      const response = await fetch(`http://192.168.1.31:3000/api/events/${eventId}`);
      const data = await response.json();
      setSelectedEvent(data);
      setEventDetailsVisible(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Event Calendar</Title>
      </Header>

      {/* Month Indicator */}
      <MonthIndicator>
        {currentMonth}
      </MonthIndicator>

      {/* Navigation Buttons */}
      <WeekNavigation>
        <NavButton onPress={goToPreviousWeek}>
          <Icon name="chevron-left" size={24} color="white" />
        </NavButton>

        <DateStrip>
          {dates.map((dateObj, index) => (
            <DateItem
              key={index}
              active={selectedDate === dateObj.fullDate}
              onPress={() => setSelectedDate(dateObj.fullDate)}
            >
              <DateText active={selectedDate === dateObj.fullDate}>
                {dateObj.day}
              </DateText>
              <DateSubText active={selectedDate === dateObj.fullDate}>
                {dateObj.weekday}
              </DateSubText>
            </DateItem>
          ))}
        </DateStrip>

        <NavButton onPress={goToNextWeek}>
          <Icon name="chevron-right" size={24} color="white" />
        </NavButton>
      </WeekNavigation>

      {/* Events */}
      <SectionTitle>Events for {selectedDate}</SectionTitle>

      {loading ? (
        <ActivityIndicator size="large" color="#2979ff" />
      ) : (
        <ScrollView>
          {events.filter(event => {
            if (!event.date) {
              console.warn("Invalid event date:", event);
              return false; // Skip events with missing dates
            }

            const eventDate = new Date(event.date).toISOString().split("T")[0];
            return eventDate === selectedDate;
          }).length > 0 ? (
            events
              .filter(event => {
                if (!event.date) return false;
                const eventDate = new Date(event.date).toISOString().split("T")[0];
                return eventDate === selectedDate;
              })
              .map((event, index) => (
                <TouchableOpacity key={index} onPress={() => handleEventClick(event._id)}>
                  <EventItem>
                    <Time>{event.time}</Time>
                    <EventCard>
                      <EventText>{event.title}</EventText>
                      <EventSubText>{event.description}</EventSubText>
                      <EventSubText>{event.location}</EventSubText>
                    </EventCard>
                  </EventItem>
                </TouchableOpacity>
              ))
          ) : (
            <Text>No events available</Text>
          )}
        </ScrollView>
      )}

      {/* Reminder */}
      <SectionTitle>Reminder</SectionTitle>
      <ReminderText>Don't forget your next event!</ReminderText>

      <ReminderCard>
        <IconContainer>
          <Icon name="event" size={24} color="white" />
        </IconContainer>
        <ReminderTime>12:00 - 16:00</ReminderTime>
      </ReminderCard>

      {/* View Button */}
      <JoinButton>
        <JoinText>VIEW</JoinText>
      </JoinButton>

      {/* Event Details Modal */}
      <Modal visible={eventDetailsVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          {selectedEvent && (
            <ModalContent>
              {/* Close Button in Top-Right Corner */}
              <CloseButton onPress={() => setEventDetailsVisible(false)}>
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
    </Container>
  );
};

export default EventCalendar;

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f9fbff;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${Platform.OS === "ios" ? StatusBar.currentHeight + 20 : 20}px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
`;

const MonthIndicator = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  color: #2979ff;
`;

const WeekNavigation = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  padding-left: 0px;
  gap: 5px;
`;

const NavButton = styled.TouchableOpacity`
  background-color: #2979ff;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-right: 0px;
`;

const DateStrip = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
  padding-left: 0px;
  margin-left: -10px;
  overflow: hidden;
`;

const DateItem = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ active }) => (active ? "#fbd6e0" : "transparent")};
  padding: 8px;
  border-radius: 10px;
`;

const DateText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ active }) => (active ? "#ff5e8e" : "#666")};
`;

const DateSubText = styled.Text`
  font-size: 14px;
  color: ${({ active }) => (active ? "#ff5e8e" : "#999")};
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;

const ReminderText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const EventItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Time = styled.Text`
  width: 50px;
  font-size: 16px;
  color: #999;
`;

const EventCard = styled.View`
  flex: 1;
  background-color: #64b5f6;
  padding: 10px;
  border-radius: 10px;
`;

const EventText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

const EventSubText = styled.Text`
  font-size: 14px;
  color: white;
`;

const ReminderCard = styled.View`
  flex-direction: row;
  background-color: #9575cd;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const IconContainer = styled.View`
  background-color: #7e57c2;
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
`;

const ReminderTime = styled.Text`
  font-size: 16px;
  color: white;
`;

const JoinButton = styled.TouchableOpacity`
  background-color: #2979ff;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 20px;
`;

const JoinText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

// Styled components for modal
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
  participateButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#2979FF",
    borderRadius: 50, // Make it circular
    alignItems: "center",
  },
  participateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};