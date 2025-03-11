import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import ChatRoomHeader from "../../../components/ChatRoomHeader.jsx";
import CustomKeyboardView from "../../../components/CustomKeyboardView.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getRoomId } from "../../../utils/common.js";
import {
  createRoomIfNotExists,
  fetchRoomMessages,
} from "@/service/RoomServiceFirebase";
import {
  sendMessage,
  listenForMessages,
} from "@/service/MessageServiceFirebase";
import { getUsernameByUserId } from "@/service/UserServiceFirebase";
import MessageList from "../../../components/MessageList.jsx";

const ios = Platform.OS === "ios";

export default function chatRoom() {
  const { item } = useLocalSearchParams();
  const parsedItem = JSON.parse(item);
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef("");
  const scrollViewRef = useRef(null);

  const roomId = getRoomId(user?.uid, parsedItem?.userId);

  useEffect(() => {
    const fetchAndListenMessages = async () => {
      const messagesRef = await fetchRoomMessages(roomId);

      const unsubscribe = listenForMessages(messagesRef, (fetchedMessages) => {
        setMessages(fetchedMessages);
        updateScrollView();
      });

      return () => {
        unsubscribe();
      };
    };

    fetchAndListenMessages();
  }, []);

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;

    try {
      const senderName = await getUsernameByUserId(user?.uid);

      await createRoomIfNotExists(roomId, [user?.uid, parsedItem?.userId]);

      const messagesRef = await fetchRoomMessages(roomId);

      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      await sendMessage(messagesRef, {
        userId: user?.uid,
        text: message,
        senderName: senderName || "Unknown",
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert("Message", error.message);
      console.log(error.message);
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-60">
      <ChatRoomHeader user={parsedItem} router={router} />
      <CustomKeyboardView inChat={true}>
        <View style={{ flex: 1 }}>
          <MessageList
            messages={messages}
            currentUser={user}
            scrollViewRef={scrollViewRef}
          />
        </View>
        <View style={{ marginBottom: -1 }}>
          <View className="flex-row justify-between py-3 bg-white border p-2 border-neutral-200">
            <TextInput
              ref={inputRef}
              onChangeText={(value) => (textRef.current = value)}
              placeholder="Type a message"
              className="flex-1 p-3 bg-gray-100 rounded-xl text-gray-800 mb-1"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              className="ml-2 p-3 bg-primary rounded-full"
            >
              <Feather name="send" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
}
