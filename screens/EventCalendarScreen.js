import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [dates, setDates] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); // Track start of the displayed week

  useEffect(() => {
    generateCalendarDates(currentWeekStart);
    fetchEvents();
  }, [currentWeekStart]);

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

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Event Calendar</Title>
        <ProfileImage source={{ uri: "https://i.pravatar.cc/150?img=3" }} />
      </Header>

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
        <EventItem key={index}>
          <Time>{event.time}</Time>
          <EventCard>
            <EventText>{event.title}</EventText>
            <EventSubText>{event.description}</EventSubText>
            <EventSubText>{event.location}</EventSubText>
          </EventCard>
        </EventItem>
      ))
  ) : (
    <Text>No events available</Text>
  )}
</ScrollView>


)}


      {/* Reminder */}
      <SectionTitle>Reminder</SectionTitle>
      <ReminderText>Don't forget your schedule for tomorrow</ReminderText>

      <ReminderCard>
        <IconContainer>
          <Icon name="event" size={24} color="white" />
        </IconContainer>
        <ReminderTime>12:00 - 16:00</ReminderTime>
      </ReminderCard>

      {/* Join Button */}
      <JoinButton>
        <JoinText>JOIN</JoinText>
      </JoinButton>
    </Container>
  );
};

export default EventCalendar;

const Container = styled.View`
  flex: 1;
  background-color: #f9fbff;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const WeekNavigation = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const NavButton = styled.TouchableOpacity`
  background-color: #2979ff;
  padding: 10px;
  border-radius: 5px;
`;

const DateStrip = styled.View`
  flex-direction: row;
  justify-content: space-around;
  flex: 1;
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
