import { FlatList, View } from "react-native";
import React from "react";
import ChatCard from "./ChatCard";
import { router } from "expo-router";

const ChatList = ({ users, currentUser }) => {
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1 }}
        keyExtractor={(item) => item.userId}
        showVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatCard
            item={item}
            router={router}
            index={index}
            currentUser={currentUser}
          />
        )}
      />
    </View>
  );
};

export default ChatList;
