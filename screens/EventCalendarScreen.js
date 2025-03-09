import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const EventCalendar = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Event Calendar</Title>
        <ProfileImage source={{ uri: "https://i.pravatar.cc/150?img=3" }} />
      </Header>

      {/* Date Strip */}
      <DateStrip>
        {["18 Mo", "19 Tu", "20 Wed", "21 Th", "22 Fr", "23 Sa", "24 Su"].map(
          (date, index) => (
            <DateItem key={index} active={index === 3}>
              <DateText active={index === 3}>{date.split(" ")[0]}</DateText>
              <DateSubText active={index === 3}>{date.split(" ")[1]}</DateSubText>
            </DateItem>
          )
        )}
      </DateStrip>

      {/* Today's Events */}
      <SectionTitle>Today's Events</SectionTitle>
      <ScrollView>
        <EventItem>
          <Time>15:00</Time>
          <EventCard>
            <EventText>IEEE Club SMU</EventText>
            <EventSubText>Tech Talk: Future of AI</EventSubText>
            <EventSubText>B001</EventSubText>
            <Attendees>
              <Avatar source={{ uri: "https://i.pravatar.cc/40?img=4" }} />
              <Avatar source={{ uri: "https://i.pravatar.cc/40?img=5" }} />
            </Attendees>
          </EventCard>
        </EventItem>

        <EventItem>
          <Time>17:00</Time>
          <EventCard>
            <EventText>Melodies Club SMU</EventText>
            <EventSubText>Jam Session</EventSubText>
            <EventSubText>Music Room</EventSubText>
            <Attendees>
              <Avatar source={{ uri: "https://i.pravatar.cc/40?img=6" }} />
              <Avatar source={{ uri: "https://i.pravatar.cc/40?img=7" }} />
            </Attendees>
          </EventCard>
        </EventItem>
      </ScrollView>

      {/* Reminders */}
      <SectionTitle>Reminder</SectionTitle>
      <ReminderText>Don't forget your schedule for tomorrow</ReminderText>

      <ReminderCard>
        <IconContainer>
          <Icon name="event" size={24} color="white" />
        </IconContainer>
        <ReminderTime>12:00 - 16:00</ReminderTime>
      </ReminderCard>

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

const DateStrip = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

const DateItem = styled.View`
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

const Attendees = styled.View`
  flex-direction: row;
  margin-top: 5px;
`;

const Avatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: -8px;
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
