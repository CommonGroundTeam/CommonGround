import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { formatDate, getRoomId } from "../utils/common.js";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

export default function ChatCard({ item, router, currentUser }) {
  const [lastMessage, setLastMessage] = useState(undefined);
  useEffect(() => {
    let roomId = getRoomId(currentUser?.uid, item?.userId);
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unsub;
  }, []);

  const openChatRoom = () => {
    router.push({ pathname: "/Chat/chatRoom", params: item });
  };

  const renderLastMessage = () => {
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser?.uid == lastMessage?.userId) {
        return "You: " + lastMessage?.text;
      } else {
        return lastMessage?.text;
      }
    } else {
      return "Say Hi! 👋";
    }
  };

  const renderTime = () => {
    if (lastMessage) {
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white border-b border-gray-200"
      onPress={openChatRoom}
    >
      {/* change to use expo image when images are uploaded */}
      <Image
        source={require("../assets/icons/avatar.png")}
        style={{ height: hp(6), aspectRatio: 1 }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1 gap-1">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
          {item.username}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {renderLastMessage()}
        </Text>
      </View>
      <View className="items-end pb-2">
        <Text className="text-xs text-gray-400">{renderTime()}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color="#bbb"
          style={{ marginTop: 5 }}
        />
      </View>
    </TouchableOpacity>
  );
}
