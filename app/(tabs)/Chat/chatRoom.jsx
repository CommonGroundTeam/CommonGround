import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import ChatHeader from "../../../components/ChatHeader.jsx";
import CustomKeyboardView from "../../../components/CustomKeyboardView.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getRoomId } from "../../../utils/common.js";
import { FIRESTORE_DB } from "../../../firebaseConfig.js";
import {
  query,
  setDoc,
  doc,
  collection,
  Timestamp,
  addDoc,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import MessageList from "../../../components/MessageList.jsx";

const ios = Platform.OS == "ios";

export default function chatRoom() {
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef("");
  const scrollViewRef = useRef(null);

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.uid, item?.userId);
    await setDoc(doc(FIRESTORE_DB, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const getUsernameByUserId = async (userId) => {
    try {
      const usersRef = collection(FIRESTORE_DB, "users");
      const q = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData.username;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      throw new Error("Could not retrieve username.");
    }
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    const senderName = await getUsernameByUserId(user?.uid);
    try {
      let roomId = getRoomId(user?.uid, item?.userId);
      const docRef = doc(FIRESTORE_DB, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");

      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messagesRef, {
        userId: user?.uid,
        text: message,
        senderName: senderName || "Unknown",
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      Alert.alert("Message", error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    createRoomIfNotExists();
    let roomId = getRoomId(user?.uid, item?.userId);
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    const KeyBoardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unsub();
      KeyBoardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-60">
      {/* Header */}
      <ChatHeader user={item} router={router} />
      <CustomKeyboardView inChat={true}>
        {/* Chat Messages */}
        <View style={{ flex: 1 }}>
          <MessageList
            messages={messages}
            currentUser={user}
            scrollViewRef={scrollViewRef}
          />
        </View>
        {/* Input Field */}
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
