import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const ProfilePage = () => {
  const router = useRouter();

  const userData = {
    username: "arthurcyf",
    userImg: "https://ih1.redbubble.net/image.3234094934.5591/fcp,small,wall_texture,product,750x1000.webp", // Sample image URL
    userDescription: "Hi my name is Arthur, and I love playing mahjong and meeting new people!",  // Sample description
  };

  // Ensure events and friends are always arrays
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

  const friends = [
    {
      name: "Brandon",
      profileImg: "https://ih1.redbubble.net/image.3234104650.5841/st,small,507x507-pad,600x600,f8f8f8.jpg",
    },
    {
      name: "Shiru",
      profileImg: "https://ih1.redbubble.net/image.3234104228.5826/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    },
    {
      name: "Jon",
      profileImg: "https://ih1.redbubble.net/image.3226609122.9303/st,large,507x507-pad,600x600,f8f8f8.jpg",
    },
  ];

  const primaryColor = "#FF6100";  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff", paddingTop: 40, paddingBottom: 100 }}>
      {/* Edit Profile and Settings Icons */}
      <View style={{ position: "absolute", top: 40, left: 40, right: 20, flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
        {/* Edit Profile Button */}
        <TouchableOpacity onPress={() => router.push("/Profile/EditProfile")}>
          <Icon name="edit" size={30} color="#333" />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity onPress={() => router.push("/Profile/Settings")}>
          <Icon name="gear" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <Image source={{ uri: userData.userImg }} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }} />
      
      {/* Username */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>@{userData.username}</Text>

      {/* User Description */}
      <Text style={{ fontSize: 16, color: "#777", textAlign: "center", marginTop: 10, paddingHorizontal: 20 }}>
        {userData.userDescription}
      </Text>

      {/* Upcoming Events Section */}
      <View style={{ width: "100%", marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 }}>
        <TouchableOpacity onPress={() => router.push("/Profile/Events")}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>Upcoming Events</Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 10 }}>
          {(events && Array.isArray(events)) ? (
            events.map((event, index) => (
              <View key={index} style={{ marginBottom: 15, padding: 15, backgroundColor: "#fff", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{event.name}</Text>
                <Text style={{ fontSize: 16, color: "#777", marginVertical: 5 }}>{event.location}</Text>
                <Text style={{ fontSize: 16, color: "#444", marginVertical: 5 }}>{event.date}</Text>
                <Text style={{ fontSize: 14, color: "#555" }}>{event.details}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: "#777" }}>No upcoming events</Text>
          )}
        </View>

        {/* View More Button */}
        <TouchableOpacity 
          style={{ marginTop: 10, padding: 10, alignItems: "center", justifyContent: "center", backgroundColor: primaryColor, borderRadius: 5 }} 
          onPress={() => router.push("/Profile/Events")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Friends Section */}
      <View style={{ width: "100%", marginTop: 30, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 }}>
        <TouchableOpacity onPress={() => router.push("/Profile/FriendsList")}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>Friends</Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 20 }}>
          {(friends && Array.isArray(friends)) ? (
            friends.map((friend, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, padding: 15, backgroundColor: "#fff", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 }}>
                <Image source={{ uri: friend.profileImg }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333", flex: 1 }}>{friend.name}</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, marginLeft: 5, backgroundColor: primaryColor, justifyContent: "center", alignItems: "center" }}
                    onPress={() => alert(`Starting a chat with ${friend.name}.`)}
                  >
                    <Icon name="comments" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, marginLeft: 5, backgroundColor: primaryColor, justifyContent: "center", alignItems: "center" }}
                    onPress={() => alert(`${friend.name} has been removed from your friends list.`)}
                  >
                    <Icon name="trash" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: "#777" }}>No friends added</Text>
          )}
        </View>

        {/* View More Button */}
        <TouchableOpacity 
          style={{ marginTop: 10, padding: 10, alignItems: "center", justifyContent: "center", backgroundColor: primaryColor, borderRadius: 5 }} 
          onPress={() => router.push("/Profile/FriendsList")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>View More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
