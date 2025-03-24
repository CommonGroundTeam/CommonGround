import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
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

  const renderRightActions = (progress, dragX, memberId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => handleRemoveMember(memberId)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          backgroundColor: "#DC3545",
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="user-x" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderMember = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        user.uid === leaderId && item.id !== user.uid
          ? renderRightActions(progress, dragX, item.id)
          : null
      }
      overshootRight={false}
    >
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200"
        onPress={() =>
          router.push({
            pathname: "/UserProfile",
            params: { item: JSON.stringify({ userId: item.id }) },
          })
        }
      >
        <Feather
          name="user"
          size={24}
          color="#FF6100"
          style={{ marginRight: 10 }}
        />
        <Text className="text-lg font-bold text-gray-800 flex-1">
          {item.username}
        </Text>

        <Text className="text-sm text-gray-500">{item.role}</Text>
      </TouchableOpacity>
    </Swipeable>
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
