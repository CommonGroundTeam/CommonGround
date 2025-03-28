import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ViewTeamsHeader from "@/components/headers/ViewTeamsHeader.jsx";
import { fetchUserTeamsFromFirebase } from "@/service/UserServiceFirebase.jsx";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const ViewTeams = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const userTeams = await fetchUserTeamsFromFirebase(user.uid);

      const sortedTeams = userTeams.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setTeams(sortedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [])
  );

  const renderTeam = ({ item }) => (
    <TouchableOpacity
      className="p-4 bg-orange-100 rounded-lg mx-4 my-2 flex-row justify-between items-center shadow"
      onPress={() =>
        router.push({
          pathname: "/Teams/TeamDetails",
          params: { item: JSON.stringify(item) },
        })
      }
    >
      <View>
        <Text className="text-lg font-bold text-orange-600">{item.name}</Text>
        <Text className="text-sm text-gray-600">
          {item.preferences.leader == user.uid ? "Leader" : "Member"}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color="#FF6100" />
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View className="mt-10 p-5 items-center bg-orange-50 rounded-lg mx-5">
      {/* Show message only if user has no teams */}
      {teams.length === 0 && (
        <Text className="text-lg text-gray-600 text-center mb-4">
          Create or join teams to connect with members and organize events.
        </Text>
      )}

      <TouchableOpacity
        className="bg-orange-500 p-3 rounded-full w-full mb-3"
        onPress={() => router.push("/Teams/CreateTeam")}
      >
        <Text className="text-white font-bold text-center text-lg">
          Create a Team
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-orange-500 p-3 rounded-full w-full"
        onPress={() => router.push("/Teams/FindTeam")}
      >
        <Text className="text-orange-500 font-bold text-center text-lg">
          Join a Team
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white pb-20">
      {/* Added padding-bottom */}
      <ViewTeamsHeader />
      <Text className="text-2xl font-bold my-5 mx-5">Your Teams</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6100" />
      ) : teams.length > 0 ? (
        <FlatList
          data={teams}
          renderItem={renderTeam}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        /** No Teams Found Message **/
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">No teams found.</Text>
          {renderFooter()}
        </View>
      )}
    </View>
  );
};

export default ViewTeams;
