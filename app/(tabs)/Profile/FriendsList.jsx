import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { fetchFriendsWithDetails } from "@/service/FriendServiceFirebase";
import {
  getUsernameByUserId,
  getDescriptionByUserId,
  getProfilePictureByUserId,
} from "@/service/UserServiceFirebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { FontAwesome5 } from "@expo/vector-icons";

const FriendsList = () => {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.warn("User not logged in.");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      try {
        const friendIds = await fetchFriendsWithDetails(userId);

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

        setFriends(friendDetails);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleChat = (friendId) => {
    console.log("Starting chat with user:", friendId);
    router.push(`/chat/${friendId}`);
  };

  const handleDelete = (friendId) => {
    console.log("Deleting friend:", friendId);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-5">
        Friends List
      </Text>

      {friends.map((friend) => (
        <View
          key={friend.userId}
          className="flex-row items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-md"
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: friend.profileImg }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-bold text-gray-800">
                {friend.name}
              </Text>
              <Text className="text-sm text-gray-600">
                {friend.description}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row">
            {/* Chat Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#FF6100",
                width: 40,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10, // Added margin between buttons
              }}
              onPress={() => handleChat(friend.userId)}
            >
              <FontAwesome5 name="comment-alt" size={20} color="white" />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#FF6100",
                width: 40,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => handleDelete(friend.userId)}
            >
              <FontAwesome5 name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add Friend Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#FF6100",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        onPress={() => router.push("/Profile/AddFriend")}
      >
        <Text className="text-white text-lg font-bold">Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FriendsList;
