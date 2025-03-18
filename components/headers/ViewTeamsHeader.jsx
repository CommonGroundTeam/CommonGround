import { TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ViewTeamsHeader = () => {
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
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Add Team Button */}
      <TouchableOpacity
        onPress={() => router.push("/Teams/CreateTeam")}
        style={{ padding: 5 }}
      >
        <Feather name="plus" size={24} color="#FF6100" />
      </TouchableOpacity>
    </View>
  );
};

export default ViewTeamsHeader;
