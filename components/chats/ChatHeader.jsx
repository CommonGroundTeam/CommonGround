import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ChatHeader = ({ onAddChat }) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: top + 10,
        paddingHorizontal: 15,
        paddingBottom: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Pending Friend Requests Button */}
      <TouchableOpacity
        onPress={() => router.push("/Chat/pendingFriendRequests")}
        style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
      >
        <Feather name="user-check" size={24} color="#FF6100" />
      </TouchableOpacity>

      {/* Add Chat Button */}
      <TouchableOpacity onPress={onAddChat} style={{ padding: 5 }}>
        <Feather name="plus" size={24} color="#FF6100" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;
