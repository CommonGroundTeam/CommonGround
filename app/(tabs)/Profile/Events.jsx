import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Assuming you are using a router to navigate
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome for the icon

const Events = () => {
  const router = useRouter();

  const events = [
    {
      name: "New Year's Eve Party",
      location: "3 Critchon Close",
      date: "2024-12-31",
      details: "Celebrate the New Year with friends and mj!"
    },
    {
      name: "Mahjong session",
      location: "4 Jalan Mas Puteh",
      date: "2024-01-10",
      details: "Win jons money."
    },
    {
      name: "CNY celebrations",
      location: "BT hse",
      date: "2024-01-15",
      details: "Join us to celebrate CNY together."
    },
  ];

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "start", paddingBottom: 100 }}
      className="p-5 bg-white"
    >
      <Text className="text-3xl font-bold text-gray-800 mb-5">All Events</Text>
      
      {events.map((event, index) => (
        <View key={index} className="mb-4 p-5 bg-gray-100 rounded-xl shadow-md w-full">
          <Text className="text-xl font-bold text-gray-800">{event.name}</Text>
          <Text className="text-lg text-gray-600 mt-2">{event.location}</Text>
          <Text className="text-lg text-gray-700 mt-1">{event.date}</Text>
          <Text className="text-base text-gray-500 mt-1">{event.details}</Text>
        </View>
      ))}
      
      {/* Add Event Button with Circular Plus Icon */}
      <TouchableOpacity
        style={{
          marginTop: 20, // Adds space between the last event and the button
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#FF6100", // Primary color
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          alignSelf: "center",  // Centers the button horizontally
        }}
        onPress={() => router.push("/Profile/AddEvent")}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Events;
