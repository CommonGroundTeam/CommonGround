import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getDescriptionByUserId,
  getUsernameByUserId,
  getProfilePictureByUserId,
} from "@/service/UserServiceFirebase";
import { fetchEventsByUser } from "@/service/UserEventsSupabaseService";
import {
  getEventNameById,
  getEventDateById,
  getEventLocationById,
  getEventDetailsById,
} from "@/service/EventServiceFirebase";
import { fetchFriendsWithDetails } from "@/service/FriendServiceFirebase";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const primaryColor = "#FF6100";

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is currently logged in.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const username = await getUsernameByUserId(currentUser.uid);
        const userImg = await getProfilePictureByUserId(currentUser.uid);
        const userDescription = await getDescriptionByUserId(currentUser.uid);

        setUserData({
          username: username || "Unknown",
          userImg: userImg || "https://via.placeholder.com/150",
          userDescription: userDescription || "No description provided.",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserEvents = async () => {
      try {
        const events = await fetchEventsByUser(currentUser.uid);
        console.log("Fetched events:", events);
        if (!events || events.length === 0) {
          console.error("No events found for the user.");
          setUserEvents([]);
          return;
        }

        const userEvents = await Promise.all(
          events.map(async (event) => {
            const id = event.event_id || "Unknown";
            console.log("Fetching details for event ID:", id);

            const name =
              id !== "Unknown" ? await getEventNameById(id) : "Unknown";
            const rawDate =
              id !== "Unknown" ? await getEventDateById(id) : null;
            const dateObj = rawDate ? rawDate.toDate() : null;
            const date = dateObj ? dateObj.toLocaleDateString() : "Unknown";
            const location =
              id !== "Unknown" ? await getEventLocationById(id) : "Unknown";
            const details =
              id !== "Unknown"
                ? await getEventDetailsById(id)
                : "No details provided";

            return {
              id,
              name,
              date,
              dateObj,
              location,
              details,
            };
          })
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter, sort, and slice the events
        const sortedEvents = userEvents
          .filter((event) => event.dateObj && event.dateObj >= today)
          .sort((a, b) => a.dateObj - b.dateObj)
          .slice(0, 3);

        setUserEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching user events:", error);
        setUserEvents([]);
      }
    };

    const fetchFriends = async () => {
      try {
        const friendIds = await fetchFriendsWithDetails(currentUser.uid);

        const friendDetails = await Promise.all(
          friendIds.map(async (friend) => {
            try {
              const [username, description, profilePicture] = await Promise.all(
                [
                  getUsernameByUserId(friend.userId),
                  getDescriptionByUserId(friend.userId),
                  getProfilePictureByUserId(friend.userId),
                ]
              );

              return {
                userId: friend.userId,
                name: username || "Unknown User",
                profileImg: profilePicture || "https://via.placeholder.com/150",
                description: description || "No description provided.",
              };
            } catch (error) {
              console.error(
                `Failed to fetch details for user ${friend.userId}:`,
                error
              );
              return {
                userId: friend.userId,
                name: "Error fetching user",
                profileImg: "https://via.placeholder.com/150",
                description: "No description available.",
              };
            }
          })
        );

        setFriends(friendDetails.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data and friends
    fetchUserData();
    fetchUserEvents();
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "#333" }}>
          Unable to load user data.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingBottom: 100,
      }}
    >
      {/* Edit Profile and Settings Icons */}
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <TouchableOpacity onPress={() => router.push("/Profile/EditProfile")}>
          <Icon name="edit" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Profile/Settings")}>
          <Icon name="gear" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <Image
        source={{ uri: userData.userImg }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          marginBottom: 10,
        }}
      />

      {/* Username */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
        @{userData.username}
      </Text>

      {/* User Description */}
      <Text
        style={{
          fontSize: 16,
          color: "#777",
          textAlign: "center",
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {userData.userDescription}
      </Text>

      {/* Upcoming Events Section */}
      <View
        style={{
          width: "100%",
          marginTop: 20,
          padding: 10,
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/Profile/Events")}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Upcoming Events
          </Text>
        </TouchableOpacity>
        {userEvents.map((event, index) => (
          <View
            key={index}
            style={{
              marginBottom: 15,
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              {event.name}
            </Text>
            <Text style={{ fontSize: 16, color: "#777", marginVertical: 5 }}>
              {event.location}
            </Text>
            <Text style={{ fontSize: 16, color: "#444", marginVertical: 5 }}>
              {event.date}
            </Text>
            <Text style={{ fontSize: 14, color: "#555" }}>{event.details}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primaryColor,
            borderRadius: 5,
          }}
          onPress={() => router.push("/Profile/Events")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Friends Section */}
      <View
        style={{
          width: "100%",
          marginTop: 30,
          padding: 10,
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/Profile/FriendsList")}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Friends
          </Text>
        </TouchableOpacity>
        {friends.map((friend, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: friend.profileImg }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
                flex: 1,
              }}
            >
              {friend.name}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 5,
                  backgroundColor: primaryColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => alert(`Starting a chat with ${friend.name}.`)}
              >
                <Icon name="comments" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 5,
                  backgroundColor: primaryColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() =>
                  alert(
                    `${friend.name} has been removed from your friends list.`
                  )
                }
              >
                <Icon name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primaryColor,
            borderRadius: 5,
          }}
          onPress={() => router.push("/Profile/FriendsList")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>View More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
