import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchEventsByUser } from "../../../service/UserEventsSupabaseService";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Events = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);

      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      const userId = user.uid;

      try {
        // Fetch relationships from Supabase
        const userEventRelations = await fetchEventsByUser(userId);
        if (!userEventRelations || userEventRelations.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        // Fetch event details from Firestore
        const eventPromises = userEventRelations.map(async (relation) => {
          const eventDoc = await getDoc(doc(db, "event", relation.event_id));
          if (eventDoc.exists()) {
            return { id: eventDoc.id, ...eventDoc.data() };
          }
          console.error(
            `Event with ID ${relation.event_id} not found in Firestore.`
          );
          return null;
        });

        const resolvedEvents = await Promise.all(eventPromises);
        setEvents(resolvedEvents.filter((event) => event !== null));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "start",
        paddingBottom: 100,
      }}
      className="p-5 bg-white"
    >
      <Text className="text-3xl font-bold text-gray-800 mb-5">All Events</Text>

      {events.length > 0 ? (
        events.map((event, index) => (
          <View
            key={index}
            className="mb-4 p-5 bg-gray-100 rounded-xl shadow-md w-full"
          >
            <Text className="text-xl font-bold text-gray-800">
              {event.name}
            </Text>
            <Text className="text-lg text-gray-600 mt-2">{event.location}</Text>
            <Text className="text-lg text-gray-700 mt-1">
              {/* Convert Firestore Timestamp to a readable date */}
              {event.date?.toDate
                ? event.date.toDate().toLocaleDateString()
                : "Unknown Date"}
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              {event.details}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-lg text-gray-500 mt-5">
          No events found for the current user.
        </Text>
      )}

      {/* Add Event Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#FF6100",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          alignSelf: "center",
        }}
        onPress={() => router.push("/Profile/AddEvents")}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Events;
