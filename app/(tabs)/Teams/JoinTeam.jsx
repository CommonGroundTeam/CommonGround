import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchTeamsByName } from "@/service/TeamServiceFirebase.jsx";
import BackArrowHeader from "@/components/BackArrowHeader.jsx";
import { Feather } from "@expo/vector-icons";

const JoinTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (teamName) {
      const fetchData = async () => {
        setLoading(true);
        const teams = await fetchTeamsByName(teamName);
        setResults(teams);
        setLoading(false);
      };

      fetchData();
    } else {
      setResults([]);
    }
  }, [teamName]);

  const openTeamProfile = (item) => {
    router.push({
      pathname: "/Teams/TeamDetails",
      params: { item: JSON.stringify(item) },
    });
  };

  const renderTeamItem = (item, index) => (
    <TouchableOpacity
      onPress={() => openTeamProfile(item)}
      key={item.id}
      style={{
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: "#fff",
        borderTopWidth: index === 0 ? 1 : 0,
        borderBottomWidth: 1,
        borderBottomColor: "#FF6100",
        borderColor: "#FF6100",
        marginBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16, color: "#333" }}>{item.name}</Text>
      <Feather name="chevron-right" size={20} color="#FF6100" />
    </TouchableOpacity>
  );

  const clearSearch = () => {
    setTeamName("");
    setResults([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <View style={{ padding: 20 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            backgroundColor: "#fff",
            padding: 5,
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            height: 55,
          }}
        >
          <TextInput
            placeholder="Search for a team"
            value={teamName}
            onChangeText={setTeamName}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              fontSize: 16,
              color: "#333",
              flex: 1,
              height: "100%",
              textAlignVertical: "center",
            }}
          />
          {teamName ? (
            <TouchableOpacity onPress={clearSearch}>
              <Feather name="x" size={24} color="#FF6100" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            backgroundColor: "#fff",
            overflow: "hidden",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FF6100" />
          ) : results.length > 0 ? (
            results.map((item, index) => renderTeamItem(item, index))
          ) : teamName ? (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text>No teams found</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default JoinTeam;
