import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackArrowHeader from "@/components/BackArrowHeader.jsx";
import { fetchTeamDetailsFromFirebase } from "@/service/TeamServiceFirebase";
import { fetchUserById } from "@/service/UserServiceFirebase";
import { fetchUserTeams } from "@/service/UserTeamServiceSupabase";
import { sendJoinRequest } from "../../../service/TeamRequestServiceSupabase";
import { useAuth } from "@/context/AuthContext.jsx";
import { Feather } from "@expo/vector-icons";

const TeamDetails = () => {
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderName, setLeaderName] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (item) {
      fetchTeamData();
    }
  }, [item]);

  const handleJoinRequest = async () => {
    try {
      await sendJoinRequest(team.id, user.uid);
      alert("Join request sent successfully!");
    } catch (error) {
      alert(error.message || "Failed to send join request.");
    }
  };

  const fetchTeamData = async () => {
    try {
      const parsedItem = JSON.parse(item);
      const teamDetails = await fetchTeamDetailsFromFirebase(parsedItem?.id);
      if (!teamDetails) {
        throw new Error("Team not found in database");
      }

      setTeam(teamDetails);

      // Fetch leader name
      if (teamDetails.preferences?.leader) {
        const leader = await fetchUserById(teamDetails.preferences.leader);
        setLeaderName(leader?.username || "Unknown Leader");

        // Check if the user is the leader
        setIsLeader(user.uid === teamDetails.preferences.leader);
      }

      // Check if user is a member of this team
      const userTeams = await fetchUserTeams();
      const isUserInTeam = userTeams.some((t) => t.id === parsedItem?.id);
      setIsMember(isUserInTeam);
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg font-bold text-gray-600">Team not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <BackArrowHeader />
      <ScrollView className="flex-1 p-5">
        {/* Centered Team Name & Category */}
        <View className="items-center mb-5">
          <Text className="text-5xl font-bold text-orange-600 text-center">
            {team.name}
          </Text>
          <Text className="text-lg font-bold text-gray-600">
            {team.category}
          </Text>
          <Text className="text-sm text-gray-700">{team.details}</Text>
        </View>

        {/* Action Buttons - Aligned in a Row */}
        <View className="mt-3 flex-row justify-between bg-orange-500 p-3 px-10 rounded-lg">
          {/* Leader Buttons */}
          {isLeader && (
            <>
              <TouchableOpacity onPress={() => alert("Message Team")}>
                <Feather name="message-circle" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("View members")}>
                <Feather name="users" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/Teams/PendingTeamRequests",
                    params: { teamId: team.id },
                  })
                }
              >
                <Feather name="user-plus" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("Share team")}>
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => alert("Manage roles")}>
                <Feather name="settings" size={24} color="white" />
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={() => alert("Delete Team")}>
                <Feather name="trash-2" size={24} color="white" />
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={() => alert("View Join Requests")}>
                <Feather name="user-check" size={24} color="white" />
              </TouchableOpacity> */}
            </>
          )}

          {/* Member Buttons */}
          {isMember && !isLeader && (
            <>
              <TouchableOpacity onPress={() => alert("Message Team")}>
                <Feather name="message-circle" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("View Members")}>
                <Feather name="users" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => alert("Leave Team")}>
                <Feather name="log-out" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("Share team")}>
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}

          {/* Non-Member Buttons */}
          {!isMember && !isLeader && (
            <>
              <TouchableOpacity onPress={handleJoinRequest}>
                <Feather name="user-check" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("Share team")}>
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Team Details Section */}
        <View className="mt-5 bg-orange-100 p-5 rounded-lg">
          <Text className="text-xl font-bold text-orange-600 mb-3">
            Team Details
          </Text>

          <Text className="text-m font-bold text-gray-700">Leader</Text>
          <Text className="text-sm text-gray-700 mb-3">@{leaderName}</Text>

          <Text className="text-sm font-bold text-gray-700">
            Privacy Setting
          </Text>
          <Text className="text-base text-gray-700 mb-3">
            {team.preferences?.visibility}
          </Text>
          <Text className="text-sm font-bold text-gray-700">Tags</Text>
          <Text className="text-base text-gray-700 mb-3">
            {team.preferences?.tags || "None"}
          </Text>

          <Text className="text-sm font-bold text-gray-700">
            Preferred Location
          </Text>
          <Text className="text-base text-gray-700">
            {team.preferences?.location}
          </Text>
        </View>

        {/* Team Events Section */}
        <View className="mt-5 bg-orange-100 p-5 rounded-lg">
          <Text className="text-xl font-bold text-orange-600 mb-3">
            Team Events
          </Text>
          <Text className="text-gray-700">No upcoming events. Stay tuned!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeamDetails;
