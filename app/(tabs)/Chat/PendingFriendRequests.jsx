import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext.jsx";
import { useRouter } from "expo-router";
import BackArrowHeader from "@/components/headers/BackArrowHeader.jsx";
import {
  fetchPendingFriendRequests,
  updateFriendRequestStatus,
  deleteFriendRequest,
} from "@/service/FriendRequestServiceFirebase";
import { addFriends } from "@/service/FriendServiceFirebase";
import { createRoomIfNotExists } from "@/service/RoomServiceFirebase";

const PendingFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requests = await fetchPendingFriendRequests(user.uid);
      setFriendRequests(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const requests = await fetchPendingFriendRequests(user.uid);
      setFriendRequests(requests);
    } catch (error) {
      console.error("Error refreshing friend requests:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFriendRequest = async (requestId, status, senderId) => {
    try {
      if (status === "accepted") {
        await addFriends(user.uid, senderId);

        const roomId = [user.uid, senderId].sort().join("-");
        await createRoomIfNotExists(roomId, [user.uid, senderId]);
      } else if (status === "rejected") {
        await deleteFriendRequest(requestId);
      }

      await updateFriendRequestStatus(requestId, status);

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(`Error handling friend request: ${error.message}`);
    }
  };

  const renderRequest = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Request Info */}
      <Text style={{ fontSize: 16 }}>{item.senderUsername}</Text>

      {/* Accept & Reject Buttons */}
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#28A745",
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() =>
            handleFriendRequest(item.id, "accepted", item.senderId)
          }
        >
          <Feather name="check" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#DC3545",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() =>
            handleFriendRequest(item.id, "rejected", item.senderId)
          }
        >
          <Feather name="x" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <BackArrowHeader />
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>No pending friend requests</Text>
          </View>
        }
      />
    </View>
  );
};

export default PendingFriendRequests;
