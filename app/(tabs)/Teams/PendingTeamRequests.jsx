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
import { useRouter, useLocalSearchParams } from "expo-router";
import BackArrowHeader from "@/components/headers/BackArrowHeader.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchPendingTeamRequests,
  acceptTeamJoinRequest,
  rejectTeamJoinRequest,
} from "@/service/TeamRequestServiceSupabase";
import { getUsernameByUserId } from "@/service/UserServiceFirebase";

const PendingTeamRequests = () => {
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usernames, setUsernames] = useState({});
  const { teamId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requests = await fetchPendingTeamRequests(teamId);
      setTeamRequests(requests);

      // Fetch usernames for each user request
      const usernamesData = {};
      for (const request of requests) {
        const username = await getUsernameByUserId(request.user_id);
        usernamesData[request.user_id] = username || "Unknown User";
      }
      setUsernames(usernamesData);
    } catch (error) {
      console.error("Error fetching team requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const requests = await fetchPendingTeamRequests(teamId);
      setTeamRequests(requests);

      // Refresh usernames
      const usernamesData = {};
      for (const request of requests) {
        const username = await getUsernameByUserId(request.user_id);
        usernamesData[request.user_id] = username || "Unknown User";
      }
      setUsernames(usernamesData);
    } catch (error) {
      console.error("Error refreshing requests:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTeamRequest = async (requestId, status, userId) => {
    try {
      if (status === "accepted") {
        await acceptTeamJoinRequest(requestId, teamId, userId);
      } else if (status === "rejected") {
        await rejectTeamJoinRequest(requestId);
      }

      setTeamRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );
    } catch (error) {
      console.error(`Error handling team request: ${error.message}`);
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
      <Text style={{ fontSize: 16 }}>
        {usernames[item.user_id] || "Loading..."}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#28A745",
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() =>
            handleTeamRequest(item.request_id, "accepted", item.user_id)
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
            handleTeamRequest(item.request_id, "rejected", item.user_id)
          }
        >
          <Feather name="x" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FF6100" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <FlatList
        data={teamRequests}
        keyExtractor={(item) => `${item.id}-${item.user_id}`}
        renderItem={renderRequest}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>No pending team requests</Text>
          </View>
        }
      />
    </View>
  );
};

export default PendingTeamRequests;
