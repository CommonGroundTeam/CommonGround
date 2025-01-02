import React from "react";
import { ScrollView } from "react-native";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, currentUser, scrollViewRef }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
      ref={scrollViewRef}
    >
      {messages.map((message, index) => {
        return (
          <MessageItem
            message={message}
            key={index}
            currentUser={currentUser}
          />
        );
      })}
    </ScrollView>
  );
}
