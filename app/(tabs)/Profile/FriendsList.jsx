import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";  // Assuming you're using the router for navigation

const FriendsList = () => {
  const router = useRouter();

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

  return (
    <ScrollView className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-5">Friends List</Text>
      
      {friends.map((friend, index) => (
        <View key={index} className="flex-row items-center mb-4 p-4 bg-white rounded-lg shadow-md">
          <Image source={{ uri: friend.profileImg }} className="w-12 h-12 rounded-full mr-4" />
          <Text className="text-lg font-bold text-gray-800">{friend.name}</Text>
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
        onPress={() => router.push("/Profile/AddFriend")}  // Replace with the actual route for adding a friend
      >
        <Text className="text-white text-lg font-bold">Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FriendsList;
