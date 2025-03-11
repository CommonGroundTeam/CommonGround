import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ChatHeader from "../../../components/ChatHeader.jsx";
import ChatList from "../../../components/ChatList.jsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext.jsx";
import { listenToChatRoomsWithDetails } from "@/service/RoomServiceFirebase";
import { router } from "expo-router";
import { listenToLatestMessages } from "@/service/MessageServiceFirebase.jsx";

const ChatMenu = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeRooms;
    const messageListeners = [];

    const updateUsersWithLatestMessage = (roomId, latestMessage) => {
      setUsers((prevUsers) =>
        prevUsers
          .map((user) =>
            user.roomId === roomId ? { ...user, latestMessage } : user
          )
          .sort((a, b) => {
            const aTime =
              a?.latestMessage?.createdAt?.seconds ||
              a?.createdAt?.seconds ||
              0;
            const bTime =
              b?.latestMessage?.createdAt?.seconds ||
              b?.createdAt?.seconds ||
              0;
            return bTime - aTime;
          })
      );
    };

    if (user?.uid) {
      setLoading(true);

      unsubscribeRooms = listenToChatRoomsWithDetails(
        user.uid,
        async (rooms) => {
          try {
            const chatUsers = rooms.map((room) => ({
              ...room.otherUser,
              latestMessage: room.latestMessage,
              roomId: room.roomId,
              createdAt: room.createdAt,
            }));

            const sortedUsers = chatUsers.sort((a, b) => {
              const aTime =
                a?.latestMessage?.createdAt?.seconds ||
                a?.createdAt?.seconds ||
                0;
              const bTime =
                b?.latestMessage?.createdAt?.seconds ||
                b?.createdAt?.seconds ||
                0;
              return bTime - aTime;
            });

            setUsers(sortedUsers);

            chatUsers.forEach((user) => {
              if (user.roomId) {
                const unsubscribe = listenToLatestMessages(
                  user.roomId,
                  (latestMessage) =>
                    updateUsersWithLatestMessage(user.roomId, latestMessage)
                );
                messageListeners.push(unsubscribe);
              }
            });
          } catch (error) {
            console.error("Error updating chat list:", error);
            setUsers([]);
          } finally {
            setLoading(false);
          }
        }
      );
    }

    return () => {
      if (unsubscribeRooms) unsubscribeRooms();
      messageListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [user?.uid]);

  const handleAddChat = () => {
    router.push("/(tabs)/Chat/findUser");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChatHeader onAddChat={handleAddChat} />
      <StatusBar style="light" />

      {loading ? (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      ) : users.length > 0 ? (
        <ChatList users={users} currentUser={user} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <Text>No chats found.</Text>
        </View>
      )}
    </View>
  );
};

export default ChatMenu;
