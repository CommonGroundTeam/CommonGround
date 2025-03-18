import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchUsersByUsername } from "@/service/UserServiceFirebase";
import BackArrowHeader from "@/components/headers/BackArrowHeader.jsx";
import { Feather } from "react-native-vector-icons";

const findUser = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchUsersByUsername(username);
      setResults(users);
    };

    fetchData();
  }, [username]);

  const openUserProfile = (item) => {
    router.push({
      pathname: "/Chat/userProfile",
      params: { item: JSON.stringify(item) },
    });
  };

  const renderUserItem = (item, index) => (
    <TouchableOpacity
      onPress={() => openUserProfile(item)}
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
      <Text style={{ fontSize: 16, color: "#333" }}>{item.username}</Text>
    </TouchableOpacity>
  );

  const clearSearch = () => {
    setUsername("");
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
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
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
          {username ? (
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
          {results.length > 0 ? (
            results.map((item, index) => renderUserItem(item, index))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text>No users found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default findUser;
