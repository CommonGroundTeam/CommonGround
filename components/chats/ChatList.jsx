import { FlatList, ActivityIndicator, View } from "react-native";
import React from "react";
import ChatCard from "./ChatCard";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatList = ({ currentUser, users }) => {
  if (!users) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.roomId || item.userId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatCard item={item} router={router} currentUser={currentUser} />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatList;
