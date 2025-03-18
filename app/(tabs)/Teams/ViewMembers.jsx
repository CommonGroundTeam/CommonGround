import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackArrowHeader from "@/components/headers/BackArrowHeader";
import {
  fetchTeamDetailsFromFirebase,
  removeMemberFromTeam,
} from "@/service/TeamServiceFirebase";
import { useAuth } from "@/context/AuthContext";

const ViewMembers = () => {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderId, setLeaderId] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const team = await fetchTeamDetailsFromFirebase(teamId);
      if (team) {
        setMembers(team.members || []);
        setLeaderId(team.preferences.leader);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member from the team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await removeMemberFromTeam(teamId, memberId);
              setMembers((prev) => prev.filter((m) => m.id !== memberId));
              alert("Member removed successfully.");
            } catch (error) {
              console.error("Error removing member:", error);
              alert("Failed to remove member.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderMember = ({ item }) => (
    <View className="p-4 bg-white rounded-lg mx-4 my-2 flex-row justify-between items-center shadow border border-gray-200">
      <View>
        <Text className="text-lg font-bold">{item.username}</Text>
        <Text className="text-sm text-gray-600">{item.role}</Text>
      </View>

      {/* Show remove button if user is the leader and the member is not themselves */}
      {user.uid === leaderId && item.id !== user.uid && (
        <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
          <Feather name="user-x" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <BackArrowHeader />
      <Text className="text-2xl font-bold my-5 mx-5">Team Members</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6100" />
      ) : (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center p-10">
              <Text>No members found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ViewMembers;
